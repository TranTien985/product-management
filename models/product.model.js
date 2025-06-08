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
  deleted: Boolean,
  deletedAt : Date
});

const Product = mongoose.model("Product", productSchema, "products"); // products này là 1 collection trong mongoose

module.exports = Product;
