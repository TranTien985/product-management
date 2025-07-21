const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const productsHelper = require("../../helpers/products");
const productCategoryHelper = require("../../helpers/product-category")

// [GET] /products
module.exports.index = async (req, res) => {
    // hàm lọc
    const products = await Product.find({
        availabilityStatus: 'In Stock'
    }).sort({position: "desc"});

    // hàm này dùng để tính giá tiền khi có giảm giá
    const newProducts = productsHelper.priceNewProducts(products)
    
    res.render("client/pages/products/index", {
        pageTitle: 'Trang danh sách sản phẩm',
        products: newProducts
    });
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
    try {
    const find = {
    deleted: false,
    slug: req.params.slug,
    availabilityStatus: "In Stock"
    };

    const product = await Product.findOne(find);

    
    
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  } catch (error) {
    res.redirect(`/products`);
  }
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {

  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    availabilityStatus: "In Stock",
    deleted: false,
  });

  // vì hàm trên dùng async-await nên dưới đây cũng phải dùng await để chờ lấy ra hết data
  const listSubCategory = await productCategoryHelper.getSubCategory(category.id);
  
  const listSubCategoryId = listSubCategory.map(item => item.id);
  

  const products = await Product.find({
    // lấy tất phần tử khi ta bấm vào danh mục cha (phải có tất cả sản phẩm ở danh mục con)
    product_category_id: { $in: [category.id, ...listSubCategoryId] },
    deleted: false
  }).sort({ position : "desc" });
  
  
  const newProducts = productsHelper.priceNewProducts(products)

  res.render("client/pages/products/index", {
    pageTitle: category.title,
    products: newProducts
  });
}