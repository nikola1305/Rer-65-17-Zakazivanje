
const express= require ('express')
var session = require('express-session');
const MongoClient = require('mongodb');
const mongoose=require('mongoose')
var path = require('path');
var cookieParser = require('cookie-parser');


var debug = require('debug')('app.js');
var expressValidator= require('express-validator')
var bodyParser = require('body-parser')
var createError = require('http-errors');

const users = []
const app= express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public') )
app.set('view-engine', 'ejs')
app.use(express.urlencoded({extended: false }))




var E=" " ;
var I=" ";
var P=" "; 
mongoose.connect('mongodb://localhost:27017/zakazivanje', {useNewUrlParser: true,useUnifiedTopology: true});

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log(' Baza povezana!')
});

var korisnikSchema = new mongoose.Schema({
    Ime:{
        type:String,
        required:true
        },
	Prezime:{
        type:String,
        required:true
        },
		
	Email:{
        type:String,
        required:true
        },
    Sifra:{
            type:String,
            required:true
            }
  });
  
var korisnikM = mongoose.model('korisnikM', korisnikSchema);//model korisnika
// Sema zakazivanja

var zakazanoSchema= new mongoose.Schema({
	Ime: {type:String ,
	required:true},
	Prezime:{type:String,
	required:true},
	Email: {type:String,
	reqired:true},
	Lekar: {type:String,
		  required:true},
	Datum:{type:Date
          }
});
var zakazanoM=mongoose.model('zakazanoM',zakazanoSchema) //model zakazano


app.get('/', (req, res) =>{
	
	res.render('pocetna.ejs')
	
})
app.get('/login', (req, res) => {
     res.render('login.ejs')
	
})
app.get('/registracija', (req, res) => {
    res.render('registracija.ejs')
})
app.get('/pocetna', (req, res) =>{
	korisnikM.find({Email:E},function(err,docs){
		if(err) {console.log("Greskaaaaaaaa")}
			else {
				res.render('login.ejs',{ detalji: docs} ) 
				
			
			}
	})
    
    })
    
app.get('/korisnik', (req, res) =>{
        res.render('korisnik.ejs')
       })
app.get('/pregled', (req, res) =>{
	zakazanoM.find({Email:E}, function (err, allDetails) {
    if (err) {
        console.log(err);
    } else {
		
       res.render('pregled.ejs', { details: allDetails })
	   
    }
	})
	
	

})
    
 

 app.post('/registracija',(req, res)=>{
	var korisnik = new korisnikM(
	 {
		 
    Ime:req.body.ime ,
	 Prezime:req.body.prezime ,
	 Email:req.body.email ,
    Sifra:req.body.sifra 
	
	
	});
	
	korisnik.save();
	
	console.log('Novi korisnik je kreiran:')
	console.log(korisnik)
	res.redirect('/');
 });
 
 app.post('/login',(req,res,next)=>{
	 emailR=req.body.email;
	sifraR=req.body.sifra;
	E=emailR;
	korisnikM.findOne({Email:emailR},(err,docs)=>{
		
		if(docs!=null){
if(docs.Sifra==sifraR){
	I=docs.Ime
	P=docs.Prezime
	console.log(I)
	console.log(P)
res.redirect('/korisnik')
console.log("Nova konekcija na sajtu")
console.log(E)
}
  else{
    res.redirect('/login')
	console.log('Uneta je pogresna sifra')
  }
}else{
  res.redirect('/registracija')
}
	})
	
 })
 
 app.post('/korisnik',(req,res)=>{

var zakazani=new zakazanoM ({
	Ime:I,
	Prezime:P,
    Email:E,
	Lekar:req.body.doktor,
	
	Datum:req.body.datum})
	
zakazani.save()
console.log("Zakazan je novi pregled od strane korisnika:")
console.log(I,P)
res.redirect('/pregled')
	 
 })

 module.exports=({'zakazivanje':korisnikM})

 

app.listen(3000)