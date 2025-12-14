const News = require("../../models/news.model"); //database
const NewsCategory = require("../../models/news-category.model"); //database
const Account = require("../../models/account.model"); //database

const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helpers/filterStatus"); // lọc
const SearchHelper = require("../../helpers/search"); // tìm kiếm
const paginationHelper = require("../../helpers/pagination"); // phân trang
const createTreeHelper = require("../../helpers/createTree")
const getSubCategoryHelper = require("../../helpers/product-category")

// [GET] /admin/news
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper.filterStatus(req.query);
  const categoryId = req.query.category_id;

  let find = {
    deleted: false,
  }; // biến này tượng trưng cho bộ lọc

  // nếu có yêu cầu lọc thì mới sử dụng hàm này không thì thôi
  if (req.query.availabilityStatus) {
    find.availabilityStatus = req.query.availabilityStatus;
  }

  // search
  const objectSearch = SearchHelper(req.query);

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  // end search

  // --- XỬ LÝ DANH MỤC  ---
    if (categoryId) {
      // 1. Lấy tất cả danh mục con
      const listSubCategory = await getSubCategoryHelper.getSubCategory(categoryId);
  
      // 2. Tạo mảng ID
      const listSubCategoryId = listSubCategory.map(item => item.id);
      listSubCategoryId.push(categoryId); // Thêm chính nó
  
      // 3. Cập nhật biến 'find'
      find.news_category_id = { $in: listSubCategoryId };
    }

  //Pagination
  const countNews = await News.countDocuments(find);
  // dùng để đếm tổng số lượng sản phẩm có trong db

  // đây dùng để truyền đối số sang cho hàm paginationHelper
  // sau khi truyền hàm bên kia sẽ thực hiện logic và trả lại kết quả cho bên này
  // cuối cùng là update object
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 6,
    },
    req.query,
    countNews
  );
  // End pagination

  // Sort
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // End Sort

  const news = await News.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  // limit(objectPagination.limitItems) giới hạn một trang có bao nhiêu sản phẩm
  // skip(objectPagination.skip) khi bấm vào trang kế tiếp thì nó sẽ skip qua bao nhiêu sản phẩm

  for(const News of news){
    // lấy ra thông tin người tạo 
    const user = await Account.findOne({
      _id : News.createdBy.account_id
    });

    if(user){
      News.accountFullName = user.fullName
    }

    // lấy ra thông tin người câp nhật gần nhất 
    const updatedBy = News.updatedBy.slice(-1)[0]; // lấy ra bản ghi ở vị trí cuối cùng

    if(updatedBy){
      const userUpdated = await Account.findOne({
        _id : updatedBy.account_id
      });

      updatedBy.accountFullName = userUpdated.fullName
    }
  }

  // --- XỬ LÝ CÂY DANH MỤC (Cho dropdown filter) ---
    const allCategories = await NewsCategory.find({ deleted: false });
    const newNewsCategory = createTreeHelper.tree(allCategories);
  
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
    flattenCategories(newNewsCategory);


  res.render("admin/pages/news/index", {
    pageTitle: "Trang Danh Sách Tin Tức",
    news: news,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
    listCategories: listCategoryOptions, 
    categoryId: categoryId,
  });
};

// [PATCH] /admin/news/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  // console.log(req.params); dùng để tra tên status và id
  const status = req.params.status;
  const id = req.params.id;

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }

  await News.updateOne({ _id: id }, { 
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

// [PATCH] /admin/news/change-multi
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
      await News.updateMany({ _id: { $in: ids } },{
        availabilityStatus: "In Stock",
        $push: {updatedBy: updatedBy} 
        }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} tin tức!`
      );
      break;
    case "Low Stock":
      await News.updateMany({ _id: { $in: ids } },{
        availabilityStatus: "Low Stock", 
        $push: {updatedBy: updatedBy} 
        }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} tin tức!`
      );
      break;
    case "delete-all":
      await News.updateMany(
        { _id: ids },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(), 
          }
        }
      );
      req.flash("success", `Đã xóa thành công ${ids.length} tin tức!`);
      break;
    case "change-position":
      // vì các giá trị của position khác nhau nên ta sẽ phải sử dụng forof
      // để có thể duyệt qua từng phần tử trong mảng
      for (const item of ids) {
        let [id, position] = item.split("-"); // sau đó ta sẽ từ mảng tách chuỗi ra
        position = parseInt(position); // vì position là number nên ta phải convert lại kiểu cho dữ liệu

        await News.updateOne(
          { _id: id },
          {
            position: position,
            $push: {updatedBy: updatedBy} 
          }
        );
      }
      req.flash(
        "success",
        `Cập nhật vị trí thành công ${ids.length} tin tức!`
      );
      break;

    default:
      break;
  }
  res.redirect(req.get("Referer") || "/");
};

// [DELETE] /admin/news/deleteItem/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({_id: id}) dùng để xóa vĩnh viễn

  await News.updateOne(
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

// [GET] /admin/news/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const category = await NewsCategory.find(find);

  const newCategory = createTreeHelper.tree(category);
  res.render("admin/pages/news/create", {
    pageTitle: "Trang Thêm mới tin tức",
    category: newCategory
  });
};

// [POST] /admin/news/createPost
module.exports.createPost = async (req, res) => {

  try {
    // nếu người dùng không nhập vị trí thì hệ thống sẽ tự động tăng thêm 1
    if (req.body.position == "") {
      const countNews = await News.countDocuments();
      req.body.position = countNews + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    req.body.createdBy = {
      account_id: res.locals.user.id
    };

    const news = new News(req.body); // tạo mới một sản phẩm
    await news.save(); // lưu dữ liệu sản phẩm mới vào model db
  } catch (error) {
    res.redirect(req.get("Referer") || "/");
  }

  res.redirect(`${systemConfig.prefixAdmin}/news`);
};

// [GET] /admin/news/edit/:id
module.exports.edit = async (req, res) => {
  // dùng try catch để tránh trường hợp tự ý ghi id linh tinh gây ra die server
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const news = await News.findOne(find);

    const category = await NewsCategory.find({
    deleted: false,
    });

    const newCategory = createTreeHelper.tree(category);

    res.render("admin/pages/news/edit", {
      pageTitle: "Chỉnh sửa tin tức",
      news: news,
      category: newCategory,
    });
  } catch (error) {
    req.flash("error", "Không tồn tại tin tức");
    res.redirect(`${systemConfig.prefixAdmin}/news`);
  }
};

// [PATCH] /admin/news/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  req.body.position = parseInt(req.body.position);

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }
    req.body.updateBy = updatedBy;

    await News.updateOne({ _id: id }, {
      ...req.body, // lấy những phần tử cũ trong req.body
      $push: {updatedBy: updatedBy} // cú pháp của mongoose
    });
    req.flash("success", "Cập nhật thành công!");
  } catch (error) {
    req.flash("error", "Cập nhật thất bại!");
  }

  res.redirect(req.get("Referer") || "/");
};

// [GET] /admin/news/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const news = await News.findOne(find);

    res.render("admin/pages/news/detail", {
      pageTitle: news.title,
      news: news,
    });
  } catch (error) {
    req.flash("error", "Không tồn tại tin tức");
    res.redirect(`${systemConfig.prefixAdmin}/news`);
  }
};