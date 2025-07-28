const categoryMiddlewares = require("../../middlewares/clients/category.middlewares");
const cartMiddlewares = require("../../middlewares/clients/cart.middleware");

// muốn import file routes vào file index thì phải export nó ra trước
const homeRouter = require("./home.route");
const productRouter = require("./products.routes");
const searchRouter = require("./search.route");
const cartRouter = require("./cart.route");

module.exports = (app) => {
  app.use(categoryMiddlewares.category)// khi bất kì vào trang nào thì nó đều đi qua cái thằng này
  app.use(cartMiddlewares.cartId)// khi bất kì vào trang nào thì nó đều đi qua cái thằng này

  // trong file home cả product đã có get rồi nên ở đây chỉ cần use là dc
  app.use("/",  homeRouter);

  app.use("/products",  productRouter);

  app.use("/search",  searchRouter);

  app.use("/cart",  cartRouter);
};
