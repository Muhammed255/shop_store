let mongoose = require('mongoose');

//User Schema
let UserSchema = mongoose.Schema({
	FirstName: {type: String, require: true},
	LastName: {type: String, require: true},
	Username: {type: String, require: true},
	Password: {type: String, require: true},
	Email: {type: String, require: true},
	Address: {type: String, require: true},
	Phone: {type: Number, require: true}
});

const User = module.exports = mongoose.model('User', UserSchema);