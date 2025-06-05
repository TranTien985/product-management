// muốn import file routes vào file index thì phải export nó ra trước
const dashboardRouter = require("./dashboard.route")
const productRouter = require("./product.routes")
const systemConfig = require("../../config/system")

module.exports = (app) =>{
  const PATH_ADMIN = systemConfig.prefixAmin;

  app.use(PATH_ADMIN + '/dashboard', dashboardRouter);
  
  app.use(PATH_ADMIN + '/products', productRouter);
}