const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/orders.model");
const mongoose = require("mongoose");

const productsHelper = require("../../helpers/products");
const generateHelper = require("../../helpers/generate");

// [GET] /checkout
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId
  });

  // 1. Ràng buộc giỏ hàng không được rỗng
  if (!cart || !cart.products || cart.products.length === 0) {
    req.flash("error", "Giỏ hàng của bạn đang trống! Vui lòng chọn sản phẩm trước khi thanh toán.");
    return res.redirect("/cart");
  }

  const validProducts = [];
  for (const item of cart.products) {
    const productId = item.product_id;
    const productInfo = await Product.findOne({
      _id: productId,
      deleted: false
    }).select("title thumbnail slug price discountPercentage stock availabilityStatus");

    if (productInfo) {
      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
      item.productInfo = productInfo;
      item.totalPrice = parseInt((productInfo.priceNew * item.quantity).toFixed(0));
      validProducts.push(item);
    }
  }

  if (validProducts.length === 0) {
    req.flash("error", "Các sản phẩm trong giỏ hàng hiện không còn khả dụng!");
    return res.redirect("/cart");
  }

  cart.products = validProducts;
  cart.totalPrice = validProducts.reduce((sum, item) => sum + item.totalPrice, 0);

  res.render("client/pages/checkout/index", {
    pageTitle: "Đặt hàng",
    cartDetail: cart,
  });
};

// [POST] /checkout/order
module.exports.order = async (req, res) => {
  const cartId = req.cookies.cartId;
  const userInfo = req.body;
  const user = res.locals.user;

  const cart = await Cart.findOne({
    _id: cartId
  });

  // 1. Ràng buộc giỏ hàng không được rỗng khi đặt hàng
  if (!cart || !cart.products || cart.products.length === 0) {
    req.flash("error", "Giỏ hàng đang trống, không thể tạo đơn hàng!");
    return res.redirect("/cart");
  }

  const products = [];
  let totalOrderPrice = 0;

  // 2. Kiểm tra tồn kho và tính toàn vẹn dữ liệu từng sản phẩm trước khi đặt
  for (const item of cart.products) {
    const productInfo = await Product.findOne({
      _id: item.product_id,
      deleted: false,
    });

    if (!productInfo) {
      req.flash("error", "Có sản phẩm trong giỏ không còn tồn tại. Vui lòng kiểm tra lại giỏ hàng!");
      return res.redirect("/cart");
    }

    if (productInfo.availabilityStatus === "Out of Stock" || productInfo.stock < item.quantity) {
      req.flash("error", `Sản phẩm "${productInfo.title}" không đủ số lượng trong kho (chỉ còn ${productInfo.stock} sản phẩm).`);
      return res.redirect("/cart");
    }

    const priceNew = productsHelper.priceNewProduct(productInfo);

    const objectProduct = {
      product_id: item.product_id,
      price: priceNew,
      discountPercentage: productInfo.discountPercentage || 0,
      quantity: item.quantity,
    };

    totalOrderPrice += (priceNew * item.quantity);
    products.push(objectProduct);
  }

  if (products.length === 0) {
    req.flash("error", "Không có sản phẩm hợp lệ để thanh toán!");
    return res.redirect("/cart");
  }

  // 3. Trừ số lượng tồn kho (stock) và cộng dồn số lượng đã bán (quantity_sold)
  for (const item of products) {
    const productInfo = await Product.findOne({ _id: item.product_id });
    const remainingStock = Math.max(0, productInfo.stock - item.quantity);
    let newStatus = productInfo.availabilityStatus;
    if (remainingStock === 0) {
      newStatus = "Out of Stock";
    } else if (remainingStock <= 5) {
      newStatus = "Low Stock";
    }

    await Product.updateOne(
      { _id: item.product_id },
      {
        $inc: {
          stock: -item.quantity,
          quantity_sold: item.quantity
        },
        $set: {
          availabilityStatus: newStatus
        }
      }
    );
  }

  const fullAddress = `${userInfo.address}, ${userInfo.wardName}, ${userInfo.provinceName}`;
  let shippingFee = 30000;
  if (totalOrderPrice >= 500000) {
    shippingFee = 0;
  }

  const totalAmount = totalOrderPrice + shippingFee;
  const countOrders = await Order.countDocuments();

  let userId = "";
  if (user) {
    userId = user.id;
  }

  const orderData = {
    user_id: userId,
    orderCode: generateHelper.generateRandomString(8).toUpperCase(),
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

  // Reset giỏ hàng sau khi đặt thành công
  await Cart.updateOne(
    { _id: cartId },
    { products: [] }
  );

  res.redirect(`/checkout/success/${order.id}`);
};

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
  const orderId = req.params.orderId;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    req.flash("error", "Mã đơn hàng không hợp lệ!");
    return res.redirect("/");
  }

  const order = await Order.findOne({
    _id: orderId
  });

  if (!order) {
    req.flash("error", "Không tìm thấy thông tin đơn hàng!");
    return res.redirect("/");
  }

  for (const product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id
    }).select("title thumbnail slug");

    product.productInfo = productInfo;
    // Giá đã lưu trong order là giá đã chốt tại thời điểm mua, không chiết khấu lại
    product.priceNew = product.price;
    product.totalPrice = parseInt((product.priceNew * product.quantity).toFixed(0));
  }

  order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);

  res.render("client/pages/checkout/success", {
    pageTitle: "Đặt hàng thành công",
    order: order
  });
};