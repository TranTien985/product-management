const Cart = require("../../models/cart.model")

module.exports.cartId = async (req, res, next) => {

  if(!req.cookies.cartId){
    // tạo giỏ hàng
    const cart = new Cart();
    await cart.save();

    const expiresCookies =365 * 24 * 60 * 60 * 1000;

    // lưu cartId trong cookie
    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresCookies) // xét thời gian hết hạn cho cookie
    });
  }else{
    const cart = await Cart.findOne({
      _id: req.cookies.cartId
    });

    cart.totalQuantity = cart.product.reduce((sum, item) => sum + item.quantity, 0);

    res.locals.miniCart = cart
    
  }

  next()
}