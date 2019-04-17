const expect = require('chai').expect
const request = require('supertest')
const app = require('../app')


describe('GET /playstore', () => {
    it('GET request returns an array', () => {
        request(app)
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
        request(app)
        .get('/playstore')
        .query({sort: 'MISTAKE'})
        .expect(400, 'Must sort by rating or app title')
    })

    it('should sort by rating', () => {
        request(app)
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
        request(app)
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
        request(app)
        .get('/playstore')
        .query({genre: 'MISTAKE'})
        .expect(400, 'Genre not recognized')
    })

    it('should return only games with matching genre', () => {
        request(app)
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