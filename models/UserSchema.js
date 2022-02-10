const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    phoneNo: {
        type: String,
        required: true,
    },
    code: {
        type: Number,
        default : 'null'
    },
    verifyStatus: {
        type: Boolean,
        default : 'false'
    },
    name: {
        type: String,
        default : ''
    },
    email: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    profilePic : {
        type: String,
        default: ''
    },
    activeStatus: {
        type: Boolean,
        default : 'false'
    },
    blockedUsers: [{
        type: mongoose.Types.ObjectId,
        ref : 'halloousers'
    }],
    freinds: [{
        type: mongoose.Types.ObjectId,
        ref: 'halloousers'
    }],
}, {
    timestamps: true
});


const HallooUsers = mongoose.model('HallooUsers', UserSchema);

module.exports = HallooUsers