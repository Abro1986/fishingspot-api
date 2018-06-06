let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let SpotSchema = new Schema({
	name: String,
	description: String,
	species: String, default: "",
})



let Spot = mongoose.model("Spot", SpotSchema);


module.exports = Spot;
