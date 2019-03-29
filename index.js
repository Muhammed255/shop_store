const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('connect-flash');

//Connect To DataBase
mongoose.connect('mongodb://localhost/shop_store');
let db = mongoose.connection;

//Check For Successful Connection To DataBase
db.once('open', function(){
	console.log("Connected To MongoDB Successfully");
})

//Check DB Connection Error
db.on('error', function(err){
	console.log(err);
});

//Init App
const app = express();

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());


//Get Product Model
let Product = require('./models/product');

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Set Public folder
app.use(express.static(path.join(__dirname, 'public')));

//Express Session Middleware
app.use(session({
	secret: 'keyboard cat',
	resave: true,
	saveUninitialized: true
}));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
	res.locals.messages = require('express-messages')(req, res);
	next();
});

//Express Validator Middleware
app.use(expressValidator({
	errorFormatter: function (param, msg, value) {
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;
		while (namespace.length) {
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

//Home Route
app.get('/', function (req, res) {
	Product.find({}, function(err, products){
		if (err) {
			console.log(err);
		} else {
			res.render('index', {
				title: 'Products',
				products: products
			});
		}
	});
	
});

//Route Products Files
let products = require('./routes/products');
app.use('/products', products);


//Start Server Port
app.listen(3000, function(){
	console.log("Server Started on port 3000 ....");
});