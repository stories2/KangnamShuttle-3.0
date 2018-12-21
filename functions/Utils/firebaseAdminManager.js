exports.getAdminSDK = function () {
    const functions = require('firebase-functions');
    var admin = require('firebase-admin');
    const serviceAccount = require("../service-account.json");
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: functions.config().project.database,
        storageBucket: functions.config().project.storage,
        projectId: functions.config().project.project_id
    });
    return admin
}