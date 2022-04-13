const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require('../config/config')
const { create, find } = require("../controllers/User/UserController");
const { validateToken } = require("../service/middleware/auth");

router.post('/register', async (req, res) => {
    const { nickname, password } = req.body;

    if (!(nickname && password) || (nickname.length == 0 || password.length == 0)) {
        return res.status(400).json({
            data:[false,"All input is required"]
        });
    }
    const register = await create(req.body);

    if (register[0]) {
        res.status(200).json({
            data:register
        })
    } else {
        res.status(400).json({
            data:register
        })
    }
})

router.post('/login', async (req, res) => {
    const { nickname, password } = req.body;

    if (!(nickname && password) || (nickname.length == 0 || password.length == 0)) {
        return res.status(400).json({
            data:[false,"All input is required"]
        })
    }
    const filter = {
        nickname: req.body.nickname
    }
    const findUser = await find(filter);

    if (findUser) {
        if(!findUser.isPasswordValid(password)) {
            return res.status(400).json({
                data: [false, 'Nick or Password are incorrect']
            });
        }

        const token = jwt.sign(
            {
                user: findUser.nickname,
                id: findUser._id
            },
            JWT_SECRET,
            {
                expiresIn: "5m"
            }

        )

        findUser.token = token;
        
        const user = {
            nickname: findUser.nickname,
            token
        }

        return res.status(200).json({
            data: [true, user]
        })
    } else {
        return res.status(400).json({
            data: [false, 'Nickname or Password are incorrect']
        });
    }
})



router.get('/verify-token/:token', validateToken, (req, res) => {
    res.status(200).json({
        data:[true, 'validated token']
    })
})

module.exports = router;