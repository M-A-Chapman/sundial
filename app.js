const express = require('express');
const { get100Sunrises, getEarliest } = require('./sunrise');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    get100Sunrises()
        .then((sunrises) => {
            const earliestSunrise = getEarliest(sunrises);
            const response = { earliestSunrise, sunrises };
            res.status(200).send(response);
        }).catch((err) => {
            res.status(501).send(err);
        });
});

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening on port ${port}`);
});
