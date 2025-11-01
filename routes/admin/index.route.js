// muốn import file routes vào file index thì phải export nó ra trước
const systemConfig = require("../../config/system")

const authMiddlewares = require("../../middlewares/admin/auth.middlewares")

const dashboardRouter = require("./dashboard.route")
const productRouter = require("./product.routes")
const productCategoryRouter = require("./products-category.route")
const roleRouter = require("./role.route")
const accountRouter = require("./account.route")
const authRouter = require("./auth.route")
const myAccountRouter = require("./my-account.route")
const settingRouter = require("./setting.route")
const newsRouter = require("./news.route")
const newsCategoryRouter = require("./news-category.route")

module.exports = (app) =>{
  const PATH_ADMIN = systemConfig.prefixAdmin;

  app.use(
    PATH_ADMIN + '/dashboard',
    authMiddlewares.requireAuth,
    dashboardRouter
  );
  
  app.use(
    PATH_ADMIN + '/products',
    authMiddlewares.requireAuth,
    productRouter
  );

  app.use(
    PATH_ADMIN + '/products-category',
    authMiddlewares.requireAuth,
    productCategoryRouter
  );

  app.use(
    PATH_ADMIN + '/roles',
    authMiddlewares.requireAuth,
    roleRouter
  );

  app.use(
    PATH_ADMIN + '/accounts',
    authMiddlewares.requireAuth,
    accountRouter
  );

  app.use(
    PATH_ADMIN + '/my-account',
    authMiddlewares.requireAuth,
    myAccountRouter
  );

  app.use(PATH_ADMIN + '/auth', authRouter);

  app.use(
    PATH_ADMIN + '/settings',
    authMiddlewares.requireAuth,
    settingRouter
  );
  
  app.use(
    PATH_ADMIN + '/news',
    authMiddlewares.requireAuth,
    newsRouter
  );

  app.use(
    PATH_ADMIN + '/news-category',
    authMiddlewares.requireAuth,
    newsCategoryRouter
  );


}