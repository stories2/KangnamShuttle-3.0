exports.getAdminSDK = function (envManager) {
    const functions = require('firebase-functions');
    var admin = require('firebase-admin');
    const serviceAccount = require("../service-account.json");
    const projectInfo = envManager.getProjectInfo(functions)
    projectInfo["credential"] = admin.credential.cert(serviceAccount)
    admin.initializeApp(projectInfo);
    return admin
}