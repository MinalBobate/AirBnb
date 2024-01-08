const mongoose = require("mongoose");

const Connection = async (URL) => {

 
    try {
        await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true});
        console.log('Database Connected Succesfully');
    } catch(error) {
        console.log('Error: ', error);
    }

};


module.exports = Connection;


