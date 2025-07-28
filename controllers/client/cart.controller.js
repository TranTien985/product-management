const Cart = require("../../models/cart.model")

// [GET] /cart/add/:productId
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