const express = require('express');
const router = express.Router();
const {
    LogInUsers,
    checkCode,
    updateUser,
    ChangeStatus,
    blockUser,
    getFreinds,
    // deleteAdmin
} = require('../controllers/UsersControllers')


// Sign In Admin
router.post('/api/user/signin', LogInUsers)

// Checking Code
router.put('/api/user/checkCode/:id', checkCode);

// updating User Account
router.put('/api/user/updateUser/:id', updateUser);

// Change User Status
router.put('/api/user/changeStatus/:id', ChangeStatus);

// Block Users
router.put('/api/user/blockUser/:id', blockUser);

// get my Freinds
router.get('/api/user/myFreinds/:id', getFreinds);



// // Delete Admin
// router.delete('/api/admin/deleteAdmin/:id', deleteAdmin)

// // get all admins
// // router.post('/api/cutomer/checkEmailExists', sendMail)


module.exports = router;