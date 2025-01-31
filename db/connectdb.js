const mongoose = require('mongoose')

const connectdb = async (url) => {return mongoose.connect(url, console.log('Database connected'))}

module.exports = connectdb