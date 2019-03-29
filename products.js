const express = require('express');
const router = express.Router();

//Get Product Model
let Product = require('../models/product');

//Add Product GET Route
router.get('/add', function(req, res){
	res.render('Add_Product', {
		title: 'Add Product'
	});
});

//Add Product Submit POST Form Route
router.post('/add', function(req, res){

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

		product.save(function(err){
			if(err){
				console.log(err);
				return;
			} else {
				req.flash('success', 'Product Added Successfully');
				res.redirect('/');
			}
			
		});
	}
});

//Load Edit GET Form
router.get('/edit/:id', function(req, res){
	Product.findById(req.params.id, function(err, product){
		res.render('Edit_Product', {
			title: 'Edit Product',
			product: product
		});
	});
});

//Update Submit POST Route
router.post('/edit/:id', function(req, res){
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
			req.flash('success', 'Article Updated Successfully');
			res.render('/');
		}
	});
});

router.delete('/:id', function(req, res){
	let query = {_id: req.params.id}

	Product.remove(query, function(err){
		if (err) {
			console.log(err);
		} else {
			res.send('Deleted Successfully');
		}
	});
});

module.exports = router;