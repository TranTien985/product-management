const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user_id: String,
  product: [
    {
      product_id: String,
      quantity: Number,
    }
  ]
},
// thư viện mongoose giúp cập nhật ngày tháng khi thêm mới hoặc update sản phẩm
// đọc thêm ở phần timestamps
  {
  timestamps: true
});

const Cart = mongoose.model("Cart", cartSchema, "carts"); // products này là 1 collection trong mongoose

module.exports = Cart;
