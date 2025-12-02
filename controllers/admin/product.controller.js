const Product = require("../../models/product.model"); //database
const ProductCategory = require("../../models/product-category.model"); //database
const Account = require("../../models/account.model"); //database

const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus"); // lọc
const SearchHelper = require("../../helpers/search"); // tìm kiếm
const paginationHelper = require("../../helpers/pagination"); // phân trang
const createTreeHelper = require("../../helpers/createTree")
const getSubCategoryHelper = require("../../helpers/product-category")
const productsHelper = require("../../helpers/products");

// [GET] /admin/product
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  const categoryId = req.query.category_id;

  // --- 1. KHỞI TẠO BỘ LỌC ---
  let find = {
    deleted: false,
  };

  // Lọc theo trạng thái
  if (req.query.availabilityStatus) {
    if (req.query.availabilityStatus === "featured") {
      find.featured = "1";
    } else if (["In Stock", "Low Stock"].includes(req.query.availabilityStatus)) {
      find.availabilityStatus = req.query.availabilityStatus;
    }
  }

  // Search
  const objectSearch = SearchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // --- XỬ LÝ DANH MỤC  ---
  if (categoryId) {
    // 1. Lấy tất cả danh mục con
    const listSubCategory = await getSubCategoryHelper.getSubCategory(categoryId);

    // 2. Tạo mảng ID
    const listSubCategoryId = listSubCategory.map(item => item.id);
    listSubCategoryId.push(categoryId); // Thêm chính nó

    // 3. Cập nhật biến 'find'
    find.product_category_id = { $in: listSubCategoryId };
  }


  // --- PAGINATION  ---
  const countProducts = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    { currentPage: 1, limitItems: 6 },
    req.query,
    countProducts
  );


  // --- QUERY DATABASE (Lúc này biến 'find' đã có đủ dữ liệu cha con) ---
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }

  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);


  // --- XỬ LÝ THÔNG TIN NGƯỜI TẠO (Format data) ---
  for (const product of products) {
    const user = await Account.findOne({ _id: product.createdBy.account_id });
    if (user) product.accountFullName = user.fullName;

    const updatedBy = product.updatedBy.slice(-1)[0];
    if (updatedBy) {
      const userUpdated = await Account.findOne({ _id: updatedBy.account_id });
      updatedBy.accountFullName = userUpdated.fullName;
    }
  }


  // --- XỬ LÝ CÂY DANH MỤC (Cho dropdown filter) ---
  const allCategories = await ProductCategory.find({ deleted: false });
  const newProductCategory = createTreeHelper.tree(allCategories);

  let listCategoryOptions = [];
  const flattenCategories = (arr, level = 0) => {
    arr.forEach(item => {
        const prefix = Array(level + 1).join("-- ");
        listCategoryOptions.push({
            id: item.id,
            title: prefix + item.title
        });
        if(item.children && item.children.length > 0) {
            flattenCategories(item.children, level + 1);
        }
    });
  }
  flattenCategories(newProductCategory);


  // --- 7. TRẢ VỀ VIEW ---
  res.render("admin/pages/products/index", {
    pageTitle: "Trang Danh Sách Sản Phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
    listCategories: listCategoryOptions, 
    categoryId: categoryId,
  });
};

// [PATCH] /adim/product/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  // console.log(req.params); dùng để tra tên status và id
  const status = req.params.status;
  const id = req.params.id;

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }

  await Product.updateOne({ _id: id }, { 
    availabilityStatus: status,
    $push: {updatedBy: updatedBy} // cú pháp của mongoose
   });
  // hàm updateOne này dùng để update một sản phầm với các thông số truyền vào
  // tìm hiểu thêm thông tin ở mongoose -> queries

  req.flash("success", "Cập nhật trạng thái thành công");
  // sử dụng thư viện express-flash

  res.redirect(req.get("Referer") || "/");
  // thay cho res.redirect("back")
  // sau khi thay đổi trạng thái thì nó sẽ link sang trang khác để update trạng thái sản phẩm
  // nhưng khi dùng câu lệnh trên thì nó sẽ tự động back về trang cũ sau khi update
};

// [PATCH] /adim/product/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  // dùng split(", ") để convert nó thành một mảng

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }

  // sử dụng updateMany của mongoose
  switch (type) {
    case "In Stock":
      await Product.updateMany({ _id: { $in: ids } },{
        availabilityStatus: "In Stock",
        $push: {updatedBy: updatedBy} 
        }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
      );
      break;
    case "Low Stock":
      await Product.updateMany({ _id: { $in: ids } },{
        availabilityStatus: "Low Stock", 
        $push: {updatedBy: updatedBy} 
        }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
      );
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: ids },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(), 
          }
        }
      );
      req.flash("success", `Đã xóa thành công ${ids.length} sản phẩm!`);
      break;
    case "change-position":
      // vì các giá trị của position khác nhau nên ta sẽ phải sử dụng forof
      // để có thể duyệt qua từng phần tử trong mảng
      for (const item of ids) {
        let [id, position] = item.split("-"); // sau đó ta sẽ từ mảng tách chuỗi ra
        position = parseInt(position); // vì position là number nên ta phải convert lại kiểu cho dữ liệu

        await Product.updateOne(
          { _id: id },
          {
            position: position,
            $push: {updatedBy: updatedBy} 
          }
        );
      }
      req.flash(
        "success",
        `Cập nhật vị trí thành công ${ids.length} sản phẩm!`
      );
      break;
    case "delete-featured":
      await Product.updateMany({ _id: { $in: ids } },{
        featured: 0, 
        $push: {updatedBy: updatedBy} 
        }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`
      );
      break;

    default:
      break;
  }
  res.redirect(req.get("Referer") || "/");
};

// [DELETE] /adim/product/deleteItem/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({_id: id}) dùng để xóa vĩnh viễn

  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(), 
      }
    }
  );
  req.flash("success", `Xóa thành công sản phẩm!`);

  res.redirect(req.get("Referer") || "/");
};

// [GET] /adim/product/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const category = await ProductCategory.find(find);

  const newCategory = createTreeHelper.tree(category);
  res.render("admin/pages/products/create", {
    pageTitle: "Trang Thêm mới sản phẩm",
    category: newCategory
  });
};

// [POST] /adim/product/createPost
module.exports.createPost = async (req, res) => {
  // chuyển dữ liệu từ string -> number
  req.body.price = parseFloat(req.body.price);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  try {
    // nếu người dùng không nhập vị trí thì hệ thống sẽ tự động tăng thêm 1
    if (req.body.position == "") {
      const countProducts = await Product.countDocuments();
      req.body.position = countProducts + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
      account_id: res.locals.user.id
    };

    const product = new Product(req.body); // tạo mới một sản phẩm
    await product.save(); // lưu dữ liệu sản phẩm mới vào model db
  } catch (error) {
    res.redirect(req.get("Referer") || "/");
  }

  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /adim/product/edit/:id
module.exports.edit = async (req, res) => {
  // dùng try catch để tránh trường hợp tự ý ghi id linh tinh gây ra die server
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find);

    const category = await ProductCategory.find({
    deleted: false,
    });

    const newCategory = createTreeHelper.tree(category);

    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory,
    });
  } catch (error) {
    req.flash("error", "Không tồn tại sản phẩm");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [PATCH] /adim/product/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.price = parseFloat(req.body.price);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  req.body.position = parseInt(req.body.position);

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }
    req.body.updateBy = updatedBy;

    await Product.updateOne({ _id: id }, {
      ...req.body, // lấy những phần tử cũ trong req.body
      $push: {updatedBy: updatedBy} // cú pháp của mongoose
    });
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }

  res.redirect(req.get("Referer") || "/");
};

// [GET] /adim/product/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const product = await Product.findOne(find);

    if(product.product_category_id){
      const category = await ProductCategory.findOne({
        _id:product.product_category_id,
        availabilityStatus: "In Stock",
        deleted: false,
      });

      product.category.title = category;
    }

    product.priceNew = productsHelper.priceNewProduct(product);

    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    req.flash("error", "Không tồn tại sản phẩm");
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

