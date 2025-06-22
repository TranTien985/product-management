const Product = require("../../models/product.model")

// [GET] /products
module.exports.index = async (req, res) => {
    // hàm lọc
    const products = await Product.find({
        availabilityStatus: 'In Stock'
    }).sort({position: "desc"});

    // hàm này dùng để tính giá tiền khi có giảm giá
    const newProducts = products.map(item => {
        item.priceNew = (item.price*(100-item.discountPercentage)/100).toFixed(1);
        // hàm toFixed() dùng để làm tròn
        return item
    });


    // console.log(newProducts);
    
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