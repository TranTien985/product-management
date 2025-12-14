const User = require("../../models/user.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

// [GET] /admin/users
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper.filterUser(req.query);
  let find = {
    deleted: false,
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  // Tìm kiếm (Search)
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.fullName = objectSearch.regex; // Tìm theo tên
  }

  // Phân trang (Pagination)
  const countUsers = await User.countDocuments(find);
  let objectPagination = paginationHelper(
    { currentPage: 1, limitItems: 10 },
    req.query,
    countUsers
  );

  // Query Database
  const users = await User.find(find)
    .sort({ createdAt: -1 })
    .limit(parseInt(objectPagination.limitItems)) 
    .skip(parseInt(objectPagination.skip))        
    .select("-password -tokenUser"); 

  res.render("admin/pages/user/index", {
    pageTitle: "Quản lý tài khoản người dùng",
    users: users,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/user/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await User.updateOne({ _id: id }, { status: status });

  req.flash("success", "Cập nhật trạng thái thành công!");
  res.redirect(req.get("Referer") || "/");
};

// [DELETE] /admin/user/delete/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Xóa mềm
    await User.updateOne({ _id: id }, {
      deleted: true,
      deletedAt: new Date()
    });
    
    req.flash("success", "Đã xóa tài khoản thành công!");
    res.redirect(req.get("Referer") || "/");
  } catch (error) {
    console.log(error);
    req.flash("error", "Xóa thất bại!");
    res.redirect(req.get("Referer") || "/");
  }
};


// [PATCH] /adim/reviews/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(",");
  // dùng split(", ") để convert nó thành một mảng

  // sử dụng updateMany của mongoose
  switch (type) {
    case "active":
      await User.updateMany({ _id: { $in: ids } },{
        status: "active",
        }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} đánh giá!`
      );
      break;
    case "inactive":
      await User.updateMany({ _id: { $in: ids } },{
        status: "inactive", 
        }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} đánh giá!`
      );
      break;
    case "delete-all":
      await User.updateMany(
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