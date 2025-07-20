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

  const newProducts = productsHelper.priceNewProducts(productsFeatured)

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    productsFeatured: newProducts
  });
};