// [GET] /store
module.exports.index = async (req, res) => {
  res.render("client/pages/store/index", {
    pageTitle: 'Hệ thống cửa hàng',
  });
}
