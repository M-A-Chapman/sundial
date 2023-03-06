const express = require('express');
const { getSunrises, getEarliest } = require('./sunrise');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    getSunrises(5, 100)
        .then((responses) => {
            const earliestSunrise = getEarliest(responses);
            const response = { earliestSunrise, responses };
            res.status(200).send(response);
        }).catch((err) => {
            res.status(501).send(err);
        });
});

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening on port ${port}`);
});
