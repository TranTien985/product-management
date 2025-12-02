// helpers/updateStock.js
const Product = require("../models/product.model");
const Order = require("../models/orders.model");

module.exports = async (status, orderIds) => {
  //  Trường hợp xác nhận đơn hàng (Confirmed) -> Trừ kho
  if (status === "Confirmed") {
    const orders = await Order.find({
      _id: { $in: orderIds },
      orderStatus: "Pending" // Chỉ trừ kho những đơn đang chờ (tránh trừ trùng)
    });

    for (const order of orders) {
      for (const item of order.products) {
        await Product.updateOne(
          { _id: item.product_id },
          { $inc: { stock: -item.quantity } }
        );
      }
    }
  }

  // Trường hợp Hủy đơn hàng (Cancelled) -> Trả lại kho
  if (status === "Cancelled") {
    const orders = await Order.find({
      _id: { $in: orderIds },
      orderStatus: { $ne: "Pending" } // Chỉ trả kho những đơn ĐÃ xác nhận/giao
    });

    for (const order of orders) {
      for (const item of order.products) {
        await Product.updateOne(
          { _id: item.product_id },
          { $inc: { stock: item.quantity } } // Cộng lại
        );
      }
    }
  }
}