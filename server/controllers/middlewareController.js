const jwt= require("jsonwebtoken");
const user = require("../model/user");
const dotenv = require("dotenv");
dotenv.config();


const middlewareController = {

   createToken: (user) => {
        return jwt.sign({ _id: user._id, isAdmin: user.admin, role: user.role }, process.env.KEY_token, { expiresIn: process.env.TOKEN_EXPIRES_IN });
    },

    verifyToken:(req, res, next) => {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1]; // Bearer <token> nhớ dấu cách giữa Bearer và token .
            jwt.verify(accessToken, process.env.KEY_token, (err, user) => {
                if (err) {
                    return res.status(403).json("Token is not valid!");
                }
                req.user = user;
                next();
            });
        }
        else {
            return res.status(401).json("You are not authenticated!");
        }
    },
   
    verifyTokenAndAuthorization: (req, res, next) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user._id === req.body._id || (req.user.isAdmin && req.user.role === "admin")) {
                next();
            } else {
                return res.status(403).json("You are not allowed to do that!");
            }
        });
    },
    
    
 

}

module.exports = middlewareController;