const mongoose = require("mongoose");
const generate = require("../helpers/generate")

const userSchema = new mongoose.Schema({
  fullName: String, //*
  email: String,
  password: String,
  tokenUser: {
    type: String,
    default: generate.generateRandomString(20)
  }, // khi lưu dữ liệu tk người dùng thì be sẽ lưu cái token này chứ ko lưu email hay pass
  phone: String,
  avatar: String,
  status: {
    type: String,
    default: "active",
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

const User = mongoose.model("User", userSchema, "users"); // products này là 1 collection trong mongoose

module.exports = User;
