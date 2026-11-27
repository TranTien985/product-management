const Cart = require("../../models/cart.model");
const mongoose = require("mongoose");

module.exports.cartId = async (req, res, next) => {
  const expiresCookies = 30 * 24 * 60 * 60 * 1000;
  let cart = null;

  if (req.cookies.cartId && mongoose.Types.ObjectId.isValid(req.cookies.cartId)) {
    cart = await Cart.findOne({
      _id: req.cookies.cartId
    });
  }

  if (!cart) {
    cart = new Cart();
    await cart.save();

    res.cookie("cartId", cart.id, {
      expires: new Date(Date.now() + expiresCookies)
    });
  }

  cart.totalQuantity = (cart.products || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
  res.locals.miniCart = cart;

  next();
};