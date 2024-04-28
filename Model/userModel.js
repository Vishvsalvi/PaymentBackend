const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Kindly enter your first name"],
        lowercase: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Kindly enter your last name"],
        lowercase: true,
        trim: true,
    },
    email: {
        type:String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type:String,
        required: [true, "Please enter a password"],
        lowercase: true,
        trim: true,

    }
})


userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10 )
})

// Inserting a new method for the model
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password)
 }

module.exports = mongoose.model("userSchema", userSchema)