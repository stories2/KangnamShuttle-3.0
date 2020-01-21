exports.getProjectInfo = function (functions) {
  return {
    databaseURL: functions.config().project.database,
    storageBucket: functions.config().project.storage,
    projectId: functions.config().project.project_id
  }
}

exports.getUbikhanInfo = function (functions) {
  return {
    'apiParam': functions.config().ubikhan.api_param,
    'loginInfo': functions.config().ubikhan.login_info
  }
}

exports.getWeatherOpenApiInfo = function (functions) {
  return {
    key: functions.config().weather_open_api.key,
    lang: functions.config().weather_open_api.lang,
    local_name: functions.config().weather_open_api.local_name
  }
}

exports.getPublicSubwayOpenApiInfo = function (functions) {
  return {
    'platform_e_4501': functions.config().subway_open_api.platform_e_4501,
    'endpoint_path': functions.config().subway_open_api.endpoint_path,
    'endpoint': functions.config().subway_open_api.endpoint,
    'platform_e_4502': functions.config().subway_open_api.platform_e_4502,
    'key': functions.config().subway_open_api.key,
    'platform_b_1865': functions.config().subway_open_api.platform_b_1865,
    'port': functions.config().subway_open_api.port
  }
}

exports.getPublicBusOpenApiInfo = function (functions) {
  return {
    'endpoint': functions.config().bus_open_api.endpoint,
    'endpoint_path': functions.config().bus_open_api.endpoint_path,
    'station_id_next_to_kangnam_univ_platform': functions.config().bus_open_api.station_id_next_to_kangnam_univ_platform,
    'key': functions.config().bus_open_api.key,
    'station_id_kangnam_univ_platform': functions.config().bus_open_api.station_id_kangnam_univ_platform
  }
}

exports.getSchoolInfo = function(functions) {
  return {
    'library_seat_api_endpoint': functions.config().school.library_seat_api_endpoint
  }
}

exports.getEverytimeInfo = function(functions) {
  return {
    id: functions.config().everytime.id,
    pw: functions.config().everytime.pw,
    boards: functions.config().everytime.boards.split(',')
  }
}