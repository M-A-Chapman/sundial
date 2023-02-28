const axios = require('axios');

// all under limit of 5 async at a time
// get 2 random coords
async function getRandomCoord(min, max, decimals){
    return (Math.random() * (max - min+1) + min).toFixed(decimals)
}
// get sunrise and sunset at coords
// add to SQL {record#, coords, sunrise, sunset}
// check if sunrise is earlier than previous
//      if earlier -> temp store sunrise and sunset time

// return
// calculate day length

async function getSunrises() {
    [
        latitude, 
        longitude
    ] = await Promise.all([
        getRandomCoord(-90,90,7),
        getRandomCoord(-180,180,7)
    ]);
    const { data } = await axios.get(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}`);
    const { sunrise, sunset } = data.results;
    return { coordinates:{latitude,longitude},times:{sunrise, sunset} };
};

module.exports = {
    getSunrises,
}