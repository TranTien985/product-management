const mongoose = require("mongoose");

const GuestSchema = new mongoose.Schema({
  // user_id: String,
  cart_id: String,
  userInfo: {
    fullName: String,
    phone: String,
    address: String,
  },
  products: [
    {
      product_id: String,
      price: Number,
      discountPercentage: Number,
      quantity: Number,
    }
  ],
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt : Date,
},
// thư viện mongoose giúp cập nhật ngày tháng khi thêm mới hoặc update sản phẩm
// đọc thêm ở phần timestamps
  {
  timestamps: true
});

const Guest = mongoose.model("Guest", GuestSchema, "guests"); // products này là 1 collection trong mongoose

module.exports = Guest;
