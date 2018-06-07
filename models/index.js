let mongoose= require('mongoose')

if (process.env.NODE_ENV == "production") {
//	console.log("connecting to " + process.env.MLAB_URL)
  mongoose.connect(process.env.MLAB_URL)
} else {
mongoose.connect('mongodb://localhost/fishing-spots');
}

module.exports.Spot = require("./user.js")

// mongodb://browntrout:wollybugger@ds259089.mlab.com:59089/fishingspotdb
//mongodb://browntrout:wollybugger@ds151840.mlab.com:51840/fishingspots-api