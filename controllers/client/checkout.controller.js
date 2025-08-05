const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const Order= require("../../models/order.model")
const productsHelper = require("../../helpers/products")

// [GET] /checkout
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

  res.render("client/pages/checkout/index", {
    pageTitle: "Đặt hàng",
    cartDetail: cart,
  });
};

// [GET] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body

  const cart = await Cart.findOne({
    _id: cartId
  });

  const product = []

  for (const item of cart.product) {
    const objectProduct = {
      product_id: item.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: item.quantity,
    };

    const productInfo = await Product.findOne({
      _id: item.product_id 
    }).select("price discountPercentage");

    objectProduct.price = productInfo.price
    objectProduct.discountPercentage = productInfo.discountPercentage

    product.push(objectProduct);
  }

  const orderInfo = {
    cart_id: cartId,
    userInfo: userInfo,
    products: product,
  }

  const order = new Order(orderInfo);
  order.save();

  // sau khi đã thanh toán thì reset sản phẩm trong giỏ hàng
  await Cart.updateOne({
    _id: cartId,
  },{
    product: []
  });

  res.redirect(`/checkout/success/${order.id}`);
}

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
  res.render("client/pages/checkout/success", {
    pageTitle: "Đặt hàng thành công",
  });
}