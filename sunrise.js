const axios = require('axios');

function randomFloat(min, max, decimals) {
    return (Math.random() * (max - min + 1) + min).toFixed(decimals);
}

async function getSunTime() {
    const latitude = randomFloat(-90, 90, 7);
    const longitude = randomFloat(-180, 180, 7);
    const { data } = await axios.get(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}`);
    const { results } = data;
    return { coordinates: { latitude, longitude }, times: { ...results } };
}

async function getSunrises(limit = 5, responses = 10) {
    const activeTasks = [];
    const results = [];
    for (let i = 0; i < responses; i += 1) {
        if (activeTasks.length >= limit) {
            // eslint-disable-next-line no-await-in-loop
            await Promise.race(activeTasks);
        }
        const activeTask = getSunTime()
            // eslint-disable-next-line no-loop-func
            .then((response) => {
                activeTasks.splice(activeTasks.indexOf(activeTask), 1);
                results.push(response);
            })
            .catch(() => {
                activeTasks.splice(activeTasks.indexOf(activeTask), 1);
            });
        activeTasks.push(activeTask);
    }
    await Promise.all(activeTasks);
    return results;
}

function getEarliest(data) {
    let earliestSunrise;
    let dayLength;
    // default to 1 day in seconds
    let earliestTime = 86400;

    data.forEach((sunTimeResponse) => {
        const { sunrise } = sunTimeResponse.times;
        const [time, periodOfDay] = sunrise.split(' ');
        let [hours] = time.split(':');
        const [, minutes, seconds] = time.split(':');
        hours = parseInt(hours, 10) === 12 && periodOfDay === 'AM' ? 0 : parseInt(hours, 10);
        const timeFromPeriod = periodOfDay === 'PM' ? 43200 : 0;
        const timeInSeconds = parseInt(seconds, 10)
            + (parseInt(minutes, 10) * 60)
            + (hours * 3600)
            + timeFromPeriod;
        if (timeInSeconds < earliestTime) {
            earliestTime = timeInSeconds;
            earliestSunrise = sunrise;
            dayLength = sunTimeResponse.times.day_length;
        }
    });
    return { earliestSunrise, dayLength };
}

module.exports = {
    getSunrises,
    getEarliest,
};
