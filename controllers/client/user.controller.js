const User = require("../../models/user.model")
const md5 = require("md5")

// [POST] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: 'Kết quả tìm kiếm',
  });
}

module.exports.registerPost = async (req, res) => {
  const existEmail = await User.findOne({
    email: req.body.email 
  });

  if(existEmail){
    req.flash("error", "email đã tồn tại");
    res.redirect(req.get("Referer") || "/");
    return;
  }

  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser)
  res.redirect("/"); 

  console.log(user);
  
  res.send("ok")
}