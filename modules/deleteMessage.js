const Message = require('../models/messages')
const mongoose= require('mongoose')

function deleteMessage(messageId) {
    Message.deletedOne({ _id: messageId }). then( data => {
        console.log(data)
        if(data === null){
            res.json({result: true, text: 'message deleted'})
        } else {
            res.json({result: false, error : 'an error was accured'})
        }
        // }
    })
}
module.exports = { deleteMessage };