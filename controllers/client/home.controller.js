const ProductCategory = require("../../models/product-category.model"); //database
const Product = require("../../models/product.model"); //database
const News = require("../../models/news.model"); //database
const NewsCategory = require("../../models/news-category.model"); //database


const productsHelper = require("../../helpers/products")
const productCategoryHelper = require("../../helpers/product-category")

// [GET] /
module.exports.index = async (req, res) => {
  let find = {
      deleted: false,
      availabilityStatus: "In Stock" 
  };

  // Lấy ra sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    availabilityStatus: "In Stock"
  }).limit(10);
  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured)
  // end lấy ra sản phẩm nổi bật 

  // Lấy ra sản phẩm mới nhất 
  const productsNew = await Product.find({
    deleted: false,
    availabilityStatus: "In Stock"
  }).sort({ position : "desc"}).limit(8);
  const newProductsNew = productsHelper.priceNewProducts(productsNew)
  // end Lấy ra sản phẩm mới nhất 

  // Sản phẩm bán chạy 
  const bestSellingProducts = await Product.find(find)
    .sort({ quantity_sold: "desc" })
    .limit(8);
  const newBestSellingProducts = productsHelper.priceNewProducts(bestSellingProducts)
  // end lấy ra sản phẩm bán chạy

  // Lấy Vợt Cầu Lông 
  const racketCategory = await ProductCategory.findOne({
    slug: "vot-cau-long", 
    deleted: false
  });
  let racketProducts = [];
  if (racketCategory) {
    // Lấy danh sách ID con
    const listSubCategory = await productCategoryHelper.getSubCategory(racketCategory.id);
    const listSubCategoryId = listSubCategory.map(item => item.id);

    // Sửa lại query dùng $in
    racketProducts = await Product.find({
      product_category_id: { $in: [racketCategory.id, ...listSubCategoryId] },
      ...find
    }).limit(8);
  }
  const newRacketProducts = productsHelper.priceNewProducts(racketProducts)
  // end Lấy Vợt Cầu Lông 

  // Lấy Phụ Kiện 
  const accessoryCategory = await ProductCategory.findOne({
    slug: "phu-kien-cau-long", 
    deleted: false
  });
  let accessoryProducts = [];
  if (accessoryCategory) {
    // Lấy danh sách ID con
    const listSubCategory = await productCategoryHelper.getSubCategory(accessoryCategory.id);
    const listSubCategoryId = listSubCategory.map(item => item.id);

    // Sửa lại query dùng $in
    accessoryProducts = await Product.find({
      product_category_id: { $in: [accessoryCategory.id, ...listSubCategoryId] },
      ...find
    }).limit(8);
  }
  const newAccessoryProducts= productsHelper.priceNewProducts(accessoryProducts)
  // end Lấy Phụ Kiện 

  // Lấy Giày 
  const shoeCategory = await ProductCategory.findOne({
    slug: "giay-cau-long", 
    deleted: false
  });
  let shoeProducts = [];
  if (shoeCategory) {
    // Lấy danh sách ID con
    const listSubCategory = await productCategoryHelper.getSubCategory(shoeCategory.id);
    const listSubCategoryId = listSubCategory.map(item => item.id);

    // Sửa lại query dùng $in
    shoeProducts = await Product.find({
      product_category_id: { $in: [shoeCategory.id, ...listSubCategoryId] },
      ...find
    }).limit(8);
  }
  const newShoeProducts= productsHelper.priceNewProducts(shoeProducts)
  // end Lấy Giày 

  // Lấy ra tin tức nổi bật
  const newsFeatured = await News.find({
    featured: "1",
    deleted: false,
    availabilityStatus: "In Stock"
  }).limit(6);
  // end lấy ra tin tức nổi bật


  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured, // sản phẩm nổi bật
    productsNew: newProductsNew, // sản phẩm mới 
    newBestSellingProducts: newBestSellingProducts, // sản phẩm bán chạy
    newRacketProducts: newRacketProducts, // vợt cầu lông
    newAccessoryProducts: newAccessoryProducts, // phụ kiện cầu lông 
    newShoeProducts: newShoeProducts, // giày cầu lông
    newsFeatured: newsFeatured, // tin tức nổi bật
  });
};