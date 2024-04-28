const mongoose = require('mongoose');

// Replace the database URL and name with your own

function connectDB(dbURI){

    mongoose.connect(dbURI)
    .then(() => console.log('Connected to database'))
    .catch((err) => console.log('Error connecting to database:', err));

}


module.exports = connectDB;