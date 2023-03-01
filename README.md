# sundial
Sunrise &amp; Sunset tracker
This application gets the sunset / sunrise times from 100 random locations, picks out the earliest sunrise, and lists the length of the day at those coordinates.
The response from this application is an unformatted JSON object with the earlier sunrise and length of day listed first, then the resposne from all 100 coordinates polled.

## Installation
To install locally run:
`npm i`

## Running
To run the server run:
`npm run start`
This will locally host the [server](http://localhost:3000) on port 3000.
When the server is running just navigate to the link above to see the response from the application.

## Response
An example of a successful response is as follows:
```
{
    "earliestSunrise":
    {
        "earliestSunrise":"12:00:00 AM",
        "dayLength":"00:00:00"
    },
    "responses":
    [{
        "coordinates":{
            "latitude":"-49.3398161",
            "longitude":"37.2216561"
        },
        "times":{
            "sunrise":"3:00:44 AM",
            "sunset":"4:26:14 PM",
            "solar_noon":"9:43:29 AM",
            "day_length":"13:25:30",
            "civil_twilight_begin":"2:29:26 AM",
            "civil_twilight_end":"4:57:32 PM",
            "nautical_twilight_begin":"1:49:23 AM",
            "nautical_twilight_end":"5:37:36 PM",
            "astronomical_twilight_begin":"1:06:04 AM",
            "astronomical_twilight_end":"6:20:55 PM"
        }
    },
    {
        "coordinates":{
            "latitude":"-49.3398161",
            "longitude":"37.2216561"
        },
    ...
```