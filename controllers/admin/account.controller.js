const Account = require("../../models/account.model")
const Role = require("../../models/roles.model")
const systemConfig = require("../../config/system");

const md5 = require('md5');

// [GET] /adim/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  }

  const records = await Account.find(find).select("-password -token");
  // trả về tất cả dữ liệu trừ password cả token

  for (const item of records){
    const role = await Role.findOne({
      _id: item.role_id,
      deleted: false,
    })
    item.role = role
  }
  
  
  res.render("admin/pages/accounts/index", {
    pageTitle: 'Trang danh sách tài khoản',
    records: records
});
}

// [PATCH] /adim/accounts/change-status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Account.updateOne({ _id: id }, { availabilityStatus: status });
  // hàm updateOne này dùng để update một sản phầm với các thông số truyền vào
  // tìm hiểu thêm thông tin ở mongoose -> queries

  req.flash("success", "Cập nhật trạng thái thành công");

  res.redirect(req.get("Referer") || "/");
}

// [DELETE] /adim/accounts/delete/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({_id: id}) dùng để xóa vĩnh viễn

  await Account.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date(), // hàm để lấy ra thời gian hiên tại
    }
  );
  req.flash("success", `Xóa thành công sản phẩm!`);

  res.redirect(req.get("Referer") || "/");
};

// [GET] /adim/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false
  });

  res.render("admin/pages/accounts/create", {
    pageTitle: 'Trang tạo tài khoản',
    roles: roles
});
}

// [POST] /adim/accounts/create
module.exports.createPost = async (req, res) => {
  // check xem email nhập vào đã tồn tại trong db chưa
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false
  })
  if(emailExist){
    req.flash("error", `Email ${req.body.email} đã tồn tại`)
    res.redirect(req.get("Referer") || "/");
  }else{
    req.body.password = md5(req.body.password);

    const record = new Account(req.body);
    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}

// [GET] /adim/accounts/edit/:id
module.exports.edit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted:false
  };
  try {
    const data = await Account.findOne(find);
    

    const roles = await Role.find({
      deleted:false
    })

    res.render("admin/pages/accounts/edit", {
    pageTitle: 'Trang chỉnh sửa tài khoản',
    data: data,
    roles: roles
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/accounts`);
  }
}

// [PATCH] /adim/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id

  const emailExist = await Account.findOne({
    _id: { $ne: id }, // tìm những bản ghi khác id này
    email: req.body.email,
    deleted: false
  })

  if(emailExist){
    req.flash("error", `Email ${req.body.email} đã tồn tại`)
  }else{
    // nếu có mật khẩu thay đổi thì ta lấy mk mới và mã hóa nó
    //  còn ko thì xóa mk nhập vào
    if(req.body.password){
      req.body.password = md5(req.body.password);
    }else{
      delete req.body.password;
    }

    await Account.updateOne({_id:id}, req.body)
    req.flash("success", "Cập nhật tài khoản thành công")
  }

  res.redirect(req.get("Referer") || "/");
}