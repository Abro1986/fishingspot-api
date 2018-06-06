let db = require('./models')

let user = 
	{
	username: 'Andrew',
	passwordDigest: '1234',   	
  	spots: {	name: "miracle mile",
  		description: "big, fast, deep, browns",
  		species: 'brown trout'
  		},
	};
  



console.log("hi im alive")

db.Spot.remove({}, function(err, spots){
	if(err) {
		console.log(err)
	} else {
		console.log("database cleaned")
	}
})

db.Spot.create(user ,function(err, user){
	if (err) {return console.log(err);}
	console.log('saved new spot: ', user)
	process.exit();
});