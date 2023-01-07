const mongoose = require('mongoose')

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String, 
        required: true,
    },
    target: {
        //This is how you reference something from another schema
        // type: mongoose.ObjectId,
        // ref: 'Planet'
        type: String,
        
    },
    customers: [String],
    upcoming: {
        type: Boolean,
        required: true,
    },
    success: {
        type: Boolean,
        required: true,
        default: true
    }

})

//mongoose changes Lanch to launches
module.exports = mongoose.model('Launch', launchesSchema)