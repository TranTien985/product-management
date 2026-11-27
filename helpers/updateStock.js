// helpers/updateStock.js
const Product = require("../models/product.model");
const Order = require("../models/orders.model");

module.exports = async (newStatus, orderIds) => {
  // Lấy thông tin các đơn hàng trước khi đổi trạng thái để biết oldStatus
  const orders = await Order.find({ _id: { $in: orderIds } });

  for (const order of orders) {
    const oldStatus = order.orderStatus;
    if (oldStatus === newStatus) continue;

    // 1. Đơn bị HỦY (từ trạng thái đang xử lý/giao sang Cancelled) -> Hoàn trả tồn kho
    if (newStatus === "Cancelled" && oldStatus !== "Cancelled") {
      for (const item of order.products) {
        const product = await Product.findOne({ _id: item.product_id });
        if (product) {
          product.stock = (product.stock || 0) + item.quantity;
          product.quantity_sold = Math.max(0, (product.quantity_sold || 0) - item.quantity);
          if (product.stock > 0 && product.availabilityStatus === "Out of Stock") {
            product.availabilityStatus = "In Stock";
          }
          await product.save();
        }
      }
    }

    // 2. Đơn được khôi phục từ Cancelled sang trạng thái khác -> Trừ lại kho
    if (oldStatus === "Cancelled" && newStatus !== "Cancelled") {
      for (const item of order.products) {
        const product = await Product.findOne({ _id: item.product_id });
        if (product) {
          product.stock = Math.max(0, (product.stock || 0) - item.quantity);
          product.quantity_sold = (product.quantity_sold || 0) + item.quantity;
          if (product.stock === 0) {
            product.availabilityStatus = "Out of Stock";
          }
          await product.save();
        }
      }
    }
  }
};