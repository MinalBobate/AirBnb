const ejs = require('ejs')
const express = require('express')
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const multer = require("multer")
const jwt = require('jsonwebtoken');
const cookieParser=require("cookie-parser")
const mongoose=require("mongoose")

const Connection = require('./connection')

//model
const Property = require('./model/properties')
const User = require('./model/users')
const Booking = require('./model/bookings')
const Reiview = require('./model/reviews')
const Help=require('./model/help')
//routes
const userRoute = require("./routes/userRoute");
const propertyRoute = require("./routes/propertyRoute");
const bookingRoute = require("./routes/bookingRoute");
const reviewRoute = require("./routes/reviewRoute");
const adminRoute=require("./controllers/adminController")


//middlewares
app.use(express.static('public'));
app.use(express.json());//required for post request
app.use(express.urlencoded({ extended: false }));//for form data
app.use(cookieParser())
app.use("/ProfileImages", express.static(__dirname+"/ProfileImages"))
app.use("/PropertyImages", express.static(__dirname+"/PropertyImages"))

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'))
dotenv.config();


app.get("/", async function (req, res) {
    try {
       let user
        let  userNamedb
        let isHost;
        let token = req.cookies.mycookiename;
        if(token){
           
             user = jwt.verify(token, process.env.JWT_SECRET_KEY);
             userNamedb = await User.findOne({ email: user.email });     
            
            if(userNamedb.userType=="host"){
              isHost=true;
            }else{
              isHost=false;
            }
        }else{ 
            userNamedb=false;
        } 
      
    console.log()
       let result=await Property.find({})
       res.render("home",{properties:result,LoggedUser:userNamedb, isHost:isHost        
        })
    } catch (error) {
        let errorMessage = "Error fetching properties";
        let redirectLink = "";
        let btnText = "Try again";
        res.render("failure", { errorMessage: errorMessage, redirectLink: redirectLink, btnText: btnText });
    }
})

app.get('/siteinstructions',async function(req,res){
   res.render("siteinstructions") 
})
app.get('/help',async function(req,res){
    res.render("help") 
 })
app.post("/help", function (req, res) {
    console.log(req.body);
    try {
    
        let supportQuery = new Help({
            name: req.body.name,
            email: req.body.email,
            contact: req.body.contact,
            help: req.body.comment
        })
        supportQuery.save();
        let redirectLink = "help";
        let btnText = "Go to help";
        res.render("success", { redirectLink: redirectLink, btnText: btnText });
    } catch (error) {
        let errorMessage = "There was an error";
        let redirectLink = "help";
        let btnText = "Try again";
        res.render("failure", { errorMessage: errorMessage, redirectLink: redirectLink, btnText: btnText });
    }
})




app.use("/user", userRoute);
app.use("/property", propertyRoute);

app.use("/booking", bookingRoute);
app.use("/review", reviewRoute);
app.use('/admin',adminRoute)

const USERNAME=process.env.DB_USERNAME;
const PASSWORD=process.env.DB_PASSWORD;
const PORT = process.env.PORT || 8000;  
const URL = process.env.MONGODB_URI || `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.jqsljhc.mongodb.net/?retryWrites=true&w=majority`
// ${USERNAME}:${PASSWORD}

Connection(URL);

app.listen(process.env.PORT, () => { console.log("server started at 8000") })

//???  app.listen(process.env.PORT,()=>{console.log(`server started at ${PORT}`);})   ????why error


