const express = require("express");
const router = express.Router();
const { signIn, signUp, updateData, filterUsers } = require("../controllers/userControllers")
const {authMiddleware} = require("../middleware/authMiddleware")


router.route("/signup").post(signUp)
router.route("/signin").post(signIn)
router.route("/update").put(authMiddleware,updateData)
router.route("/bulk").get(filterUsers)


module.exports = router