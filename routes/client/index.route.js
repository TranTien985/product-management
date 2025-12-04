const categoryMiddlewares = require("../../middlewares/clients/category.middlewares");
const cartMiddlewares = require("../../middlewares/clients/cart.middleware");
const userMiddlewares = require("../../middlewares/clients/user.middlewares")
const settingMiddlewares = require("../../middlewares/clients/setting.middleware")

// muốn import file routes vào file index thì phải export nó ra trước
const homeRouter = require("./home.route");
const productRouter = require("./products.routes");
const searchRouter = require("./search.route");
const cartRouter = require("./cart.route");
const checkoutRouter = require("./checkout.route");
const userRouter = require("./user.route");
const newsRouter = require("./news.route");
const storeRouter = require("./store.route");

module.exports = (app) => {
  // khi bất kì vào trang nào thì nó đều đi qua cái thằng này
  app.use(categoryMiddlewares.category)
  app.use(categoryMiddlewares.productCategoryFilter)
  app.use(cartMiddlewares.cartId)
  app.use(userMiddlewares.infoUser)
  app.use(settingMiddlewares.settingGeneral)

  // trong file home cả product đã có get rồi nên ở đây chỉ cần use là dc
  app.use("/",  homeRouter);

  app.use("/products",  productRouter);

  app.use("/search",  searchRouter);

  app.use("/cart",  cartRouter);

  app.use("/checkout",  checkoutRouter);

  app.use("/user",  userRouter);

  app.use("/news",  newsRouter);

  app.use("/store",  storeRouter);
};
