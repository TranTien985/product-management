const express = require('express')
const database = require("./config/database")
require("dotenv").config();

const systemConfig = require("./config/system")

const routeAdmin = require('./routes/admin/index.route'); //import routes dành cho admin
const route = require('./routes/client/index.route'); // import file routes 
const app = express()
const port = process.env.PORT;

database.connect();

// pug
app.set('views', './views');
app.set('view engine', 'pug');

// css, js
app.use(express.static('public'));

// App locals Variable
app.locals.prefixAdmin = systemConfig.prefixAmin

routeAdmin(app)
route(app)

// này là để mở cổng port
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})