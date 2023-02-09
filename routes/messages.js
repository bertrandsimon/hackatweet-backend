var express = require('express');
var router = express.Router();
const User = require('../models/users')
const { checkBody } = require('../modules/checkBody');
const Message = require('../models/messages')
const {deleteMessage} = require('../modules/deleteMessage')

router.post('/addMessage/:token', (req, res) => {
    if (!checkBody(req.body, ['message'])) {
        res.json({ result: false, error: 'Missing or empty fields' });
        return;
    }
        User.findOne({ token: req.params.token }). then( data => {
            if(data !== null){
                console.log(data)
                const newMessage= new Message({
                    user: data._id,
                    content: req.body.message,
                    date: new Date,
                })

                newMessage.save()
                .then(data => {
                    Message.findOne({_id: data._id})
                    .populate('user')
                    .then(data => {
                        console.log(data)
                        res.json({result:true, message: data.content, username: data.user.username , firstName: data.user.firstname, date: data.date, messageId: data._id,})
                    })
                })
            } else {
                res.json({result: false, error: 'You are not connected'})
            }
        })
        

})

router.get('/allMessages', (req, res) =>{
    Message.find()
    .populate('user')
    .then(data => {
        console.log(data.length)
        let message = []
            for (let i=0; i<data.length; i++){

                
                message.push({
                    username: data[i].user.username,
                    firstname: data[i].user.firstname,
                    content: data[i].content,
                    date: data[i].date,
                    messageId: data[i]._id,
                
                })
            }
        res.json({allMessages: message })
    })
})

router.delete('/deleteMessage/:messageId', (req, res) => {
        Message.deleteOne({ _id: req.params.messageId }).then( data => {
            console.log(typeof data.deletedCount)
            if(data.deletedCount === 1){
                res.json({result: true, text: 'message deleted'})
            } else {
                res.json({result: false, error : 'an error was accured'})
            }
            // }data.deletedCount = '1'
        })
})
module.exports = router;