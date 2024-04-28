require('dotenv').config();
const port = process.env.PORT || 5000
const express = require("express");
const connectDB = require("./db/connectDb");
const router = require("./routes/index")

const app = express()

app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.json())

app.use("/api/v1",router)


// connectDB
const start = async () => {
    try {
         connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`Server is listening on ${port}`))
    } catch (error) {
        console.log(error)
    }
}

start()