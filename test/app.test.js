const expect = require('chai').expect
const request = require('supertest')
const app = require('../app')


describe('GET /playstore', () => {
    it('GET request returns an array', () => {
        // test wasn't passing before because the API wasn't being called
        // test passed when we took out return because tests don't run without it.
        // in other words, without the return there, it was running an empty test that passed by default
        return request(app)
        .get('/playstore')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf.at.least(1);
            const app = res.body[0];
            expect(app).to.include.all.keys('App', 'Category', 'Rating', 'Reviews', 'Size', 'Installs', 'Type', 'Price', 'Content Rating', 'Genres', 'Last Updated', 'Current Ver', 'Android Ver');
        })
    })

    it('should be 400 if sort is incorrect', () => {
        return request(app)
        .get('/playstore')
        .query({sort: 'MISTAKE'})
        .expect(400, 'Must sort by rating or app title')
    })

    it('should sort by rating', () => {
        return request(app)
        .get('/playstore')
        .query({sort: 'Rating'})
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).to.be.an('array');
            let i = 0;
            let sorted = true;
            while (sorted && i > res.body.length - 1) {
                sorted = sorted && res.body[i].Rating > res.body[i + 1].Rating;
                i++;
            }
            expect(sorted).to.be.true;
        })
    })

    it('should sort by app title', () => {
        return request(app)
        .get('/playstore')
        .query({sort: 'App'})
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).to.be.an('array');
            let i = 0;
            let sorted = true;
            while (sorted && i > res.body.length - 1) {
                sorted = sorted && res.body[i].App > res.body[i + 1].App;
                i++;
            }
            expect(sorted).to.be.true;
        })
    })

    it('should be 400 if genre is incorrect', () => {
        return request(app)
        .get('/playstore')
        .query({genre: 'MISTAKE'})
        .expect(400, 'Genre not recognized')
    })

    it('should return only games with matching genre', () => {
        return request(app)
        .get('/playstore')
        .query({genre: 'Casual'} || {genre: 'Action'})
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).to.be.an('array');
            let i = 0;
            let matched = true;
            while (matched && i > res.body.length - 1) {
                matched = matched && res.body[i].Genres === 'Casual' || 'Action';
                i++;
            }
            expect(matched).to.be.true;
        })
    })
})