const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Get User Model
let User = require('../models/user');

//Registration Form
router.get('/register', function(req, res){
	res.render('Register');
});

//Register Processes
router.post('/register', function(req, res){
	const fname = req.body.fname;
	const lname = req.body.lname;
	const user = req.body.username;
	const pass = req.body.password;
	const email = req.body.email;
	const address = req.body.address;
	const phone = req.body.phone;

	req.checkBody('fname', 'First Name is Required').notEmpty();
	req.checkBody('lname' , 'Last Name is Required').notEmpty();
	req.checkBody('username' , 'Username is Required').notEmpty();
	req.checkBody('password' , 'Password is Required').notEmpty();
	req.checkBody('password2' , 'Password Does Not Match').equals(req.body.password);
	req.checkBody('email'    , 'Email is Required').notEmpty();
	req.checkBody('email'    , 'Email is Not Valid').isEmail();
	req.checkBody('address'  , 'Address is Required').notEmpty();
	req.checkBody('phone'    , 'Phone is Required').notEmpty();

	let errors = req.validationErrors();

	if(errors){
		res.render('Register', {
			errors: errors
		});
	} else {
		let newUser = new User({
			FirstName: fname,
			LastName: lname,
			Username: user,
			Password: pass,
			Email: email,
			Address: address,
			Phone: phone
		});

		bcrypt.genSalt(10, function(err, salt){
			bcrypt.hash(newUser.Password, salt, function(err, hash){
				if (err) {
					console.log(err);
				}
				newUser.Password = hash;
				newUser.save(function(err){
					if (err) {
						console.log(err);
						return;
					} else {
						req.flash('success', 'You are Now Registered, Login now');
						res.redirect('/users/login');
					}
				});
			});
		});
	}
});

//Login Form Get Request
router.get('/login', function(req, res){
	res.render('Login');
});

//Login Form POST Request
router.post('/login', function(req, res, next){
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});


//Logout Get Request
router.get('/logout', function(req, res){
	req.logout();
	req.flash('success', 'You are Logged out');
	res.redirect('/users/login');
});

module.exports = router;