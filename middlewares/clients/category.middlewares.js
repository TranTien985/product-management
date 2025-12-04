const ProductCategory = require("../../models/product-category.model"); //database
const NewsCategory = require("../../models/news-category.model"); //database
const createTreeHelper = require("../../helpers/createTree")

module.exports.category = async (req, res, next) => {
  let find = {
    deleted: false,
  };

  const productCategory = await ProductCategory.find(find);
  const newProductCategory = createTreeHelper.tree(productCategory);

  const newsCategory = await NewsCategory.find(find);
  const newNewsCategory = createTreeHelper.tree(newsCategory);

  // vì biến này cần dùng lại nhiều nên ta phải tạo middlewares để tái sử dụng nó
  res.locals.layoutProductCategory = newProductCategory;
  res.locals.layoutNewsCategory = newNewsCategory;

  next()
}

module.exports.productCategoryFilter = async (req, res, next) => {
  let find = {
    deleted: false,
  };

  const productCategories = await ProductCategory.find(find).lean();
    // --- PHÂN LOẠI DANH MỤC CẤP BẬC ---
    const categories = productCategories.filter(item => 
        item.parent_id === "" || item.parent_id === null
    );
    const categoriesBrand = productCategories.filter(item => 
        item.parent_id !== "" && item.parent_id !== null
    );

  // vì biến này cần dùng lại nhiều nên ta phải tạo middlewares để tái sử dụng nó
  res.locals.categoriesFilter = categories;
  res.locals.categoriesBrandFilter = categoriesBrand;

  next()
}