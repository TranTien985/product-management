const Review = require("../../models/reviews.model");
const Product = require("../../models/product.model");
const User = require("../../models/user.model");

const filterStatusHelper = require("../../helpers/filterReviewRating"); // lọc
const SearchHelper = require("../../helpers/search"); // tìm kiếm
const paginationHelper = require("../../helpers/pagination"); // phân trang

// [GET] /admin/reviews
module.exports.index = async (req, res) => {
  // Bộ lọc trạng thái (Active/Inactive)
  const filterStatus = filterStatusHelper.filterStatus(req.query);
  let find = {
    deleted: false,
  };

  if (req.query.status) {
    if (req.query.status === "images") {
      // Tìm các bản ghi có trường 'images' tồn tại VÀ mảng không rỗng
      find.images = { $exists: true, $ne: [] }; 
    }else{
      find.status = req.query.status;
    }
  }

  // 2. Xử lý TÌM KIẾM (Search) - Đặt đoạn này lên TRƯỚC khi query Review
  const objectSearch = SearchHelper(req.query);

  if (objectSearch.regex) {
    // Tìm các Sản phẩm có tên khớp từ khóa
    const products = await Product.find({
      title: objectSearch.regex,
      deleted: false
    }).select("id");
    const productIds = products.map(item => item.id);

    // Tìm các User có tên khớp từ khóa
    const users = await User.find({
      fullName: objectSearch.regex,
      deleted: false
    }).select("id");
    const userIds = users.map(item => item.id);

    // Gộp điều kiện vào biến find bằng toán tử $or
    find.$or = [
      { product_id: { $in: productIds } },      
      { "createdBy.user_id": { $in: userIds } }, 
      { content: objectSearch.regex }           
    ];
  }

  // --- PAGINATION  ---
  const countReviews = await Review.countDocuments(find);
  let objectPagination = paginationHelper(
    { currentPage: 1, limitItems: 10 },
    req.query,
    countReviews
  );

  const reviews = await Review.find(find)
    .sort({ createdAt: -1 })
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);      

  for (const review of reviews) {
    const infoUser = await User.findOne({
      _id: review.createdBy.user_id
    });

    const infoProduct = await Product.findOne({
      _id: review.product_id
    });

    review.infoUser = infoUser;
    review.infoProduct = infoProduct;
  }

  res.render("admin/pages/reviews/index", {
    pageTitle: "Quản lý đánh giá",
    reviews: reviews,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/reviews/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await Review.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công!");
  res.redirect(req.get("Referer") || "/");
};

// [DELETE] /adim/reviews/deleteItem/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;

  await Review.deleteOne({_id: id}) //dùng để xóa vĩnh viễn

  req.flash("success", `Xóa thành công sản phẩm!`);

  res.redirect(req.get("Referer") || "/");
};

// [PATCH] /adim/reviews/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");
  // dùng split(", ") để convert nó thành một mảng

  // sử dụng updateMany của mongoose
  switch (type) {
    case "active":
      await Review.updateMany({ _id: { $in: ids } },{
        status: "active",
        }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} đánh giá!`
      );
      break;
    case "inactive":
      await Review.updateMany({ _id: { $in: ids } },{
        status: "inactive", 
        }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} đánh giá!`
      );
      break;
    case "delete-all":
      await Review.updateMany(
        { _id: ids },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(), 
          }
        }
      );
      req.flash("success", `Đã xóa thành công ${ids.length} đánh giá!`);
      break;

    default:
      break;
  }
  res.redirect(req.get("Referer") || "/");
};
