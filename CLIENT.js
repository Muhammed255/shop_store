


let client = require('mongoose');

// Products Schema

let productSchema = client.Schema({
	Name: {type: String, required: true},
	mail: {type: String, required: true},
	phone_number: {type: String, required: true, Number:true},
	Address: {type: String, required: true},

});

let Product = module.exports = mongoose.model('Product', productSchema);


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
