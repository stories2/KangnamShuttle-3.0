//For firebase
const functions = require('firebase-functions');
//Packages
const express = require('express')
const cors = require('cors')({origin: true})
//Modules
const adminManager = require('./Utils/FirebaseAdminManager')
//Express
const v3PublicApi = express()
//Routes
const v3AppPublicRoute = require('./Route/V3AppPublicRoute')

//Global
global.admin = adminManager.getAdminSDK()

v3PublicApi.use(cors)
v3PublicApi.post('/hello', v3AppPublicRoute.hello)
exports.v3PublicApi = functions.https.onRequest(v3PublicApi)