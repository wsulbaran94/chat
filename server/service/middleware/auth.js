require("dotenv").config();

const jwt = require("jsonwebtoken");
const { find } = require("../../controllers/User/UserController")

async function  validateToken (req, res, next) {
    const token =
    req.params.token || req.body.token || req.query.token || req.headers["x-access-token"];

    if (!token) return res.status(403).json({
        data:[false, 'Token not provider']
    })

    const decode = jwt.decode(token);

    if(!decode) return res.status(401).json({
        data:[false, 'invalid token']
    })

    const user = await find({_id: decode.id})
    
    if (!user) return res.status(401).json({
        data:[false, 'User not exists']
    })

    if (Date.now() >= decode.exp * 1000) {
        return res.status(401).json({
            data:[false, 'Expired session']
        })
    }
    req.user = {
        nickname: decode.user,
        _id: decode.id
    }
    next();
}

module.exports = {
    validateToken
}