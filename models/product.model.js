const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String, //*
  description: String, //*
  category: String,
  price: Number, //*
  discountPercentage: Number, //*
  rating: Number,
  stock: Number, //*
  tags: Array,
  brand: String,
  sku: String,
  weight: Number,
  dimensions: Object,
  warrantyInformation: String,
  shippingInformation: String,
  availabilityStatus: String, //* trạng thái 
  reviews: Array,
  returnPolicy: String,
  minimumOrderQuantity: Number,
  meta: Object,
  images: Array,
  thumbnail: String, //*
  position: Number,
  // khi ta thêm mới sản phẩm thì ko có trường này nên ta sẽ phải set như này 
  // để khi sản phẩm mới thêm vào thì sẽ tự động có trường deleted = false
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt : Date
},
// thư viện mongoose giúp cập nhật ngày tháng khi thêm mới hoặc update sản phẩm
// đọc thêm ở phần timestamps
  {
  timestamps: true
});

const Product = mongoose.model("Product", productSchema, "products"); // products này là 1 collection trong mongoose

module.exports = Product;
