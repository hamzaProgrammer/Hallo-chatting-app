const Messages = require('../models/MessageSchema')
const Users = require('../models/UserSchema')
var cloudinary = require('cloudinary').v2
let streamifier = require('streamifier');
cloudinary.config({
    cloud_name: process.env.cloudName,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});


// Add New Msg
const addNewMsg = async (req, res) => {
    const {senderId  , recieverId , msg } = req.body
    if (!senderId || !recieverId ) {
        return res.json({
            message: "**** Please Fill All Credientials. ***"
        })
    } else {
        try {
            // creating new Message
            // checking if user has sent any file or not
            if(req.files){
                if (req.files.msg) {
                    await cloudinary.uploader.upload(req.files.msg.tempFilePath, (err, res) => {
                        console.log("URL : ", res)
                        req.body.msg = res.url;
                    })
                //     let cld_upload_stream = cloudinary.uploader.upload_stream({
                //             folder: "foo"
                //         },
                //         function (error, result) {
                //             console.log(error, result);
                //         }
                //     );
                //     streamifier.createReadStream(req.files.msg.buffer).pipe(cld_upload_stream);
                 }
            }

            // chevking user has sent an empty msg or not
            if (req.body.msg === undefined){
                return res.json({
                    message: "**** Messaeg body is Empty. Please Write Any Message. ***"
                })
            }

            const newMsg = new Messages({...req.body})
            const addedMsg = await newMsg.save();

            await Users.findByIdAndUpdate(senderId , {$push : { freinds : recieverId }} , {new: true})

            return res.json({
                addedMsg,
                message: '*** Message Sent SuccessFully ****',
            });
        } catch (error) {
            console.log("Error in addNewMsg and error is : ", error)
        }
    }

}

// Send Msg to MAny
const sendMsgToMany = async (req, res) => {
    const {senderId  , recieverIds , msg } = req.body

    if (!senderId || !recieverIds) {
        return res.json({
            message: "**** Please Fill All Credientials. ***"
        })
    } else {
        try {
            let addedMsg;
            // creating new Message
            for(let i = 0; i != recieverIds.length; i++){
                // checking if user has sent any file or not
                if(req.files){
                    if (req.files.msg) {
                        await cloudinary.uploader.upload(req.files.msg.tempFilePath, (err, res) => {
                            req.body.msg = res.url;
                        })
                    }
                }
                // chevking user has sent an empty msg or not
                if (req.body.msg === undefined){
                    return res.json({
                        message: `**** Messag body is Empty. Please Write Any Message. ***`
                    })
                }

                const newMsg = new Messages({...req.body , senderId : senderId , recieverId : recieverIds[i]  })
                addedMsg = await newMsg.save();
                console.log("Res : ", addedMsg)
            }

            return res.json({
                addedMsg,
                message: `*** Message Sent to ${recieverIds.length} SuccessFully ****`,
            });
        } catch (error) {
            console.log("Error in sendMsgToMany and error is : ", error)
        }
    }

}

// recover all deleted msgs
const recoverAllDelMsgs = async (req, res) => {
    const {senderId , recieverId} = req.body
    if (!senderId || !recieverId) {
        return res.status(201).json({
            message: '*** Id is Required for Updation ****'
        })
    } else {
        const allDelForMeMsgs = await Messages.find({ $or : [{ senderId : senderId , recieverId : recieverId } , { senderId : recieverId , recieverId : senderId }] , deleteForMe : true })

        const allelForAllMsgs = await Messages.find({ $or : [{ senderId : senderId , recieverId : recieverId } , { senderId : recieverId , recieverId : senderId }] , deleteForAll : true })

        if (!allDelForMeMsgs && !allelForAllMsgs) {
            return res.status(201).json({
                message: '*** No Deleted Messages Available Between These Users ****'
            })
        } else {
            try {

                // recovering messages delete by user (i.e for me)
                allDelForMeMsgs.map(async (item) => {
                    item.deleteForMe = false;
                    await Messages.findByIdAndUpdate(item._id, { $set: item}, {new: true})
                })

                // recovering messages deleted for all (i.e for All)
                allDelForMeMsgs.map( async (item) => {
                    item.deleteForAll = false;
                    await Messages.findByIdAndUpdate(item._id, { $set: item}, {new: true})
                })

                res.status(201).json({
                    message: '*** All Deleted Messages Recoverd SuccessFully ***'
                })

            } catch (error) {
                console.log("Error in recoverAllDelMsgs  and error is : ", error)
                return res.status(201).json({
                    message: '!!! Opps An Error Occured !!!',
                    error
                })
            }
        }
    }
}

// delete msg for me
const deleteForMe = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const gotMsg = await Messages.findById(id)
        gotMsg.deleteForMe = true;
        const updatedMsg = await Messages.findByIdAndUpdate(id , {$set : gotMsg } , {new : true});
        if (!updatedMsg) {
            return res.json({
                message: '*** Opps! Message Could not Be Deleted ****',
            });
        } else {
            return res.json({
                updatedMsg,
                message: '*** Messages SuccessFully Deleted ****',
            });
        }
    } catch (error) {
        console.log("Error in deleteForMe and error is : ", error)
    }
}

// delete msg for All
const deleteForAll = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const gotMsg = await Messages.findById(id)
        gotMsg.deleteForAll = true;
        const updatedMsg = await Messages.findByIdAndUpdate(id , {$set : gotMsg } , {new : true});
        if (!updatedMsg) {
            return res.json({
                message: '*** Opps! Message Could not Be Deleted ****',
            });
        } else {
            return res.json({
                updatedMsg,
                message: '*** Messages SuccessFully Deleted For All ****',
            });
        }
    } catch (error) {
        console.log("Error in deleteForAll and error is : ", error)
    }
}

// get all Messages between any two users
const getAllMsgs = async (req, res) => {
    const {senderId , recieverId } = req.body;
    try {
        const allMsgs = await Messages.find({ $or : [{ senderId : senderId , recieverId : recieverId } , { senderId : recieverId , recieverId : senderId }] , deleteForMe : false , deleteForAll : false}).sort({createdAt : -1}).limit(100);
        if (!allMsgs) {
            return res.json({
                message: '*** No Chat Found Between These Users ****',
            });
        } else {
            return res.json({
                allMsgs,
                message: '*** Got Result ****',
            });
        }
    } catch (error) {
        console.log("Error in getAllMsgs and error is : ", error)
    }
}


module.exports = {
    addNewMsg,
    getAllMsgs,
    deleteForMe,
    deleteForAll,
    recoverAllDelMsgs,
    sendMsgToMany
    // checkCode,
    // updateUser,
    // ChangeStatus,
    // blockUser,
    // deleteUsers,
    // getAllUsers
}