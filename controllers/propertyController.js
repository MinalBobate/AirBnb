const jwt = require('jsonwebtoken')
const mongoose=require("mongoose")
const Property = require('../model/properties')
const User = require('../model/users')

const registerProperty = async (req, res) => {
    try {
        let user;
        let userType;
        let cookieName = req.cookies.mycookiename;
        if (cookieName) {
            user = jwt.verify(cookieName, process.env.JWT_SECRET_KEY)
            userType = user.userType
        } else {
            res.redirect("/user/signIn");
        }

        if (userType == "guest") {
            let filterEmail = user.email
            //user.userType="host";
            //await
            await User.findOneAndUpdate({ email: filterEmail }, { userType: "host" })

        }



        res.render("registerProperty")
    } catch (error) {
        console.log("error", error);
        res.send(error);
    }
}



    const registerPropertyPost = async (req, res) => {
        try {

            const filepaths = [];
            req.files.forEach(file => {
                filepaths.push("/PropertyImages/" + file.filename)
            })
           

            let user;
            let email;
            let cookieName = req.cookies.mycookiename;
            if (cookieName) {
                user = jwt.verify(cookieName, process.env.JWT_SECRET_KEY)
                email = user.email
            }
            let property = new Property({

                propertyName: req.body.propertyName,
                propertyType: req.body.propertyType,
                owner: req.body.owner,
                city: req.body.city,
                state: req.body.state,
                country: req.body.country,
                price: req.body.price,
                area: req.body.area,
                bedrooms: req.body.bedrooms,
                beds: req.body.beds,
                maxGuests: req.body.maxGuests,

                gardenview: req.body.gardenview,
                beachAccess: req.body.beachaccess,
                wifi: req.body.wifi,
                parking: req.body.parking,
                pool: req.body.pool,
                mountainview: req.body.mountainview,
                kitchen: req.body.kitchen,
                tv: req.body.tv,
                petsAllowed: req.body.pets,
                airconditioning: req.body.ac,
                workspace: req.body.workspace,
                alarm: req.body.alarm,

                description: req.body.description,
                propertyImages: filepaths,
                email: email
            });
           
            await  property.save()
            
            //await property.save(function (err, success) {

            let redirectLink = "";
            let btnText = "Add other property";
            res.render("success", { redirectLink: redirectLink, btnText: btnText });

            //         let errorMessage = "Error registering property";
            //         let redirectLink = "propert/registerProperty";
            //         let btnText = "Try again";
            //     res.render("failure", { errorMessage: errorMessage, redirectLink: redirectLink, btnText: btnText });
            //   }
            // });

        } catch (error) {
            let errorMessage = "Error registering property";
            let redirectLink = "property/registerProperty";
            let btnText = "Try again";
            res.render("failure", { errorMessage: errorMessage, redirectLink: redirectLink, btnText: btnText });


        
        }

    }




    //get particular property
    const particularProperty = async (req, res) => {
        try {
           
            var requestedPropertyId = req.params.property_id;
            var requestedProperty;
            var hostEmail;
            let userNamedb={}
            let user;
            let result;

            let token = req.cookies.mycookiename;
            if (token) {
                user = await jwt.verify(token, process.env.JWT_SECRET_KEY)
              let result=  await User.findOne({ email: user.email })
                  
                if(result){userNamedb = result;}else{userNamedb={}}
                 
                    
                
            }


                console.log(requestedPropertyId);
           let property = await Property.findOne({ _id: requestedPropertyId})

            // if (!err) {
            hostEmail = property.email;
            console.log(hostEmail,'hostEmail');
       
            try {
                const resulthost =await User.findOne({ email: hostEmail })
                console.log('userNamedb',userNamedb);
                console.log('property',property);
                console.log('hostprofile',resulthost);
                res.render("particularProperty", { property: property, hostProfile: resulthost, user: userNamedb });

            } catch (err) {
                console.log(err);
            }

        } catch (error) {
            console.log(error);
            res.send(error);
        }
    }

    module.exports = {
        registerProperty, particularProperty, registerPropertyPost
    }
