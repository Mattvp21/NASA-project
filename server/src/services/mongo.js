const mongoose = require('mongoose');
require('dotenv').config();
const MONGO_URL = process.env.MONGO_URL

mongoose.connection.once('open', () => {
    console.log('Database Running')
})

mongoose.connection.on('error', (error) => {
    console.log(error)
})


async function mongoConnect() {
    await mongoose.connect(MONGO_URL)
}
//Remember to disconnect when running tests
async function mongoDisconnect() {
    await mongoose.disconnect();
}


module.exports = {
    mongoConnect,
    mongoDisconnect
}