const ProductCategory = require("../../models/product-category.model"); //database
const Product = require("../../models/product.model"); //database
const productsHelper = require("../../helpers/products")

// [GET] /
module.exports.index = async (req, res) => {
  // Lấy ra sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    availabilityStatus: "In Stock"
  }).limit(3);
  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured)
  // end lấy ra sản phẩm nổi bật 

  // Lấy ra sản phẩm mới nhất 
  const productsNew = await Product.find({
    deleted: false,
    availabilityStatus: "In Stock"
  }).sort({ position : "desc"}).limit(6);

  const newProductsNew = productsHelper.priceNewProducts(productsNew)
  // end Lấy ra sản phẩm mới nhất 

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew
  });
};