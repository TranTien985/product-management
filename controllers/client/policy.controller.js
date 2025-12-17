const settingGeneral = require("../../models/settings-general.modal")

// [GET] /policy/shippingPolicy
module.exports.shippingPolicy = async (req, res) => {
  const policy = await settingGeneral.findOne({})
  res.render("client/pages/policy/shippingPolicy", {
    pageTitle: 'chính sách vận chuyển',
    policy: policy
  });
}

// [GET] /policy/returnPolicy
module.exports.returnPolicy = async (req, res) => {
  const policy = await settingGeneral.findOne({})
  res.render("client/pages/policy/returnPolicy", {
    pageTitle: 'chính sách đổi trả',
    policy: policy
  });
}

// [GET] /policy/warrantyPolicy
module.exports.warrantyPolicy = async (req, res) => {
  const policy = await settingGeneral.findOne({})
  res.render("client/pages/policy/warrantyPolicy", {
    pageTitle: 'chính sách bảo hành',
    policy: policy
  });
}
