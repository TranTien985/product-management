const Order = require("../../models/orders.model");
const Product = require("../../models/product.model");

const SearchHelper = require("../../helpers/search");
const ordersHelper = require("../../helpers/order");

// [GET] /tracking-product
module.exports.index = async (req, res) => {
  let orderResult = null; // Kết quả tìm kiếm đơn hàng cụ thể
  let myOrders = [];      // Danh sách đơn hàng của người dùng

  const objectSearch = SearchHelper(req.query);

  // --- LOGIC 1: TÌM KIẾM ĐƠN HÀNG (Nếu có keyword) ---
  if (req.query.keyword) {
    let findOrder = {
      deleted: false,
    };
    if (objectSearch.regex) {
      findOrder.orderCode = objectSearch.regex; 
    }
    
    // Thêm .lean()
    orderResult = await Order.findOne(findOrder).lean();

    if (orderResult) {
      orderResult = await ordersHelper(orderResult);
    }
  }

  // --- LOGIC 2: LẤY DANH SÁCH ĐƠN HÀNG (Nếu đã đăng nhập) ---
  if (res.locals.user) {
    const userId = res.locals.user.id;
    
    // Thêm .lean()
    myOrders = await Order.find({
      user_id: userId,
      deleted: false
    }).sort({ createdAt: "desc" }).lean();

    for (const order of myOrders) {
      await ordersHelper(order);
    }
  }

  // --- TRẢ VỀ VIEW ---
  res.render("client/pages/tracking-product/index", {
    pageTitle: 'Theo dõi đơn hàng',
    objectSearch: objectSearch, 
    order: orderResult,        
    myOrders: myOrders,        
  });
}