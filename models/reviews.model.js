const mongoose = require("mongoose");

const reviewsSchema = new mongoose.Schema({
  product_id: String, // ID của sản phẩm đang xem
  rating: Number,       // Số sao (1-5)
  content: String,    // Nội dung đánh giá
  images: {
    type: Array,    // Mảng chứa link ảnh (nếu có)
    default: []
  },
  status: {
    type: String,
    default: "inactive" // Mặc định là chưa duyệt
  },
  createdBy: {
    user_id: String,   
    user_name: String,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewsSchema, "reviews"); // products này là 1 collection trong mongoose

module.exports = Review;
