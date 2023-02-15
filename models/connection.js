const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const connectionString= 'mongodb+srv://admind:Atlas06300@cluster0.qvgylsz.mongodb.net/hackaTweet'

mongoose.connect(connectionString, {connectTimeoutMS: 2000})
.then(console.log('Database connected'))
.catch(error => console.error(error));