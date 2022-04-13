const Chat  = require("../../model/Chat");





async function getRoom (room) {
    const findRoom =  await Chat.findOne({room})

    return findRoom;
}

async function saveHistory (history) {
    const findRoom = await getRoom(history.room);
    const historyData = {
        username: history.username, 
        message: (history.message && history.message.length > 0)? history.message:'',
        img: (history.img && history.img.length > 0)? history.img:'',
        time: history.time.toString()
    }

    findRoom.history.push(historyData);

    return Chat.updateOne({_id:findRoom._id}, findRoom);
}

async function saveRoom (data) {
    const findRoom =  await getRoom(data.room);
    if(!findRoom) {
        const createRoom = {
            room: data.room,
            nickNames: []
        }
        createRoom.nickNames.push(data.username)

        return  Chat.create(createRoom);
    }

    if (findRoom.nickNames.filter(nickname => nickname == data.username).length <= 0) {
        findRoom.nickNames.push(data.username);
        return Chat.updateOne({_id: findRoom._id}, findRoom)
    }
}

module.exports = {
    saveRoom,
    saveHistory,
    getRoom
}