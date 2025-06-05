// muốn import file routes vào file index thì phải export nó ra trước
const homeRouter = require("./home.route")
const productRouter = require("./products.routes")


module.exports = (app) =>{
    // trong file home cả product đã có get rồi nên ở đây chỉ cần use là dc 
    app.use('/', homeRouter);
    app.use('/products', productRouter);
}