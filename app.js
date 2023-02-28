const express = require('express');
const axios = require('axios');

const app = express()
const port = 3000

app.get('/', (req, res) => {
  axios.get('https://api.sunrise-sunset.org/json?lat=36.7201600&lng=-4.4203400',)
    .then(response => {
      const { data } = response;
      res.send(data);
    }).catch(err => {
      console.log(err);
      res.sendStatus(501);
    });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})