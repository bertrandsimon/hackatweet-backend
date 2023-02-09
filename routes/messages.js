var express = require('express');
var router = express.Router();
const User = require('../models/users')
const { checkBody } = require('../modules/checkBody');
const Message = require('../models/messages')

router.post('/addMessage/:token', (req, res) => {
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
                    res.json({result:true, message: data.content, username: data.user.username , firstName: data.user.firstname, date: data.date})
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
                
                })
            }
        res.json({allMessages: message })
    })
})
//, username: data.user.username , firstName: data.user.firstname
module.exports = router;