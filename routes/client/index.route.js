const categoryMiddlewares = require("../../middlewares/clients/category.middlewares");

// muốn import file routes vào file index thì phải export nó ra trước
const homeRouter = require("./home.route");
const productRouter = require("./products.routes");

module.exports = (app) => {
  app.use(categoryMiddlewares.category)// khi bất kì vào trang nào thì nó đều đi qua cái thằng này

  // trong file home cả product đã có get rồi nên ở đây chỉ cần use là dc
  app.use("/",  homeRouter);

  app.use("/products",  productRouter);
};
