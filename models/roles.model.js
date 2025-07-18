const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  title: String,
  description: String,
  permissions:{
    type: Array,
    default: []
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

const Role = mongoose.model("Role", roleSchema, "roles"); // products này là 1 collection trong mongoose

module.exports = Role;
