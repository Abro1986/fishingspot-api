//allspots/api.darksky.net/forecast/a464f1a55a36979cd5db19fd4a1b80d0/39.7392,-104.9903
require('dotenv').config();
let db = require('./models')
let Spot = require('./models/user')
let request = require('request')
let userSpot = require('./models/spot')
let cors = require('cors')


let bodyParser = require('body-parser');
let express = require('express');
let path = require('path')
const bcrypt = require('bcrypt');
const session = require('express-session');

const User = require('./models/user')

let app = express()
const saltRounds = 10;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./public'))
app.use(session({
	secret: 'something secret',
	resave: false,
	saveUnintialized: true,
}))

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', function(req,res){
	res.render("signup.ejs")
})

app.get('/login', (req, res) =>{
	res.render('login.ejs')
})

app.get('/allspots', function(req, res) {
	Spot.findOne({}, function(err, user){
		console.log(user.spots.id)
//		console.log(user.spots[0])
		
//		console.log(req.body)
	  if (err) {console.log(err)}
	
	 else {res.render("index.ejs", {user: user});}
//		 else res.json(user)
	});
});

app.post('/signup', function(req, res) {

		console.log("sign up first")

	let username = req.body.username;
	Spot.findOne({username: username}, (err, user) => {
		
		if (user.username === username) {
			console.log('please choose another username')
			res.redirect('/')
		} else bcrypt.hash(req.body.password, saltRounds, function(err, hash){
				let user = new User({username: username, passwordDigest: hash});
				user.save().then(function()  {
				console.log('new user created! ', username);
				req.session.user = user;
				res.redirect('/login')
			})
		})	
	})	
});

app.post('/login', (req, res) => {
	let username = req.body.username;
	let enteredPassword = req.body.password;

	User.findOne({username: username}, (err, user) => {
		if(user) {
			bcrypt.compare(enteredPassword, user.passwordDigest, (err, result) => {
				if(err) {
					console.log('incorrect password');
				};
				if(result) {
					console.log('logged in')
					req.session.user = user
					res.redirect('/allspots');
				}
			});
		}
		if(err){
			console.log(err);
			res.redirect('/');
		}
	});
});


app.post('/spots', function(req, res){
//	console.log(req.body);
	Spot.findOne({}, (err, user)=>{
//		let spotModel = new userSpot();
		user.spots.push(req.body)
		user.save().then() 
		console.log(user.spots)
		console.log(user.spots.length);
	
	});

	// let newSpot = db.Spot(req.body);
	// Spot.create(newSpot, function(err, newSpot) {
	// 	if (err) {console.log(err)}
	// });
//	console.log(db.Spot(req.body));
	res.json();
});

app.delete('/spots/:id', function(req, res) {
	console.log(req.params.id)
	Spot.findOne({}, function(err, user){
		user.spots.id(req.params.id).remove()
		user.save()
		if (err) {
			console.log(err);
		}
	
		res.json(user);
			// res.render("index.ejs", {spots: spots});

	}); 
//		
	
});


app.put('/spots/:id', function(req,res){
    let name = req.body.name;
    let description = req.body.description;
    let species = req.body.species;
    console.log(req.body)
    	Spot.findOne({}, function(err, user){
    	user.spots.id(req.params.id).set({species: req.body.species})
    	user.save()	
    	res.json(user)
        
    });
    
        
        
});


app.get('/weather', (req, res) => {
		console.log('getting there')
	request(`https://api.darksky.net/forecast/${process.env.api}/${39.7392},${-104.9903}`, (req, res) =>{
		let weather = JSON.parse(res.body);
		console.log(weather.currently.temperature);
		
	});
	res.redirect("/allspots");
	
});

app.get('/location', (req, res) => {
	console.log('got it!')
	request(`https://maps.googleapis.com/maps/api/geocode/json?address=Kortes+Dam,+CA&key=${process.env.googs}`,(req, res) =>{
//			console.log(res.body.geometry)
		let geolocate = JSON.parse(res.body);
		console.log(geolocate.results[0].geometry.location.lat)
		console.log(geolocate.results[0].geometry.location.lng)
	})
})

app.get('/logout', (req, res) => {
	req.session.user = null;
	res.redirect('/')
})








app.set('port', process.env.PORT || 3001)

  app.listen(app.get('port'), () => {
    console.log(`✅ PORT: ${app.get('port')} 🌟`)
  })




// app.put('/spots/:id', function(req,res){
//     let name = req.body.name;
//     let description = req.body.description;
//     let species = req.body.species;
//     console.log(req.body)
//     Spot.findOneAndUpdate(
//         {_id: req.params.id}, 
//         {$set:{species: species}}, 
//         {new: true}, 
//         function (err, spots) {
//             if (err) {
//                 console.log(err, "Something wrong when updating data!");
//             } else {
//                 console.log('updated!' + req.body.species);
                
//                 res.render("index.ejs", {spots: spots});
//         }
//     })
// });  