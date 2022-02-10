const mongoose = require("mongoose");

const CallLogsSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: 'halloousers'
    },
    recieverId: {
        type: mongoose.Types.ObjectId,
        ref: 'halloousers'
    },
    startedTime: {
        type: Date,
        default: 'null'
    },
    endedTime: {
        type: Date,
        default: 'null'
    },
    callType: {
        type: String,
        enum : ["Video" , "Voice"]
    },
}, {
    timestamps: true
});


const HallooCallsLogs = mongoose.model('HallooCallsLogs', CallLogsSchema);

module.exports = HallooCallsLogs