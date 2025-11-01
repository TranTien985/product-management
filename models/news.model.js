const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: String, 
  content: String, //*
  category: String, 
  status: String, //* trạng thái 
  thumbnail: String, //*
  position: Number,
  slug: { 
    type: String, 
    slug: "title",
    unique: true // set slug luôn luôn là duy nhất
  },
  createdBy: {
    account_id: String,
    createdAt : {
      type: Date,
      default: Date.now
    }
  },
  // khi ta thêm mới sản phẩm thì ko có trường này nên ta sẽ phải set như này 
  // để khi sản phẩm mới thêm vào thì sẽ tự động có trường deleted = false
  deleted: {
    type: Boolean,
    default: false
  },
  deletedBy: {
    account_id: String,
    deletedAt : Date
  },
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
  }
);

const News = mongoose.model("News", newsSchema, "news"); // products này là 1 collection trong mongoose

module.exports = News;
