const News = require("../../models/news.model");
const NewsCategory = require("../../models/news-category.model");

const newsCategoryHelper = require("../../helpers/news-category")
const paginationHelper = require("../../helpers/pagination"); // phân trang

// [GET] /news
module.exports.index = async (req, res) => {
    res.render("client/pages/news/index", {
        pageTitle: 'Trang tin tức',
    });
}

// [GET] /news/detail/:slugNews
module.exports.detail = async (req, res) => {
    try {
    const find = {
    deleted: false,
    slug: req.params.slugNews,
    availabilityStatus: "In Stock"
    };

    const news = await News.findOne(find).lean();
    // hàm lean này để chuyển news thành obj thuần thì bên view mới dùng dc news.category.title

    if(news.news_category_id){
      const category = await NewsCategory.findOne({
        _id:news.news_category_id,
        availabilityStatus: "In Stock",
        deleted: false,
      });

      news.category = category;
    }
    
    
    res.render("client/pages/news/detail", {
      pageTitle: news.title,
      news: news
    });
  } catch (error) {
    res.redirect(`/news`);
  }
}

// [GET] /news/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const category = await NewsCategory.findOne({
      slug: req.params.slugCategory,
      availabilityStatus: "In Stock",
      deleted: false,
    });

    // Nếu không tìm thấy category, về trang news
    if (!category) {
      res.redirect("/news");
      return;
    }

    const listSubCategory = await newsCategoryHelper.getSubCategory(category.id);
    const listSubCategoryId = listSubCategory.map(item => item.id);

    // 1. Tạo BỘ LỌC (findQuery) trước
    const findQuery = {
      news_category_id: { $in: [category.id, ...listSubCategoryId] },
      deleted: false
    };

    // 2. Đếm TỔNG SỐ tin tức khớp với bộ lọc
    // Dùng 'countDocuments' để lấy SỐ LƯỢNG
    const countNews = await News.countDocuments(findQuery);

    // 3. Gọi helper phân trang với TỔNG SỐ (countNews bây giờ là 1 con số)
    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitItems: 6,
      },
      req.query,
      countNews 
    );

    // (Find + Sort + Skip + Limit) RỒI MỚI 'await'
    const news = await News.find(findQuery)
      .sort({ position: "desc" })
      .skip(objectPagination.skip)
      .limit(objectPagination.limitItems);
      

    res.render("client/pages/news/index", {
      pageTitle: category.title,
      news: news,
      newsPagination: objectPagination,
    });

  } catch (error) {
    console.error("Lỗi tại news.category:", error);
    res.redirect("/news");
  }
}


// [GET] /news/main
module.exports.main = async (req, res) => {
    // Lấy ra sản phẩm nổi bật
    const newsFeatured = await News.find({
      featured: "1",
      deleted: false,
      availabilityStatus: "In Stock"
    }).limit(5);
    // end lấy ra sản phẩm nổi bật 
  
    // Lấy ra sản phẩm mới nhất 
    const newsNew = await News.find({
      deleted: false,
      availabilityStatus: "In Stock"
    }).sort({ position : "desc"}).limit(5);
    // end Lấy ra sản phẩm mới nhất   

    // lấy sản phẩm danh mục đánh giá sản phẩm
    const evaluateCategory = await NewsCategory.findOne({
      slug: "danh-gia-san-pham",
      deleted: false
    });
    let newsEvaluate = []

    if (evaluateCategory) {
      newsEvaluate = await News.find({
        news_category_id: evaluateCategory._id, 
        deleted: false,
        availabilityStatus: "In Stock"
      }).limit(5); 
    }
    // end lấy sản phẩm danh mục đánh giá sản phẩm

    // lấy sản phẩm danh mục khuyến mãi
    const promotionCategory = await NewsCategory.findOne({
      slug: "khuyen-mai",
      deleted: false
    });
    let newsPromotion = []

    if (promotionCategory) {
      newsPromotion = await News.find({
        news_category_id: promotionCategory._id, 
        deleted: false,
        availabilityStatus: "In Stock"
      }).limit(5); 
    }
    // end lấy sản phẩm danh mục khuyến mãi

    res.render("client/pages/news/main", {
        pageTitle: 'Trang danh sách tin tức',
        newsFeatured: newsFeatured,
        newsNew: newsNew,
        newsEvaluate:newsEvaluate,
        newsPromotion: newsPromotion,
    });
}