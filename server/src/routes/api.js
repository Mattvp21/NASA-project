const planetsRouter = require('./planets/planets.router');
const launchRouter = require('./launch/launch.router')
const express = require('express')

const api = express.Router()

api.use('/planets', planetsRouter)
api.use('/launches', launchRouter)


module.exports = api