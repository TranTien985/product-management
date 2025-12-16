// helpers/updateStock.js
const Product = require("../models/product.model");
const Order = require("../models/orders.model");

module.exports = async (status, orderIds) => {
  // 1. Xác định điều kiện lọc đơn hàng trước
  let condition = {};
  if (status === "Confirmed") {
    condition = { 
      _id: { $in: orderIds }, 
      orderStatus: "Pending" 
    };
  } else if (status === "Cancelled") {
    condition = { 
      _id: { $in: orderIds }, 
      orderStatus: { $ne: "Pending" } 
    };
  } else {
    return;
  }

  const orders = await Order.find(condition);

  // 3. Duyệt qua từng đơn
  for (const order of orders) {
    // Duyệt qua từng sản phẩm trong đơn
    for (const item of order.products) {
      const product = await Product.findOne({ _id: item.product_id });
      if (product) {
        if (status === "Confirmed") {
          product.quantity_sold = product.quantity_sold + item.quantity;
        } 
        else if (status === "Cancelled") {
          product.quantity_sold = product.quantity_sold - item.quantity;
        }
        await product.save(); 
      }
    }
  }
};