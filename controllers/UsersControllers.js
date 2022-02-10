const Users = require('../models/UserSchema')
const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const mongoose = require("mongoose")
const client = require("twilio")(process.env.twilloAcctSid, process.env.twilloSecKey);
var cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.cloudName,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});


// Logging In
const LogInUsers = async (req, res) => {
    const {
        phoneNo
    } = req.body
    if (!phoneNo) {
        return res.json({
            mesage: "**** Please Provide Your Phone No ***"
        })
    } else {
        try {
            const isUsersExists = await Users.findOne({
                phoneNo: phoneNo
            });

            if (!isUsersExists) {
                let myCode = Math.floor(1000 + Math.random() * 9000);
                client.messages.create({
                    body: `Halloo App. Your Secret Code is ${myCode}. Thanks.`,
                    from: '+16066033382',
                    to: phoneNo
                })

                // craeting new user
                const newUsers = new Users({
                    phoneNo: phoneNo,
                    code: myCode
                })
                const addedUsers = await newUsers.save();

                return res.json({
                    addedUsers,
                    message: "*** You are not a registered user of this app. We have sent a code to your phone. Please verify that code and Start Using this App. Thanks. ***"
                })
            }

            const token = jwt.sign({
                id: isUsersExists._id
            }, JWT_SECRET_KEY, {
                expiresIn: '24h'
            }); // gentating token

            return res.json({
                myResult: isUsersExists,
                message: '*** Users Signed In SuccessFully ****',
                token
            });
        } catch (error) {
            console.log("Error in LogInUsers and error is : ", error)
        }
    }

}

// Check Code
const checkCode = async (req, res) => {
    const {id} = req.params
    const {code} = req.body;

    if (!id || !code) {
        return res.status(201).json({
            message: '*** Id and Code are Required. ****'
        })
    } else {
        const isExist = await Users.findOne({_id : id} , {code : code})
        console.log("User : ", isExist)
        if (!isExist) {
            return res.status(201).json({
                message: '*** Users Id or Secret Code may be Incorrect. ****'
            })
        } else {
            try {
                if (req.body.code) {
                    req.body.verifyStatus = true;
                }
                const updatedUser = await Users.findByIdAndUpdate(id, {
                    $set: req.body
                }, {
                    new: true
                })
                res.status(201).json({
                    updatedUser,
                    message: '*** Users Updated SuccessFully ***'
                })

            } catch (error) {
                console.log("Error in updateUser and error is : ", error)
                return res.status(201).json({
                    message: '!!! Opps An Error Occured !!!',
                    error
                })
            }
        }
    }
}

// update Users
const updateUser = async (req, res) => {
    const {
        id
    } = req.params
    if (!id) {
        return res.status(201).json({
            message: '*** Id is Required for Updation ****'
        })
    } else {
        const isExist = await Users.findById(id)
        if (!isExist) {
            return res.status(201).json({
                message: '*** Users Id is Incorrect ****'
            })
        } else {
            try {
                if(req.files){
                    if (req.files.profilePic) {
                        await cloudinary.uploader.upload(req.files.profilePic.tempFilePath, (err, res) => {
                            req.body.profilePic = res.url;
                        })
                    }
                }
                const updatedUser = await Users.findByIdAndUpdate(id, {
                    $set: req.body
                }, {
                    new: true
                })
                res.status(201).json({
                    updatedUser,
                    message: '*** Users Updated SuccessFully ***'
                })

            } catch (error) {
                console.log("Error in updateUsers and error is : ", error)
                return res.status(201).json({
                    message: '!!! Opps An Error Occured !!!',
                    error
                })
            }
        }
    }
}

// change Active Status Users
const ChangeStatus= async (req, res) => {
    const {
        id
    } = req.params
    if (!id) {
        return res.status(201).json({
            message: '*** Id is Required for Updation ****'
        })
    } else {
        const isExist = await Users.findById(id)
        if (!isExist) {
            return res.status(201).json({
                message: '*** Users Id is Incorrect ****'
            })
        } else {
            try {
               if (isExist.activeStatus === false){
                    isExist.activeStatus = true;
               }else{
                   isExist.activeStatus = false;
               }
                const updatedUser = await Users.findByIdAndUpdate(id, {
                    $set: isExist
                }, {
                    new: true
                })
                res.status(201).json({
                    updatedUser,
                    message: '*** Users Updated SuccessFully ***'
                })

            } catch (error) {
                console.log("Error in ChangeStatus and error is : ", error)
                return res.status(201).json({
                    message: '!!! Opps An Error Occured !!!',
                    error
                })
            }
        }
    }
}

// Block Any User
const blockUser = async (req, res) => {
    const {
        id
    } = req.params
    const { blockUserId } = req.body
    if (!id) {
        return res.status(201).json({
            message: '*** Id is Required for Updation ****'
        })
    } else {
        const isExist = await Users.findById(id)
        if (!isExist) {
            return res.status(201).json({
                message: '*** Users Id is Incorrect ****'
            })
        } else {
            try {
                const updatedUser = await Users.findByIdAndUpdate(id, {$push : { blockedUsers : blockUserId } }, {new: true})

                res.status(201).json({
                    updatedUser,
                    message: '*** User Added to Block List SuccessFully ***'
                })

            } catch (error) {
                console.log("Error in blockUser  and error is : ", error)
                return res.status(201).json({
                    message: '!!! Opps An Error Occured !!!',
                    error
                })
            }
        }
    }
}

// delete my account
const deleteUsers = async (req, res) => {
    const {
        id
    } = req.params;
    try {
        const deletedUsers = await Users.findByIdAndDelete(id);
        if (!deletedUsers) {
            return res.json({
                message: '*** Users Account Not Found ****',
            });
        } else {
            return res.json({
                deletedUsers,
                message: '*** Users Account SuccessFully Deleted ****',
            });
        }
    } catch (error) {
        console.log("Error in deleteUsers and error is : ", error)
    }
}

// get all Users friends
const getFreinds = async (req, res) => {
    const {id} = req.params;
    try {
        const allUsers = await Users.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup:
            {
                from: 'halloousers',
                localField: 'friends',
                foreignField: '_id',
                as: 'Friends'
            },
        },
    ]);
        if (!allUsers) {
            return res.json({
                message: '*** No Users or Cutsomer Found ****',
            });
        } else {
            return res.json({
                allUsers,
                message: '*** Got Result ****',
            });
        }
    } catch (error) {
        console.log("Error in getFreinds and error is : ", error)
    }
}


module.exports = {
    LogInUsers,
    checkCode,
    updateUser,
    ChangeStatus,
    blockUser,
    // deleteUsers,
    getFreinds
}