const Order = require("../../models/orders.model"); //database
const Product = require("../../models/product.model");

const systemConfig = require("../../config/system");
const filterOrderStatusHelper = require("../../helpers/filterOrderStatus"); // lọc
const paginationHelper = require("../../helpers/pagination"); // phân trang
const SearchHelper = require("../../helpers/search"); // tìm kiếm
const updateStockHelper = require("../../helpers/updateStock");
// [GET] /admin/order
module.exports.index = async (req, res) => {
  const filterOrderStatus = filterOrderStatusHelper(req.query);
  const statistic = {
    pending: await Order.countDocuments({ deleted: false, orderStatus: "Pending" }),
    confirmed: await Order.countDocuments({ deleted: false, orderStatus: "Confirmed" }),
    shipping: await Order.countDocuments({ deleted: false, orderStatus: "Shipping" }),
    delivered: await Order.countDocuments({ deleted: false, orderStatus: "Delivered" }),
    cancelled: await Order.countDocuments({ deleted: false, orderStatus: "Cancelled" })
  };

  let find = {
    deleted: false,
  }; // biến này tượng trưng cho bộ lọc

  if (req.query.orderStatus) {
    find.orderStatus = req.query.orderStatus;
  }

  // Search
  const objectSearch = SearchHelper(req.query);
  if (objectSearch.regex) {
    find.orderCode = objectSearch.regex;
  }

  //Pagination
  const countOrders = await Order.countDocuments(find);
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
    keyword: objectSearch.keyword,
    orders: orders,
    pagination: objectPagination,
    statistic: statistic,
  });
};


// [PATCH] /admin/orders/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const status = req.body.status; // Lấy trạng thái từ form (name="status")
    const ids = req.body.ids.split(", "); // Chuyển chuỗi id thành mảng

    await updateStockHelper(status, ids);

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

// [DELETE] /admin/orders/deleteItem/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  // await Product.deleteOne({_id: id}) dùng để xóa vĩnh viễn

  await Order.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(), 
      }
    }
  );
  req.flash("success", `Xóa thành công sản phẩm!`);

  res.redirect(req.get("Referer") || "/");
};


// [GET] /admin/orders/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };

    const order = await Order.findOne(find);

    if(order.products.length > 0) {
      for(const item of order.products) {
        // Tìm thông tin sản phẩm dựa vào product_id
        const productInfo = await Product.findOne({
          _id: item.product_id,
          deleted: false
        });

        // Gán thông tin tìm được vào item để hiển thị bên View
        if(productInfo) {
          item.title = productInfo.title;
          item.thumbnail = productInfo.thumbnail;
        } else {
          // Trường hợp sản phẩm gốc đã bị xóa hẳn khỏi DB
          item.title = "Sản phẩm đã bị xóa";
          item.thumbnail = ""; 
        }
      }
    }

    res.render("admin/pages/orders/detail", {
      order: order,
    });
  } catch (error) {
    req.flash("error", "Không tồn tại đơn hàng");
    // res.redirect(`${systemConfig.prefixAdmin}/orders`);
  }
};
