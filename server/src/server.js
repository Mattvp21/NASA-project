const http = require('http');
require('dotenv').config();
const mongoose = require('mongoose')
const app = require('./app')
const {loadPlanetsData} = require('./models/planets.model')
const {loadLaunchesData} = require('./models/launches.model')
const PORT = process.env.PORT || 8000;
const {mongoConnect} = require('./services/mongo')


const server = http.createServer(app);



async function startServer() {
    await  mongoConnect() //mongo starts then
    await loadPlanetsData() // planets data get loaded then it listens below
    await loadLaunchesData()
    server.listen(PORT, () => {
        console.log('server running')
    })
}

startServer()