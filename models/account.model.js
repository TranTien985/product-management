const mongoose = require("mongoose");
const generate = require("../helpers/generate")

const accountSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    default: () => generate.generateRandomString(30)
  }, // khi lưu dữ liệu tk người dùng thì be sẽ lưu cái token này chứ ko lưu email hay pass
  phone: String,
  avatar: String,
  role_id: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt : Date
},

{
  timestamps: true
});

const Account = mongoose.model("Account", accountSchema, "accounts"); // products này là 1 collection trong mongoose

module.exports = Account;
