const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const productsHelper = require("../../helpers/products");
const productCategoryHelper = require("../../helpers/product-category")
const paginationHelper = require("../../helpers/pagination"); // phân trang
const filterProductsHelper = require("../../helpers/products");

// [GET] /products
module.exports.index = async (req, res) => {
  // hàm lọc
  let find = {
    deleted: false,
  };

  // sidebar lọc
  await filterProductsHelper.filterProduct(req.query, find);
  // end sidebar lọc

  const countProducts = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    { currentPage: 1, limitItems: 18 },
    req.query,
    countProducts
  );

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

  // hàm này dùng để tính giá tiền khi có giảm giá
  const newProducts = productsHelper.priceNewProducts(products)
  
  res.render("client/pages/products/index", {
      pageTitle: 'Danh sách sản phẩm',
      products: newProducts,
      pagination: objectPagination,
      queryParams: req.query,
  });
}

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
    try {
    const find = {
    deleted: false,
    slug: req.params.slugProduct,
    availabilityStatus: "In Stock"
    };

    const product = await Product.findOne(find).lean();
    // hàm lean này để chuyển product thành obj thuần thì bên view mới dùng dc product.category.title

    if(product.product_category_id){
      const category = await ProductCategory.findOne({
        _id:product.product_category_id,
        availabilityStatus: "In Stock",
        deleted: false,
      });

      product.category = category;
    }

    product.priceNew = productsHelper.priceNewProduct(product);
    
    
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    res.redirect(`/products`);
  }
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        availabilityStatus: "In Stock",
        deleted: false,
    });

    const listSubCategory = await productCategoryHelper.getSubCategory(category.id);
    const listSubCategoryId = listSubCategory.map(item => item.id);

    let find = {
        deleted: false,
        product_category_id: { $in: [category.id, ...listSubCategoryId] },
    };

    // sidebar lọc
    if(filterProductsHelper.filterProduct) {
      await filterProductsHelper.filterProduct(req.query, find);
    }
    // end sidebar lọc

    // Dùng Product.countDocuments(find) trực tiếp để đếm
    const countProducts = await Product.countDocuments(find);

    // TÍNH TOÁN PHÂN TRANG
    let objectPagination = paginationHelper(
        { currentPage: 1, limitItems: 18 },
        req.query,
        countProducts
    );
    
    // TRUY VẤN SẢN PHẨM VÀ ÁP DỤNG PHÂN TRANG
    const products = await Product.find(find)
        .sort({ position : "desc" })
        .limit(objectPagination.limitItems) 
        .skip(objectPagination.skip)
        .lean(); // Nên thêm .lean() nếu bạn chỉ dùng để render

    const newProducts = productsHelper.priceNewProducts(products)

    res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: newProducts,
        pagination: objectPagination,
        queryParams: req.query,
    });
}