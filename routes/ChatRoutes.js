const express = require('express');
const router = express.Router();
const {
    addNewMsg,
    getAllMsgs,
    deleteForMe,
    deleteForAll,
    recoverAllDelMsgs,
    sendMsgToMany,
} = require('../controllers/ChatController')
const multer = require("multer")
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './myFiles')
    },
    filename: function (req, file, cb) {
        cb(null, 'image-' + Date.now() + file.originalname)
    }
})
const upload = multer({
    storage: storage,
});


// Send New Msg
router.post('/api/chat/addNew', addNewMsg)

// Msg delete For Me
router.put('/api/chat/deleteForMe/:id', deleteForMe);

// Msg delete For All
router.put('/api/chat/deleteForAll/:id', deleteForAll);

// Recover Deleted Messages between any two users
router.put('/api/chat/recoverDelMsgs', recoverAllDelMsgs);

// Send Msg to Many
router.post('/api/chat/sendToMany', sendMsgToMany)

// get all chat between any two users
router.get('/api/chat/getAllBtTwoUsers', getAllMsgs)


module.exports = router;