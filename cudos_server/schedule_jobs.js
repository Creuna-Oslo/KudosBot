var express = require('express');
var router = express.Router();
var mongoClient = require("mongodb").MongoClient;
var schedule = require('node-schedule');
var serverDate = new Date();
var currentYear = serverDate.getFullYear();
var currentMonth = serverDate.getMonth();
// 14:30 today
var dummydate = new Date(2018, 8, 24, 15, 17, 0);

var monthlyScheduleRule = new schedule.RecurrenceRule();
monthlyScheduleRule.date

var firstDayOfMonth = ('* * 0 1 * *')
var currentUserCollectionName = "";
var archiveCollectionName = "";
var dbName = "";
var dbURL = "";


// Promise handling
const asyncMiddleware = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Print to page for error handling
router.get('/', asyncMiddleware(async (req, res, next) => {
    let userName = req.query.user_name;
    let text = serverDate + " and " + dummydate;
    res.send(text);
    })
);

// Monday at 00:05 server time every week.
schedule.scheduleJob({dayOfWeek: 1, hour: 0, minute: 5}, asyncMiddleware(async (req, res, next) => {
    await resetCurrentAvailableCudos();
}));

// 00:05 first day of month
schedule.scheduleJob({hour: 0, minute: 5, date: 1}, asyncMiddleware(async () => {
    let report = await getAllCurrentUserData();
    await backupAllCurrentUserData(report);
    await resetCurrentCudos();
}));

getDB = async func => {
    //TODO: use dbURL variable.
    let client = await mongoClient.connect("mongodb://scheduled:OjFk107LdohRnKiv8au8RIc4unybI0busfSxzjPXgsezNOhVRxGPUojRCJDYk039DD0NJzsNYFauYCm3yQSr6A%3D%3D@scheduled.documents.azure.com:10255/?ssl=true");
    //TODO: use dbName variavble
    let db = client.db("dataDB");
    try {
        return await func(db);
    } finally {
        client.close();
    }
};

// Get and return data from all users in array
getAllCurrentUserData = async () =>{
    
    // TODO: use currentUserCollectionName variable instead of "mock"
    return await getDB(async db => await db.collection("mock").find().toArray());
};

// Fetch and post all user data to a single document in the reports collection
backupAllCurrentUserData = async report => {
    
    // TODO: use archiveCollectionName variable instead of "reports"
    await getDB(async db => await db.collection("reports").insertOne(
        { month: currentMonth+1, year: currentYear, backupContent: report }
    ));
};

// This method is meant to reset all received cudos to 0 and available to 3 at change of month
resetCurrentCudos = async () => {

    //TODO: update all received cudos to 0 and available to 3. Change collection name to currentUserCollectionName variable name.
    await getDB(async db => await db.collection("mock").update( { name: { '$exists': true }}, { '$set': { name: "hei" }}, { multi: true} ));
}


// This method has to be set to only affect current available Cudos (Set to 3)
resetCurrentAvailableCudos = async () => {

    //TODO: update available kudos to 3. Change collection name to currentUserCollectionName variable.
    await getDB(async db => await db.collection("mock").update( { name: { '$exists': true }}, { '$set': { name: "jeje" }}, { multi: true} ));
}



module.exports = router;
