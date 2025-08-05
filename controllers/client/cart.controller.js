const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const productsHelper = require("../../helpers/products")

// [GET] /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId
  });
  
  if(cart.product.length > 0){
    for (const item of cart.product) {
      const productId = item.product_id
      const productInfo = await Product.findOne({
        _id: productId,
        deleted: false 
      }).select("title thumbnail slug price discountPercentage");

      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);

      item.productInfo = productInfo; // thêm thuộc tính productInfo để trỏ vào lấy dữ liệu của product

      item.totalPrice = parseInt((productInfo.priceNew * item.quantity).toFixed(0));
    }
  }

  cart.totalPrice = cart.product.reduce((sum, item) => sum + item.totalPrice, 0);
  
  
  res.render("client/pages/cart/index", {
    pageTitle: 'Trang tổng quan',
    cartDetail: cart
});
}

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId

  const cart = await Cart.findOne({
    _id: cartId
  });
  
  const existProductInCart = cart.product.find(item => item.product_id == productId); // hàm find này của js dùng để tìm một bản ghi

  if(existProductInCart){
    const quantityNew = quantity + existProductInCart.quantity;

    // cập nhật quantity khi mà thêm sản phẩm trùng
    await Cart.updateOne({
      _id: cartId,
      'product.product_id' : productId
    },{
      $set: {
        'product.$.quantity': quantityNew
      }
    });
    
  }else{
    const objectCart = {
      product_id: productId,
      quantity: quantity
    }
    await Cart.updateOne(
      { _id: cartId},
      { $push: { product: objectCart }} // sử dụng $push để thêm một obj vào một mảng
    )
  }
  req.flash("success", "Đã thêm sản phẩm vào giỏ hàng")

  res.redirect(req.get("Referer") || "/");
}

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId
  const productId = req.params.productId

  await Cart.updateOne({
    _id: cartId
  },{
    $pull: {product: {product_id : productId}} // dùng pull để xóa dữ liệu một bản ghi trong một mảng
  });

  req.flash("success", "Đã xóa sản phẩm ra khỏi giỏ hàng!");
  
  res.redirect(req.get("Referer") || "/");
}

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
  const cartId = req.cookies.cartId
  const productId = req.params.productId //giá trị có dấu : trên url thì dc lưu vào obj req.params
  const quantity = req.params.quantity

  await Cart.updateOne({
    _id: cartId,
    'product.product_id' : productId,
  },{
    $set: {
      'product.$.quantity': quantity,
    }
  });
  
  res.redirect(req.get("Referer") || "/");
}