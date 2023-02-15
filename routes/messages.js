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
    .sort({ date: 'desc' }) // Sort by date in descending order
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
  Message.deleteOne({ _id: req.params.messageId })
    .then(data => {
      if (data.deletedCount === 1) {
        res.json({ result: true, text: 'Message deleted' });
      } else {
        res.status(404).json({ result: false, error: 'Message not found' });
      }
    })
    .catch(error => {
      console.error(`Error deleting message with ID ${req.params.messageId}:`, error);
      res.status(500).json({ result: false, error: 'Server error' });
    });
});

module.exports = router;