const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const Order= require("../../models/orders.model")

const productsHelper = require("../../helpers/products")

const generateHelper = require("../../helpers/generate")


// [GET] /checkout
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  
  const cart = await Cart.findOne({
    _id: cartId
  });
  
  if(cart.products.length > 0){
    for (const item of cart.products) {
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

  cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

  res.render("client/pages/checkout/index", {
    pageTitle: "Đặt hàng",
    cartDetail: cart,
  });
};

// [GET] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body
  const user = res.locals.user;

  const cart = await Cart.findOne({
    _id: cartId
  });

  const products = []
  let totalOrderPrice = 0;

  for (const item of cart.products) {
    const objectProduct = {
      product_id: item.product_id,
      price: 0,
      discountPercentage: 0,
      quantity: item.quantity,
    };

    const productInfo = await Product.findOne({
      _id: item.product_id 
    }).select("price discountPercentage ");

    if(productInfo) {
      // tính giá mới (đã giảm)
      const priceNew = productsHelper.priceNewProduct(productInfo);

      // Lưu giá đã giảm, không phải giá gốc
      const objectProduct = {
        product_id: item.product_id,
        price: priceNew,
        discountPercentage: productInfo.discountPercentage || 0,
        quantity: item.quantity,
      };

      // tính tổng tiền đơn hàng
      totalOrderPrice += (priceNew * item.quantity);

      products.push(objectProduct);
    }
  }

  const fullAddress = `${userInfo.address}, ${userInfo.wardName}, ${userInfo.districtName}, ${userInfo.provinceName}`;
  let shippingFee = 30000; 
  if (totalOrderPrice >= 500000) {
    shippingFee = 0; 
  }
  
  const totalAmount = totalOrderPrice + shippingFee;
  const countOrders = await Order.countDocuments()


  let userId = "";
  if (user) {
    userId = user.id;
  }

  const orderData = {
    user_id: userId,
    orderCode: generateHelper.generateRandomString(8).toUpperCase(), // (Tạo mã đơn giản, nên dùng thư viện)
    shippingAddress: {
      fullName: userInfo.fullName,
      phone: userInfo.phone,
      address: fullAddress,
      note: userInfo.note,
    },
    products: products, 
    totalPrice: totalOrderPrice, 
    shippingFee: shippingFee, 
    totalAmount: totalAmount,
    position: countOrders + 1,
  };

  const order = new Order(orderData);
  await order.save();

  // sau khi đã thanh toán thì reset sản phẩm trong giỏ hàng
  await Cart.updateOne({
    _id: cartId,
  },{
    products: []
  });

  res.redirect(`/checkout/success/${order.id}`);
}

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.orderId
  });

  for (const product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id
    }).select("title thumbnail");

    product.productInfo = productInfo;

    product.priceNew = productsHelper.priceNewProduct((product));

    product.totalPrice = parseInt((product.priceNew * product.quantity).toFixed(0));
  }

  order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);
  

  res.render("client/pages/checkout/success", {
    pageTitle: "Đặt hàng thành công",
    order: order
  });
}