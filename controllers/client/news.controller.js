const News = require("../../models/news.model");
const NewsCategory = require("../../models/news-category.model");

const newsCategoryHelper = require("../../helpers/news-category")

// [GET] /news
module.exports.index = async (req, res) => {
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

    res.render("client/pages/news/index", {
        pageTitle: 'Trang danh sách tin tức',
        newsFeatured: newsFeatured,
        newsNew: newsNew,
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

  const category = await NewsCategory.findOne({
    slug: req.params.slugCategory,
    availabilityStatus: "In Stock",
    deleted: false,
  });

  // vì hàm trên dùng async-await nên dưới đây cũng phải dùng await để chờ lấy ra hết data
  const listSubCategory = await newsCategoryHelper.getSubCategory(category.id);
  
  const listSubCategoryId = listSubCategory.map(item => item.id);
  

  const news = await News.find({
    // lấy tất phần tử khi ta bấm vào danh mục cha (phải có tất cả sản phẩm ở danh mục con)
    news_category_id: { $in: [category.id, ...listSubCategoryId] },
    deleted: false
  }).sort({ position : "desc" });

  res.render("client/pages/news/index", {
    pageTitle: category.title,
    news: news
  });
}