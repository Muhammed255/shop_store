const express = require('express');
const router = express.Router();
const multer  = require('multer');
const upload = multer({ dest: '/Uploads' });

//Get Product Model
let Product = require('../models/product');

//Get User Model
let User = require('../models/user');

//Home Route
router.get('/product_table', ensureAuthenticated, function (req, res) {
	Product.find({}, function(err, products){
		if (err) {
			console.log(err);
		} else {
			res.render('Product_Table', {
				title: 'Products',
				products: products
			});
		}
	});
	
});


//Add Product GET Route
router.get('/add', ensureAuthenticated, function(req, res){
	res.render('Add_Product', {
		title: 'Add Product'
	});
});

//Add Product Submit POST Form Route
router.post('/add', upload.any(), ensureAuthenticated, function(req, res){

	req.checkBody('productname', 'Product Name is Required').notEmpty();
	req.checkBody('Price', 'Price is Required').isNumeric().notEmpty();
	req.checkBody('Description', 'Description is Required').notEmpty();
	req.checkBody('image', 'Image is Required').notEmpty();
	req.checkBody('Production_Date', 'Production Date is Required').notEmpty();
	req.checkBody('Expire_Date', 'Expire Date is Required').notEmpty();
	req.checkBody('CategoryID', 'Category is Required').notEmpty();

	//Get Errors
	let errors = req.validationErrors();

	if(errors){
		res.render('Add_Product', {
			title: 'Add Product',
			errors: errors
		});
	} else {
		let product = new Product();
		product.Name = req.body.productname;
		product.Price = req.body.Price;
		product.Description = req.body.Description;
		product.Image = req.body.image;
		product.Production_Date = req.body.Production_Date;
		product.Expire_Date = req.body.Expire_Date;
		product.CountryMade = req.body.CountryMade;
		product.CategoryID = req.body.CategoryID;
		product.AdminID = req.user._id;

		product.save(function(err){
			if(err){
				console.log(err);
				return;
			} else {
				req.flash('success', 'Product Added Successfully');
				res.send();
				res.redirect('/products/product_table');
			}
			
		});
	}
});

//Load Edit GET Form

router.get('/edit/:id', ensureAuthenticated, function(req, res){
	Product.findById(req.params.id, function(err, product){
		if(product.AdminID != req.user._id){
			req.flash('danger', 'Not Authorize');
			res.redirect('/');
		}
		res.render('Edit_Product', {
			title: 'Edit Product',
			product: product
		});
	});
});

//Update Submit POST Route
router.post('/edit/:id', ensureAuthenticated, upload.any(), function(req, res){
	let product = {};
	product.Name = req.body.productname;
	product.Price = req.body.Price;
	product.Description = req.body.Description;
	product.Image = req.body.image;
	product.Production_Date = req.body.Production_Date;
	product.Expire_Date = req.body.Expire_Date;
	product.CountryMade = req.body.CountryMade;
	product.CategoryID = req.body.CategoryID;

	let query = {_id: req.params.id}

	Product.update(query, product, function(err){
		if(err){
			console.log(err);
			return;
		} else {
			req.flash('success', 'Product Updated Successfully');
			res.redirect('/products/product_table');
		}
	});
});

router.delete('/:id', function(req, res){
	if(!req.user._id){
		res.status(500).send();
	}
	let query = {_id: req.params.id}

	Product.findById(req.params.id, function(err, product){
		if(product.AdminID != req.user._id){
			res.status(500).send();
		} else {
			Product.remove(query, function(err){
				if (err) {
					console.log(err);
				} else {
					res.send('Deleted Successfully');
				}
			});
		}
	})
});

//Access Control
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('danger', 'You are Not Allow To Explore This Page, Please Login ya 3am');
		res.redirect('/users/login');
	}
}

module.exports = router;