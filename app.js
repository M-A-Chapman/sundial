const express = require('express');
const {getSunrises} = require('./sunrise');
const app = express()
const port = 3000

app.get('/', (req, res) => {
  getSunrises()
    .then(response => {
      res.send(response);
    }).catch(err => {
      console.log(err);
      res.sendStatus(501);
    });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})