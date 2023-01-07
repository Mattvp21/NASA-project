const request = require('supertest');
const app = require('../../app');
const {mongoConnect, mongoDisconnect} = require('../../services/mongo')

//BE CAREFUL HOW YOU RUN YOUR TESTS BECAUSE THEY COULD BE INTEGRATION TESTS WHICH CAN MANIPULATE YOUR ACUAL DATA
//You should use a separate test database for this

describe('Launches API', () => {
//This ryns with a nested test and beforeall happens to set up the other tests
    beforeAll(async () => {
   await mongoConnect()
})
//This ryns with a nested test and beforeall happens after running all the tests
afterAll(async () => {
    await mongoDisconnect()
})

    //GET request testing example
describe('Test GET /launches', () => {
    test('It should return 200 status code', async () => {
        const response = await request(app)
        .get('/v1/launches')
        .expect('Content-Type', /json/)
        .expect(200);
    });
});

//POST request testing example
describe('Test POST /launches', ()=> {
    const completeLaunchDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-62 f',
        launchDate: 'January 4, 2028',
    };

    const launchDataWithoutDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-62 f',
    };

    const launchDataWithInvalidDate = {
        mission: 'USS Enterprise',
        rocket: 'NCC 1701-D',
        target: 'Kepler-62 f',
        launchDate: 'January 40, 2028',
    }

    test('Its should respond with 201 created', async () => {
        const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchDate)
        .expect('Content-Type', /json/)
        .expect(201);

        const requestDate = new Date(completeLaunchDate.launchDate).valueOf(); 
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(requestDate).toBe(responseDate);
        expect(response.body).toMatchObject(launchDataWithoutDate);
    })

    test('It should catch errors', async () => {
        const response = await request(app)
            .post('/v1/launches')
            .send(launchDataWithoutDate)
            .expect('Content-Type', /json/)
            .expect(400);
            
            expect(response.body).toStrictEqual({
                error: "Invalid data"
            });
    });

    test('It should reject invalid dates', async () => {
        const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);

        expect(response.body).toStrictEqual({
            error: 'Invalid Date'
        })
    })
})
})


