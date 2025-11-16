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