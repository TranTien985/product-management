const mongoose = require("mongoose");
const generate = require("../helpers/generate")

const settingGeneralSchema = new mongoose.Schema({
  websiteName : String,
  logo: String,
  phone: String,
  email: String,
  address: String,
  copyright: String,
},
{
  timestamps: true
});

const settingGeneral = mongoose.model("settingGeneral", settingGeneralSchema, "settings-general"); // products này là 1 collection trong mongoose

module.exports = settingGeneral;
