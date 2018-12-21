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
//Attribute
const preprocessManager = require('./Attribute/preprocessManager')

//Global
global.define = require('./Settings/defineManager')
global.admin = adminManager.getAdminSDK()
global.log = require('./Utils/logManager')

v3PublicApi.use(cors)
v3PublicApi.use(preprocessManager.addModules)
v3PublicApi.post('/hello', publicRoute.hello)
exports.v3PublicApi = functions.https.onRequest(v3PublicApi)