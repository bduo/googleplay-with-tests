const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common')); 

const apps = require('./playstore.js');

app.get('/apps', (req, res) => {
    const { search='', sort='', genres='' } = req.query;
    
    let results = apps.filter(app => app['App'].toLowerCase().includes(search.toLowerCase()));

    if(sort) {
        if(!['Rating', 'App'].includes(sort)) {
            return res
                .status(400)
                .send('Must sort by rating or app title')
        }

        results.sort((a, b) => {
            return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        });

        res.status(200).send(results);
    }

    if(genres) {
        let gameGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];

        if(!gameGenres.includes(genres)) {
            return res
                .status(400)
                .send('Genre not recognized')
        }

        const matchGenres = gameGenres.filter(term => term === genres);

        // iterate over objects in playstore
        let newResults = results.filter(game => {
            // look at each "Genres" key in playstore objects
            // if "Genres" value has more than one genre/term, split into array
            let genreValues = game.Genres.split(';');
            let multipleGenres;

            if(genreValues.length > 1) {
                // check if multi-genre array includes term in matchGenres
                multipleGenres = genreValues[1].split(' ');
            }

            if(multipleGenres) {                
                return (multipleGenres.find(genre => genre === matchGenres[0]) === matchGenres[0]);
            }

            // check to see if "Genres" value includes the term in matchGenres
            return genreValues[0] === matchGenres[0];
        });
        res.status(200).send(newResults);
    }

})

app.listen(8000, () => {
    console.log('Express server is listneing on port 8000 mofo!')
})