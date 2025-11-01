module.exports.priceNewProducts = (products) => {
  const newProducts = products.map(item => {
<<<<<<< HEAD
    item.priceNew = (item.price-item.discountPercentage);
=======
    item.priceNew = (item.price*(100-item.discountPercentage)/100).toFixed(1);
    // hàm toFixed() dùng để làm tròn
>>>>>>> daedc8515f1a6e9d7a566ff5f73d85a1007f39dd
    return item
  });  

  return newProducts;
}

module.exports.priceNewProduct = (product) => {
  const priceNew = (
<<<<<<< HEAD
    (product.price - product.discountPercentage));
=======
    (product.price*(100 - product.discountPercentage))/100).toFixed(1);
>>>>>>> daedc8515f1a6e9d7a566ff5f73d85a1007f39dd

  return parseInt(priceNew);
}