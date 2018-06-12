let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SpotSchema = new Schema({
	name: String,
	description: String,
	species: String, default: "",
	weather: Number,
})

let UserSchema = new Schema({
 	username: String,
	passwordDigest: String,
	
	spots: [SpotSchema], default: '',
});


let User = mongoose.model('User', UserSchema);
module.exports = User;