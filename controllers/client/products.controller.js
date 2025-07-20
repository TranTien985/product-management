const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// [GET] /products
module.exports.index = async (req, res) => {
    // hàm lọc
    const products = await Product.find({
        availabilityStatus: 'In Stock'
    }).sort({position: "desc"});

    // hàm này dùng để tính giá tiền khi có giảm giá
    const newProducts = productsHelper.priceNewProducts(products)
    
    res.render("client/pages/products/index", {
        pageTitle: 'Trang danh sách sản phẩm',
        products: newProducts
    });
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    try {
    const find = {
    deleted: false,
    slug: req.params.slug,
    availabilityStatus: "In Stock"
    };

    const product = await Product.findOne(find);

    
    
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    res.redirect(`/products`);
  }
}