const Calls = require('../models/CallSchama')

// Add New Call
const addNewCallLogs = async (req, res) => {
    const {senderId  , recieverId , startedTime , endedTime , callType } = req.body
    if (!senderId || !recieverId || !startedTime || !endedTime || !callType) {
        return res.json({
            message: "**** Please Fill All Credientials. ***"
        })
    } else {
        try {
            // creating new call Log
            const newCallLog = new Calls({...req.body})
            const addedCallLog = await newCallLog.save();

            return res.json({
                addedCallLog,
                message: '*** Call Log Added SuccessFully ****',
            });
        } catch (error) {
            console.log("Error in addNewCallLogs and error is : ", error)
        }
    }

}

// get all Call Logs between any two users
const getAllCallLogsOfUser = async (req, res) => {
    const {senderId , recieverId } = req.body;
    try {
        const allCallLogs = await Calls.find({ $or : [{ senderId : senderId , recieverId : recieverId } , { senderId : recieverId , recieverId : senderId }] }).sort({createdAt : -1}).limit(50);
        if (!allCallLogs) {
            return res.json({
                message: '*** No Call Log Found Between These Users ****',
            });
        } else {
            return res.json({
                allCallLogs,
                message: '*** Got Result ****',
            });
        }
    } catch (error) {
        console.log("Error in getAllCallLogsOfUser and error is : ", error)
    }
}

// get all Call Logs of any single  user
const getAllCallLogsUser = async (req, res) => {
    const {senderId } = req.params;
    try {
        const allCallLogs = await Calls.find({ $or : [{senderId : senderId} , {recieverId : senderId}] }).sort({createdAt : -1}).limit(50);
        console.log("Calls : ", allCallLogs)
        if (!allCallLogs) {
            return res.json({
                message: '*** No Call Log Found . ****',
            });
        } else {
            return res.json({
                allCallLogs,
                message: '*** Got Result ****',
            });
        }
    } catch (error) {
        console.log("Error in getAllCallLogsUser and error is : ", error)
    }
}


module.exports = {
    addNewCallLogs,
    getAllCallLogsOfUser,
    getAllCallLogsUser,
}