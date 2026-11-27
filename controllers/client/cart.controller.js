const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// [GET] /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId
  });

  if (cart && cart.products && cart.products.length > 0) {
    const validProducts = [];

    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
        deleted: false
      }).select("title thumbnail slug price discountPercentage stock availabilityStatus");

      if (productInfo) {
        productInfo.priceNew = productsHelper.priceNewProduct(productInfo);
        item.productInfo = productInfo;
        item.totalPrice = parseInt((productInfo.priceNew * item.quantity).toFixed(0));
        validProducts.push(item);
      }
    }

    cart.products = validProducts;
    cart.totalPrice = validProducts.reduce((sum, item) => sum + item.totalPrice, 0);
  } else if (cart) {
    cart.totalPrice = 0;
  }

  res.render("client/pages/cart/index", {
    pageTitle: 'Giỏ hàng',
    cartDetail: cart || { products: [], totalPrice: 0 }
  });
};

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;
  const type = req.body.type;

  // 1. Ràng buộc số lượng hợp lệ
  if (isNaN(quantity) || quantity <= 0) {
    req.flash("error", "Số lượng sản phẩm không hợp lệ!");
    return res.redirect(req.get("Referer") || "/");
  }

  // 2. Ràng buộc sản phẩm tồn tại và còn kinh doanh
  const product = await Product.findOne({
    _id: productId,
    deleted: false,
  });

  if (!product || product.availabilityStatus === "Out of Stock") {
    req.flash("error", "Sản phẩm không tồn tại hoặc đã hết hàng!");
    return res.redirect(req.get("Referer") || "/");
  }

  const cart = await Cart.findOne({
    _id: cartId
  });

  if (!cart) {
    req.flash("error", "Không tìm thấy giỏ hàng!");
    return res.redirect(req.get("Referer") || "/");
  }

  const existProductInCart = cart.products.find(item => item.product_id == productId);
  const currentInCart = existProductInCart ? existProductInCart.quantity : 0;
  const newTotalQty = currentInCart + quantity;

  // 3. Ràng buộc số lượng tồn kho
  if (product.stock !== undefined && newTotalQty > product.stock) {
    req.flash("error", `Số lượng tồn kho không đủ! Hiện tại kho chỉ còn ${product.stock} sản phẩm.`);
    return res.redirect(req.get("Referer") || "/");
  }

  if (existProductInCart) {
    // cập nhật quantity khi mà thêm sản phẩm trùng
    await Cart.updateOne(
      {
        _id: cartId,
        'products.product_id': productId
      },
      {
        $set: {
          'products.$.quantity': newTotalQty
        }
      }
    );
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity
    };
    await Cart.updateOne(
      { _id: cartId },
      { $push: { products: objectCart } }
    );
  }

  req.flash("success", "Đã thêm sản phẩm vào giỏ hàng");

  if (type === 'buy-now') {
    res.redirect("/cart");
  } else {
    res.redirect(req.get("Referer") || "/");
  }
};

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;

  await Cart.updateOne(
    { _id: cartId },
    { $pull: { products: { product_id: productId } } }
  );

  req.flash("success", "Đã xóa sản phẩm ra khỏi giỏ hàng!");
  res.redirect(req.get("Referer") || "/");
};

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  let quantity = parseInt(req.params.quantity);

  if (isNaN(quantity) || quantity <= 0) {
    req.flash("error", "Số lượng phải lớn hơn 0!");
    return res.redirect(req.get("Referer") || "/");
  }

  // Ràng buộc số lượng tồn kho khi cập nhật
  const product = await Product.findOne({
    _id: productId,
    deleted: false
  });

  if (product && product.stock !== undefined && quantity > product.stock) {
    quantity = product.stock;
    req.flash("error", `Kho chỉ còn tối đa ${product.stock} sản phẩm! Đã cập nhật về mức tối đa.`);
  }

  await Cart.updateOne(
    {
      _id: cartId,
      'products.product_id': productId,
    },
    {
      $set: {
        'products.$.quantity': quantity,
      }
    }
  );

  res.redirect(req.get("Referer") || "/");
};