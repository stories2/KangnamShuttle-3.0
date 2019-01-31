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
const v3PrivateApi = express()
//Routes
const publicRoute = require('./Route/V3/publicRoute')
const kakaoRoute = require('./Route/V3/kakaoRoute')
const privateRoute = require('./Route/V3/privateRoute')
//Attribute
const preprocessManager = require('./Attribute/preprocessManager')
const authManager = require('./Attribute/AuthManager')

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
v3PublicApi.get('/realtimeShuttleLocation', publicRoute.realtimeShuttleLocation)
v3PublicApi.patch('/realtimeShuttleLocation', publicRoute.updateRealtimeShuttleLocation)
v3PublicApi.post('/auth', publicRoute.authSignUp)
exports.v3PublicApi = functions.https.onRequest(v3PublicApi)

v3PrivateApi.use(cors)
v3PrivateApi.use(authManager.authRoutine)
v3PrivateApi.use(preprocessManager.addModules)

v3PrivateApi.get('/menu', privateRoute.getMenuListBasedOnRole)

v3PrivateApi.get('/accounts', privateRoute.getAllAccountList)
v3PrivateApi.patch('/accounts', privateRoute.patchAccount)
v3PrivateApi.delete('/accounts', privateRoute.deleteAccount)

v3PrivateApi.get('/shuttle/station', privateRoute.getStationList)
v3PrivateApi.post('/shuttle/station', privateRoute.addStation)
v3PrivateApi.patch('/shuttle/station', privateRoute.patchStation)
v3PrivateApi.delete('/shuttle/station', privateRoute.deleteStation)

v3PrivateApi.get('/shuttle/station/schedule', privateRoute.getStationSchedule)
v3PrivateApi.post('/shuttle/station/schedule', privateRoute.createStationSchedule)
v3PrivateApi.patch('/shuttle/station/schedule', privateRoute.patchStationSchedule)
v3PrivateApi.delete('/shuttle/station/schedule', privateRoute.deleteStationSchedule)

v3PrivateApi.get('/shuttle/routine', privateRoute.getShuttleRoutine)
v3PrivateApi.patch('/shuttle/routine', privateRoute.patchShuttleRoutine)

v3PrivateApi.get('/role', privateRoute.getAllRoleList)

exports.v3PrivateApi = functions.https.onRequest(v3PrivateApi)

v3KakaoApi.use(cors)
v3KakaoApi.use(preprocessManager.addModules)
v3KakaoApi.post('/continue', kakaoRoute.continue)
v3KakaoApi.post('/action/:index', kakaoRoute.action)
exports.v3KakaoApi = functions.https.onRequest(v3KakaoApi)