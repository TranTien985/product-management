module.exports.priceNewProducts = (products) => {
  const newProducts = products.map(item => {
    item.priceNew = (item.price-item.discountPercentage);
    return item
  });  

  return newProducts;
}

module.exports.priceNewProduct = (product) => {
  const priceNew = (
    (product.price - product.discountPercentage));

  return parseInt(priceNew);
}