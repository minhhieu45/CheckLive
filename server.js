const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');

const app = express();
dotenv.config({path:'config.env'});
const port = process.env.PORT || 8080;

//Log requests
app.use(morgan('tiny'));

//Parse request to body-parser
app.use(bodyparser.urlencoded({extended:true}));

//Set view engine
app.set("view engine", "ejs");
// app.set("views", path.resolve(__dirname,"views/ejs"));

//Load assets
app.use('/img', express.static(path.resolve(__dirname,"assets/img")));
app.use('/js', express.static(path.resolve(__dirname,"assets/js")));

app.use('/',require('./server/routes/router'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})