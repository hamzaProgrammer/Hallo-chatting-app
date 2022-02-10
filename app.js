const express = require('express')
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
// const server = require('http').createServer();
// const io = require('socket.io')(server);
// const {addNewMsg} = require("./controllers/ChatController");
dotenv.config({
    path: './config.env'
})
const fileupload = require("express-fileupload")
require('./db/Conn')
var port = process.env.PORT || 8080;

app.use(bodyParser.json({
    limit: '30mb',
    extended: true
}))
app.use(bodyParser.urlencoded({
    limit: '30mb',
    extended: true
}))
app.use(cors())

app.use(fileupload({
    useTempFiles: true
}))


// // storing message using socket.io
// io.on('connection', (socket) => {
//   socket.on('sendMsg', async (data) => {
//         console.log("Data : ", data)
//         let res = await addNewMsg(data)
//         console.log("Res : ", res)
//    });
// });



app.use(express.json())

// adding routes
app.use(require('./routes/UsersRoutes'))
app.use(require('./routes/ChatRoutes'))
app.use(require('./routes/CallsRoutes'))
// app.use(require('./routes/OperatorRoutes'))
// app.use(require('./routes/MemberRoutes'))
// app.use(require('./routes/SubscriptionRoutes'))
// app.use(require('./routes/CollectionRoutes'))





app.listen(process.env.PORT || 8080, (req, res) => {
    console.log(`Express Server Running at ${port}`)
})