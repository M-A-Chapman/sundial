const axios = require('axios');

async function randomFloat(min, max, decimals) {
    return (Math.random() * (max - min + 1) + min).toFixed(decimals);
}

async function getSunTimes() {
    const [latitude, longitude] = await Promise.all([
        randomFloat(-90, 90, 7),
        randomFloat(-180, 180, 7),
    ]);
    const { data } = await axios.get(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}`);
    const { results } = data;
    return { coordinates: { latitude, longitude }, times: { ...results } };
}

async function batchGet(limit = 5, responses = 10) {
    const activeTasks = [];
    const results = [];
    for (let i = 0; i < responses; i += 1) {
        if (activeTasks.length >= limit) {
            // eslint-disable-next-line no-await-in-loop
            await Promise.race(activeTasks);
        }
        const activeTask = getSunTimes()
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

function convertTime12to24(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes, seconds] = time.split(':');
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    seconds = parseInt(seconds, 10);
    if (hours === 12) {
        hours = 0;
    }
    if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }
    return [hours, minutes, seconds];
}

function getEarliest(data) {
    let earliestSunrise;
    let dayLength;
    let tempHours = 24;
    let tempMinutes = 60;
    let tempSeconds = 60;

    data.forEach((sunTime) => {
        let earlierTime = false;
        const [hours, minutes, seconds] = convertTime12to24(sunTime.times.sunrise);

        if (hours < tempHours) {
            earlierTime = true;
        } else if (hours === tempHours) {
            if (minutes < tempMinutes) {
                earlierTime = true;
            } else if (minutes === tempMinutes) {
                if (seconds < tempSeconds) {
                    earlierTime = true;
                }
            }
        }

        if (earlierTime) {
            earliestSunrise = sunTime.times.sunrise;
            dayLength = sunTime.times.day_length;
            tempHours = hours;
            tempMinutes = minutes;
            tempSeconds = seconds;
        }
    });

    return { earliestSunrise, dayLength };
}

module.exports = {
    batchGet,
    getEarliest,
};
