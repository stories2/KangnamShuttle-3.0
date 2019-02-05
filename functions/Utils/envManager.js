exports.getProjectInfo = function (functions) {
    return {
        databaseURL: functions.config().project.database,
        storageBucket: functions.config().project.storage,
        projectId: functions.config().project.project_id
    }
}

exports.getUbikhanInfo = function (functions) {
    return {
        "apiParam": functions.config().ubikhan.api_param,
        "loginInfo": functions.config().ubikhan.login_info
    }
}

exports.getWeatherOpenApiInfo = function (functions) {
    return {
        key: functions.config().weather_open_api.key,
        lang: functions.config().weather_open_api.lang,
        local_name: functions.config().weather_open_api.local_name
    }
}