const express = require("express");
const router = express.Router();

const { getRoom } = require('../controllers/Chat/ChatController')

router.get('/history/:room', async (req, res) => {
    const room = req.params.room
    const find = await getRoom(room);

    res.status(200).json(find)
})




module.exports = router;