const User = require("../Model/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const zod = require('zod')

const signIn = async (req, res) => {
    const {email, password} = req.body;
    console.log(email, password)
    if([email, password].some((field) => field?.trim === "")) return res.status(400).json({message: "Please enter all the fields"});


    const userExist = await User.findOne({email});
    if(!userExist) return res.status(404).json({message: "User doesn't exists, please create an account!"})

    
    if(!(bcrypt.compare(password, userExist.password))){
        return res.status(404).json({message: "Incorrect password, please enter again"})
    }
    console.log(userExist   )
    const token = jwt.sign({userId: userExist._id}, process.env.JWT_SECRET)

    return res.status(200).json({token, message: "Customer logged in successfully!"})
    

}

const signUp = async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    if( [firstName, lastName, email, password].some((field) => field?.trim === "") ){
        return res.status(400).json({message: 'Please enter all the fields'})
    }
    const userExists = await User.findOne({email});
    console.log(userExists)
    if(userExists) return res.status(409).json({message: "User with this email already exists!"})
    
    const user = await User.create({
        firstName, lastName, email, password
    })

    const createdUser = await User.findById(user._id).select(
        "-password"
    )

    const token = jwt.sign({userId: createdUser._id}, process.env.JWT_SECRET)

    return res.status(200).json({token, message: "New account created successfully!"})
}

const updateBody = zod.object(
    {
        firstName: zod.string().optional(),
        lastName: zod.string().optional(),
        password: zod.string().optional()
        
    }
)

const updateData = async (req, res) => {

    const {success} = updateBody.safeParse(req.body);
    
    if(!success){
      return res.status(411).json({
            message: "An error occurred while updating information"
        })
    }
    await User.updateOne({ _id: req.userId }, req.body);

    return res.status(200).json({message: "Information updated successfully"})

}

const filterUsers = async (req, res) => {
    const filter = req.query.filter || ""

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.status(200).json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
}

module.exports = { signIn, signUp, updateData, filterUsers, updateData }