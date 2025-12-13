const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Review = require("../../models/reviews.model"); 
const User = require("../../models/user.model");

const productsHelper = require("../../helpers/products");
const productCategoryHelper = require("../../helpers/product-category")
const paginationHelper = require("../../helpers/pagination"); // phân trang
const filterProductsHelper = require("../../helpers/products");
const filterRatingHelper = require("../../helpers/filterReviewRating"); // lọc

// [GET] /products
module.exports.index = async (req, res) => {
  // hàm lọc
  let find = {
    deleted: false,
  };

  // sidebar lọc
  await filterProductsHelper.filterProduct(req.query, find);
  // end sidebar lọc

  const countProducts = await Product.countDocuments(find);
  let objectPagination = paginationHelper(
    { currentPage: 1, limitItems: 18 },
    req.query,
    countProducts
  );

  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  
  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip);

  // hàm này dùng để tính giá tiền khi có giảm giá
  const newProducts = productsHelper.priceNewProducts(products)
  
  res.render("client/pages/products/index", {
      pageTitle: 'Danh sách sản phẩm',
      products: newProducts,
      pagination: objectPagination,
      queryParams: req.query,
  });
}

// [GET] /products/detail/:slugProduct
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      slug: req.params.slugProduct,
      availabilityStatus: "In Stock"
    };

    const product = await Product.findOne(find).lean();
    // hàm lean này để chuyển product thành obj thuần thì bên view mới dùng dc product.category.title

    if(product.product_category_id){
      const category = await ProductCategory.findOne({
        _id:product.product_category_id,
        availabilityStatus: "In Stock",
        deleted: false,
      });

      product.category = category;
    }

    product.priceNew = productsHelper.priceNewProduct(product);


    const filterRating = filterRatingHelper.filterRating(req.query);

    let findRating = {
      product_id: product._id,
      deleted: false,
      status: "active" 
    };

    // Lọc theo rating
    if (req.query.rating) {
      if (req.query.rating === "images") {
        // Tìm các bản ghi có trường 'images' tồn tại VÀ mảng không rỗng
        findRating.images = { $exists: true, $ne: [] }; 
      } else {
        // --- LOGIC LỌC THEO SỐ SAO (5, 4, 3...) ---
        const star = parseInt(req.query.rating);
        
        // Kiểm tra nếu là số hợp lệ thì thêm vào điều kiện tìm kiếm
        if (!isNaN(star)) {
            findRating.rating = star;
        }
      }
    }

    // Chỉ lấy đánh giá đã được duyệt (active)
    const reviews = await Review.find(findRating).sort({ createdAt: "desc" }).lean();
    
    // Khởi tạo biến thống kê
    let totalRatings = reviews.length;
    let averageRating = 0;
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }; 
    const ratingPercents = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    if (totalRatings > 0) {
      let sumRatings = 0;
      let validReviewsCount = 0; // Đếm số lượng review hợp lệ thực sự

      reviews.forEach(review => {
        let rawRating = review.rating || review.star || review.point || 0; 
        let ratingVal = Number(rawRating); 

        // Kiểm tra xem có phải là số hợp lệ từ 1-5 không
        if (!isNaN(ratingVal) && ratingVal >= 1 && ratingVal <= 5) {
            sumRatings += ratingVal;
            ratingCounts[Math.floor(ratingVal)]++; // Math.floor đề phòng số lẻ 4.5
            validReviewsCount++;
        } else {
            console.log("Review bị lỗi dữ liệu rating:", review);
        }
      });

      // Tính trung bình (Chia cho số review hợp lệ)
      if (validReviewsCount > 0) {
        averageRating = (sumRatings / validReviewsCount).toFixed(1);
      }

      // Tính phần trăm (Dùng totalRatings để thể hiện tỷ lệ trên tổng số)
      for (let i = 1; i <= 5; i++) {
        ratingPercents[i] = Math.round((ratingCounts[i] / totalRatings) * 100);
      }
    }

    // 3. Chuẩn bị dữ liệu hiển thị (Lấy tên người đánh giá)
    for (const review of reviews) {
      if (review.user_id) {
        // Chỉ lấy trường fullName từ Model User
        const user = await User.findById(review.user_id).select("fullName");
        review.userFullName = user ? user.fullName : "Khách hàng ẩn danh";
      } else {
          review.userFullName = "Khách hàng ẩn danh";
      }
    }

    // sản phẩm tương tự
    const relatedProducts = await Product.aggregate([
      {
        $match: {
          product_category_id: product.product_category_id, // Lọc cùng danh mục
          deleted: false,
          availabilityStatus: "In Stock",
          _id: { $ne: product._id } // Loại trừ sản phẩm đang xem
        }
      },
      {
        $sample: { size: 3 } // Lấy ngẫu nhiên 3 sản phẩm từ kết quả lọc trên
      }
    ]);

    // hàm này dùng để tính giá tiền khi có giảm giá
    const newRelatedProducts = productsHelper.priceNewProducts(relatedProducts)
    
    
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      filterRating: filterRating,
      product: product,
      reviews: reviews, 
      averageRating: averageRating, 
      ratingCounts: ratingCounts, 
      ratingPercents: ratingPercents,
      totalRatings: totalRatings,
      relatedProducts: newRelatedProducts
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

    const listSubCategory = await productCategoryHelper.getSubCategory(category.id);
    const listSubCategoryId = listSubCategory.map(item => item.id);

    let find = {
        deleted: false,
        product_category_id: { $in: [category.id, ...listSubCategoryId] },
    };

    // sidebar lọc
    if(filterProductsHelper.filterProduct) {
      await filterProductsHelper.filterProduct(req.query, find);
    }
    // end sidebar lọc

    // Dùng Product.countDocuments(find) trực tiếp để đếm
    const countProducts = await Product.countDocuments(find);

    // TÍNH TOÁN PHÂN TRANG
    let objectPagination = paginationHelper(
        { currentPage: 1, limitItems: 18 },
        req.query,
        countProducts
    );
    
    // TRUY VẤN SẢN PHẨM VÀ ÁP DỤNG PHÂN TRANG
    const products = await Product.find(find)
        .sort({ position : "desc" })
        .limit(objectPagination.limitItems) 
        .skip(objectPagination.skip)
        .lean(); // Nên thêm .lean() nếu bạn chỉ dùng để render

    const newProducts = productsHelper.priceNewProducts(products)

    res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: newProducts,
        pagination: objectPagination,
        queryParams: req.query,
    });
}

// [POST] /products/review/:productId
module.exports.review = async (req, res) => {
  const productId = req.params.productId;
  const user = res.locals.user;

  try {
    // --- 0. KIỂM TRA ĐĂNG NHẬP ---
    if (!user || !user.id) {
      req.flash("error", "Vui lòng đăng nhập để đánh giá sản phẩm.");
      return res.redirect("/user/login");
    }

    const userId = user.id; // Lấy ID
    const fullName = user.fullName;

    // 1. Lấy và chuẩn hóa dữ liệu từ form
    const rating = parseInt(req.body.star);
    const content = req.body.content ? req.body.content.trim() : '';

    // --- BƯỚC 1: KIỂM TRA VALIDATION BẮT BUỘC ---
    if (isNaN(rating) || rating < 1 || rating > 5 || content === "") {
      req.flash("error", "Vui lòng chọn số sao và nhập nội dung đánh giá!");
      return res.redirect(req.get("Referer") || "/");
    }

    // 2. Xử lý ảnh
    let images = [];
    if (req.body.images) {
      images = Array.isArray(req.body.images) ? req.body.images.filter(img => img) : [req.body.images].filter(img => img);
    }

    // 3. Tạo object Review mới
    const reviewData = {
      product_id: productId,
      rating: rating,     // Lưu ý: Model của bạn hình như để là 'rating', Controller đang để 'star'. Hãy kiểm tra kỹ tên trường trong Model nhé!
      content: content,
      images: images,
      deleted: false,
      status: "inactive", 
      createdAt: new Date(),
      createdBy: {
        user_id: userId,
        user_name: fullName // Lưu tên người dùng vào đây
      }
    };

    const review = new Review(reviewData);
    await review.save();

    // 4. CẬP NHẬT ĐIỂM TRUNG BÌNH SẢN PHẨM (Chỉ chạy nếu status là 'active')
    if (reviewData.status === "active") {
      const updatedReviews = await Review.find({ 
        product_id: productId, 
        deleted: false, 
        status: "active" 
      });
      
      let sumStars = 0;
      updatedReviews.forEach(r => { sumStars += r.rating; });
      
      const newAverageRating = (updatedReviews.length > 0) ? (sumStars / updatedReviews.length).toFixed(1) : 0;

      await Product.updateOne(
        { _id: productId },
        {
          averageRating: parseFloat(newAverageRating),
          totalReviews: updatedReviews.length
        }
      );
    }

    req.flash("success", "Cảm ơn bạn đã đánh giá sản phẩm! Đánh giá sẽ được hiển thị sau khi duyệt.");
    res.redirect(req.get("Referer") || "/");

  } catch (error) {
      res.redirect(req.get("Referer") || "/");
  }
};