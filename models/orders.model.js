const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const orderSchema = new mongoose.Schema({
  orderCode: String,
  user_id: {
    type: String,
    default: "",
  },
  products: [
    {
      product_id: String,
      quantity: Number,
      price: Number, 
      discountPercentage: Number, 
    }
  ],
  shippingAddress: { // Thiết kế này của bạn RẤT TỐT
      fullName: String,
      phone: String,
      address: String,
      note: String
    },
    totalPrice: {
      type: Number,
      required: true
    },
    shippingFee: {
      type: Number,
      required: true,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    orderStatus: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
      required: true
    },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt : Date,
  updatedBy: [
    {
      account_id: String,
      updatedAt: Date
    }
  ],
},
// thư viện mongoose giúp cập nhật ngày tháng khi thêm mới hoặc update sản phẩm
// đọc thêm ở phần timestamps
  {
  timestamps: true
});

const Order = mongoose.model("Order", orderSchema, "orders"); // products này là 1 collection trong mongoose

module.exports = Order;
