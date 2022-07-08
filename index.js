const express = require('express');
const pa11y = require('pa11y');
const PORT = process.env.PORT || 5002;

const app = express();

app.use(express.static('public'));

app.get('/api/test-site', async (req, res) => { 
    if(!req.query.url) {
        res.status(400).send('No url provided. URL required. Please provide a URL.');
    }
    const results = await pa11y(req.query.url);
    res.status(200).send(results);
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

