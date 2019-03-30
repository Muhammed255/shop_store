let mongoose = require('mongoose');

// Products Schema

let productSchema = mongoose.Schema({
	Name: {type: String, required: true},
	Price: {type: Number, required: true},
	Description: {type: String, required: true},
	Image: {type: String, required: true},
	Production_Date: {type: Date, required: true},
	Expire_Date: {type: Date, required: true},
	CategoryID: {type: Number, required: true},
	AdminID: {type: String, ref: 'User'},
	CountryMade: {type: String, required: true},
});

let Product = module.exports = mongoose.model('Product', productSchema);