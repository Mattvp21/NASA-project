const {getAllLaunches,
        scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById} = require('../../models/launches.model');
const {getPagination} = require('../../services/query')

async function httpGetAllLaunches(req, res) {
const {skip, limit} = getPagination(req.query)
const launches = await getAllLaunches(skip, limit)
return res.status(200).json(launches)
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body;

    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        const {page, limit} = req.query;
        return res.status(400).json({
            error: "Invalid data"
        })
    }
    launch.launchDate = new Date(launch.launchDate);
    //Valid dates will always be converted to UNIX format which is a number so if its parsed wrong, it will return a 400
    if(isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid Date'
        })
    }
    await scheduleNewLaunch(launch)
    return res.status(201).json(launch)
}


async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id);
    const existsLaunch = await existsLaunchWithId(launchId)
    if(!existsLaunch) {
        return res.status(404).json({
            error: "Launch not found"
        });
    };
    
    const aborted = await abortLaunchById(launchId); 
    if(!aborted) {
        return res.status(400).json({
            error: "Launch not aborted",
        })
    }
    
    return res.status(200).json({
        ok: true
    })
}
module.exports = {
   httpGetAllLaunches,
   httpAddNewLaunch,
   httpAbortLaunch
}