const express = require('express')
const {httpGetAllLaunches,
httpAddNewLaunch,
httpAbortLaunch} = require('./launch.controllers')

const launchesRouter = express.Router()
//The '/' matches the root of the router
launchesRouter.get('/', httpGetAllLaunches)
launchesRouter.post('/', httpAddNewLaunch)
launchesRouter.delete('/:id', httpAbortLaunch)

module.exports = launchesRouter