const ProductCategory = require("../models/product-category.model");
const productCategoryHelper = require("./product-category");


// Hàm cho MỘT mảng sản phẩm
module.exports.priceNewProducts = (products) => {
  const newProducts = products.map(item => {
    if (item && typeof item.price !== 'undefined') {
      item.priceNew = (item.price * (100 - (item.discountPercentage || 0)) / 100);
    } else {
      item.priceNew = 0; // Đặt giá trị mặc định nếu item lỗi
    }
    return item;
  });

  return newProducts;
}

// Hàm cho MỘT sản phẩm
module.exports.priceNewProduct = (product) => {
  const priceNew = (
    product.price * (100 - (product.discountPercentage || 0)) / 100
  );

  return parseInt(priceNew);
}

module.exports.filterProduct = async (query, find) => {
  // --- A. LỌC THEO DANH MỤC (CATEGORY) ---
  if (query.category) {
    const slugs = Array.isArray(query.category) ? query.category : [query.category];

    // B1: Tìm các danh mục tương ứng với slug được chọn
    const listCategory = await ProductCategory.find({
      slug: { $in: slugs },
      deleted: false
    });

    let listCategoryId = [];

    // B2: Duyệt qua từng danh mục đã chọn để lấy cả danh mục CON của nó
    for (const category of listCategory) {
        // Thêm chính ID của danh mục đó
        listCategoryId.push(category.id);

        // Lấy tất cả danh mục con (đệ quy)
        const listSubCategory = await productCategoryHelper.getSubCategory(category.id);
        const listSubCategoryId = listSubCategory.map(item => item.id);

        // Gộp ID con vào danh sách chung
        listCategoryId = [...listCategoryId, ...listSubCategoryId];
    }

    // B3: Thêm điều kiện tìm kiếm
    find.product_category_id = { $in: listCategoryId };
  }

  // --- B. LỌC THEO GIÁ (PRICE - Logic MongoDB Aggregation) ---
  if (query.price) {
    const prices = Array.isArray(query.price) ? query.price : [query.price];
    
    const priceOr = [];

    prices.forEach(priceStr => {
      // priceStr dạng: "str-0-200000"
      const parts = priceStr.split("-");
      if(parts.length === 3) {
        const min = parseInt(parts[1]);
        const max = parseInt(parts[2]);
        
        // Logic tính toán giá sau giảm
        priceOr.push({
          $expr: {
            $and: [
              {
                $gte: [
                  { 
                    $multiply: [ 
                      "$price", 
                      { $divide: [ { $subtract: [100, "$discountPercentage"] }, 100 ] } 
                    ] 
                  },
                  min
                ]
              },
              {
                $lte: [
                  { 
                    $multiply: [ 
                      "$price", 
                      { $divide: [ { $subtract: [100, "$discountPercentage"] }, 100 ] } 
                    ] 
                  },
                  max
                ]
              }
            ]
          }
        });
      }
    });

    // Nếu có điều kiện giá, thêm vào find với toán tử $or
    if (priceOr.length > 0) {
      find.$or = priceOr;
    }
  }

  return find;
};