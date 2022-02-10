const express = require('express');
const router = express.Router();
const {
    addNewCallLogs,
    getAllCallLogsOfUser,
    getAllCallLogsUser,
} = require('../controllers/CallController')


// Send New Msg
router.post('/api/callLog/addNew', addNewCallLogs)

// getting call logs between two users
router.get('/api/callLog/callLogBtTwoUsers', getAllCallLogsOfUser);

// getting call logs of single user
router.get('/api/callLog/callLogOfUser/:senderId', getAllCallLogsUser);


module.exports = router;