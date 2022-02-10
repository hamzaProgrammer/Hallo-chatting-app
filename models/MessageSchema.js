const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: 'halloousers'
    },
    recieverId: {
        type: mongoose.Types.ObjectId,
        ref: 'halloousers'
    },
    msg: {
        type: String,
        default : ''
    },
    deleteForMe: {
        type: Boolean,
        default : 'false'
    },
    deleteForAll: {
        type: Boolean,
        default: 'false'
    },
}, {
    timestamps: true
});


const HallooChats = mongoose.model('HallooChats', ChatSchema);

module.exports = HallooChats