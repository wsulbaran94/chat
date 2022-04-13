const mongoose = require('mongoose');


const chatModelSchema = new mongoose.Schema({
    room: { type: String, required: true, unique: true },
    nickNames: { type: [''], default:['']},
    history: { type: [
        {
            username: String, 
            message: String, 
            img: String,
            time: String 
        }
    ], default:[]},
    createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Chat', chatModelSchema);