const axios = require('axios');
const moment = require('moment');

function randomFloat(min, max, decimals) {
    return (Math.random() * (max - min + 1) + min).toFixed(decimals);
}

async function getSunData() {
    const latitude = randomFloat(-90, 90, 7);
    const longitude = randomFloat(-180, 180, 7);
    const { data } = await axios.get(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}`);
    const { results } = data;
    return { coordinates: { latitude, longitude }, times: { ...results } };
}

async function get100Sunrises(asyncLimit = 5, responses = 100) {
    const activeTasks = [];
    const sunrises = [];
    for (let i = 0; i < responses; i += 1) {
        if (activeTasks.length >= asyncLimit) {
            // eslint-disable-next-line no-await-in-loop
            await Promise.race(activeTasks);
        }
        const activeTask = getSunData()
            // eslint-disable-next-line no-loop-func
            .then((sunData) => {
                activeTasks.splice(activeTasks.indexOf(activeTask), 1);
                sunrises.push(sunData);
            })
            .catch(() => {
                activeTasks.splice(activeTasks.indexOf(activeTask), 1);
            });
        activeTasks.push(activeTask);
    }
    await Promise.all(activeTasks);
    return sunrises;
}

function getEarliest(sunrises) {
    // default to latest sunrise
    let earliestSunrise = '12:59:59 PM';
    let dayLength;

    sunrises.forEach((sunriseResponse) => {
        const { sunrise } = sunriseResponse.times;
        if (moment(sunrise, 'hh:mm:ss A').isBefore(moment(earliestSunrise, 'hh:mm:ss A'))) {
            earliestSunrise = sunrise;
            dayLength = sunriseResponse.times.day_length;
        }
    });
    return { earliestSunrise, dayLength };
}

module.exports = {
    get100Sunrises,
    getEarliest,
};
