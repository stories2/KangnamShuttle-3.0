//For firebase
const functions = require('firebase-functions');
//Packages
const express = require('express')
const cors = require('cors')({origin: true})
//Modules
const adminManager = require('./Utils/firebaseAdminManager')
//Express
const v3PublicApi = express()
const v3KakaoApi = express()
//Routes
const publicRoute = require('./Route/V3/publicRoute')
const kakaoRoute = require('./Route/V3/kakaoRoute')
//Attribute
const preprocessManager = require('./Attribute/preprocessManager')

//Global
global.define = require('./Settings/defineManager')
global.envManager = require('./Utils/envManager')
global.admin = adminManager.getAdminSDK(global.envManager)
global.log = require('./Utils/logManager')
global.datetime = require('./Utils/datetimeManager')

v3PublicApi.use(cors)
v3PublicApi.use(preprocessManager.addModules)
v3PublicApi.post('/hello', publicRoute.hello)
v3PublicApi.get('/test/:param', publicRoute.paramTest)
exports.v3PublicApi = functions.https.onRequest(v3PublicApi)

v3KakaoApi.use(cors)
v3KakaoApi.use(preprocessManager.addModules)
v3KakaoApi.post('/continue', kakaoRoute.continue)
v3KakaoApi.post('/action/:index', kakaoRoute.action)
exports.v3KakaoApi = functions.https.onRequest(v3KakaoApi)