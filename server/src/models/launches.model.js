const launchModel = require('./launches.mongo')
const planets = require('./planets.mongo')
const DEFAULT_FLIGHT_NUMBER = 100
const axios = require('axios')

async function getAllLaunches(skip,limit) {
    return await launchModel.find({}, {
        '_id': 0, '__v': 0,
      })
      //skips over this many documents
      .skip(skip)
      .sort({flightNumber: 1
    //1 for ascending values and -1 for descending values
    })
      .limit(limit)
      //Above are mongodb features
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    })

    if(!planet) {
        throw new Error('No matching planet')
    }
    const newFlightNumber = await getLatestFlightNumber() + 1
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['zero to mastery', 'NASA'],
        flightNumber: newFlightNumber,
    });

    await saveLaunch(newLaunch)
}



const apiUrl = 'https://api.spacexdata.com/v5/launches/query'

async function populateLaunches() {
    const response = await axios.post(apiUrl, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
})
if(response.status !== 200) {
    console.log('Problem downloading data')
    throw Error('Launch data failed')
}
const launchDocs = response.data.docs;

for(const launchDoc of launchDocs) {
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload) => {
    return payload['customers']
})
    const launch = {
        flightNumber: launchDoc['flight_number'],
        mission: launchDoc['name'],
        rocket: launchDoc['rocket']['name'],
        launchDate: launchDoc['date_local'],
        upcoming: launchDoc['upcoming'],
        success: launchDoc['success'],
        customers,
    }
    
    await saveLaunch(launch)
}
}
async function loadLaunchesData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    })
    if(firstLaunch) {
        console.log('Already Loaded')
        return;
    } else {
      await populateLaunches();
    }
    console.log('Downloading Launch Data')
    
    
}

async function findLaunch(filter) {
    return await launchModel.findOne(filter)
}

async function existsLaunchWithId(launchId) {
    // We dont use findbyId because mongo is using its auto generated id while we are looking for our flight number
   return await findLaunch({
    flightNumber: launchId,
   });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchModel.
    //Returns first document if more then one is returned
    findOne({})
    //mongos sort method sorts in ascending order
    .sort('-flightNumber');

    if(!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }

    return latestLaunch.flightNumber
}

async function saveLaunch(launch) {
  
    await launchModel.findOneAndUpdate({
            //property to update
            flightNumber: launch.flightNumber,
            //add the data
        }, launch, 
        //options
        {
            upsert: true,
        })
} 

async function abortLaunchById(launchId) {
    return await launchModel.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false,
    })   
}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
    loadLaunchesData
}