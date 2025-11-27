const Order = require("../../models/orders.model"); //database

const filterOrderStatusHelper = require("../../helpers/filterOrderStatus"); // lọc
const paginationHelper = require("../../helpers/pagination"); // phân trang

// [GET] /admin/order
module.exports.index = async (req, res) => {
  const filterOrderStatus = filterOrderStatusHelper(req.query);

  let find = {
    deleted: false,
  }; // biến này tượng trưng cho bộ lọc

  if (req.query.orderStatus) {
    find.orderStatus = req.query.orderStatus;
  }

  //Pagination
  const countOrders = await Order.countDocuments(find);
  // dùng để đếm tổng số lượng sản phẩm có trong db

  // đây dùng để truyền đối số sang cho hàm paginationHelper
  // sau khi truyền hàm bên kia sẽ thực hiện logic và trả lại kết quả cho bên này
  // cuối cùng là update object
  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 6,
    },
    req.query,
    countOrders
  );
  // End pagination

  // Sort
  let sort = {};

  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // End Sort

  const orders = await Order.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);
  // limit(objectPagination.limitItems) giới hạn một trang có bao nhiêu sản phẩm
  // skip(objectPagination.skip) khi bấm vào trang kế tiếp thì nó sẽ skip qua bao nhiêu sản phẩm

  res.render("admin/pages/orders/index", {
    pageTitle: "Trang quản lý đơn hàng",
    filterOrderStatus: filterOrderStatus,
    orders: orders,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/product/change-multi
// [PATCH] /admin/orders/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const status = req.body.status; // Lấy trạng thái từ form (name="status")
    const ids = req.body.ids.split(", "); // Chuyển chuỗi id thành mảng

    // Cập nhật tất cả đơn hàng có id nằm trong danh sách ids
    await Order.updateMany(
      { _id: { $in: ids } }, 
      { 
        orderStatus: status 
      }
    );

    req.flash(
      "success",
      `Cập nhật trạng thái thành công ${ids.length} đơn hàng!`
    );

    res.redirect(req.get("Referer") || "/");
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật thất bại!");
    res.redirect(req.get("Referer") || "/");
  }
};