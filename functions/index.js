//For firebase
const functions = require('firebase-functions');
//Packages
const express = require('express')
const cors = require('cors')({origin: true})
//Modules
const adminManager = require('./Utils/firebaseAdminManager')
//Express
const v3PublicApi = express()
//Routes
const publicRoute = require('./Route/V3/publicRoute')

//Global
global.define = require('./Settings/defineManager')
global.admin = adminManager.getAdminSDK()
global.log = require('./Utils/logManager')
global.response = require('./Utils/responseManager')

v3PublicApi.use(cors)
v3PublicApi.post('/hello', publicRoute.hello)
exports.v3PublicApi = functions.https.onRequest(v3PublicApi)