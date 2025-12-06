const Product = require("../models/product.model");

const productsHelper = require("../helpers/products");

module.exports = async (orderItem) => {
  let orderTotal = 0;
  // Lặp qua từng sản phẩm trong đơn hàng
  for (const product of orderItem.products) {
    // 1. Lấy thông tin chi tiết từ bảng Product
    const productInfo = await Product.findOne({
      _id: product.product_id
    }).select("title thumbnail price discountPercentage slug");

    // 2. Gán thông tin hiển thị (Title, Thumbnail, Slug)
    if (productInfo) {
      product.title = productInfo.title;
      product.thumbnail = productInfo.thumbnail;
      product.slug = productInfo.slug;
      product.productInfo = productInfo; // Gán để helper tính giá dùng

      // 3. Tính giá mới (Sử dụng Helper tính giá của bạn)
      product.priceNew = productsHelper.priceNewProduct(productInfo);
    } else {
      // Fallback: Nếu sản phẩm đã bị xóa, dùng giá lúc đặt hàng
      product.priceNew = product.price;
      product.title = product.title || "Sản phẩm đã ngừng kinh doanh";
      product.thumbnail = product.thumbnail || ""; 
    }

    // 4. Tính thành tiền từng món
    product.totalPrice = parseInt((product.priceNew * product.quantity).toFixed(0));
    
    // Cộng dồn vào tổng tiền hàng
    orderTotal += product.totalPrice;
  }

  // 5. Tính tổng cuối cùng (Cộng phí ship nếu có)
  orderItem.shippingFee = orderItem.shippingFee || 0;
  orderItem.totalPrice = orderTotal + orderItem.shippingFee;

  return orderItem;

}