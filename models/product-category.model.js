const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
  title: String, 
  parent_id: {
    type: String,
    default: false
  }, 
  description: String, 
  availabilityStatus: String, 
  thumbnail: String, 
  position: Number,
  slug: { 
    type: String, 
    slug: "title",
    unique: true // set slug luôn luôn là duy nhất
  },
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

const ProductCategory = mongoose.model("ProductCategory", productCategorySchema, "products-category"); // products này là 1 collection trong mongoose

module.exports = ProductCategory;
