const Product = require("../../models/product.model")

// [GET] /products
module.exports.index = async (req, res) => {
    // hàm lọc
    const products = await Product.find({
        availabilityStatus: 'In Stock'
    });

    // hàm này dùng để tính giá tiền khi có giảm giá
    const newProducts = products.map(item => {
        item.priceNew = (item.price*(100-item.discountPercentage)/100).toFixed(0);
        // hàm toFixed() dùng để làm tròn
        return item
    });


    // console.log(newProducts);
    
    res.render("client/pages/products/index", {
        pageTitle: 'Trang danh sách sản phẩm',
        products: newProducts
    });
}