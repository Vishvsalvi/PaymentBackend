const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {

    const authHeader = req.headers.authorization;
    console.log(authHeader)

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({message: "User unauthorized!"});
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        
        if(decoded){
            req.userId = decoded.userId
            next()
        }
        res.status(404).json({message: "The token is not found or invalid!"})



    } catch (error) {
        return res.status(403).json({error});
    }

}

module.exports = {
    authMiddleware
}