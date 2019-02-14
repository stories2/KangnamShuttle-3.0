exports.LOGGING_STRING_FORMAT = "[%s] {%s} (%s)"
exports.LOGGING_STRING_FORMAT_INFO = "%s I: [%s] {%s} (%s)"
exports.LOGGING_STRING_FORMAT_DEBUG = "%s D: [%s] {%s} (%s)"
exports.LOGGING_STRING_FORMAT_WARN = "%s W: [%s] {%s} (%s)"
exports.LOGGING_STRING_FORMAT_ERROR = "%s E: [%s] {%s} (%s)"

exports.LOGGING_TYPE_SHUTTLE_IMAGE = "ShuttlePicture"

exports.MAXIMUM_OF_OUTPUTS_LENGTH = 3
exports.MAXIMUM_OF_QUICK_REPLIES_LENGTH = 10
exports.MAXIMUM_OF_ROUTINE_SIZE = 3
exports.MAXIMUM_OF_STATION_SIZE = 5

exports.HEADERS_CONTENT_TYPE = "Content-Type"
exports.HEADERS_CONTENT_TYPE_APPLICATION_JSON = "application/json"

exports.HTTP_STATUS_CODE_OK = 200
exports.HTTP_STATUS_CODE_BAD_REQUEST = 400
exports.HTTP_STATUS_CODE_UNAUTHORIZED = 401
exports.HTTP_STATUS_CODE_FORBIDDEN = 403
exports.HTTP_STATUS_CODE_INTERNAL_SERVER_ERROR = 500

exports.ZERO = 0
exports.ONE = 1

exports.DB_PATH_ACTIONS_ACTION_INDEX = "/actions/%s"
exports.DB_PATH_USERS_USER_KEY = "/users/%s"
exports.DB_PATH_USERS_USER_KEY_UPDATE = "/users/%s/update"
exports.DB_PATH_ACTIONS_101_QUICK_REPLIES = "/actions/101/quickReplies"
exports.DB_PATH_SHUTTLE_SCHEDULE_DIRECTION_DOWN = "/shuttle/schedule/directionDown"
exports.DB_PATH_SHUTTLE_SCHEDULE_DIRECTION_UP = "/shuttle/schedule/directionUp"
exports.DB_PATH_SHUTTLE_SCHEDULE = "/shuttle/schedule"
exports.DB_PATH_SHUTTLE_NOTICE_TIMELINE = "/shuttle/noticeTimeline"
exports.DB_PATH_SHUTTLE_SCHEDULE_ROUTINE = "/shuttle/schedule/%s"
exports.DB_PATH_SHUTTLE_SCHEDULE_ROUTINE_STATION = "/shuttle/schedule/%s/%s"
exports.DB_PATH_SHUTTLE = "/shuttle"
exports.DB_PATH_SHUTTLE_ROUTE = "/shuttle/route"
exports.DB_PATH_SHUTTLE_LOCATION = "/shuttle/location"
exports.DB_PATH_SHUTTLE_SCHEDULE_PIC = "/shuttle/schedulePic"
exports.DB_PATH_SYSTEM_VERSION = "/system/version"
exports.DB_PATH_ACCOUNTS_UID = "/accounts/%s"
exports.DB_PATH_ACCOUNT = "/accounts"
exports.DB_PATH_ROLE = "/role"
exports.DB_PATH_API = "/api"
exports.DB_PATH_MENU = "/menu"
exports.DB_PATH_SYSTEM_LOG = "/system/log"
exports.DB_PATH_OPEN_API_WEATHER = "/openAPI/weather"
exports.DB_PATH_OPEN_API_PUBLIC_SUBWAY_PLATFORM_DIR = "/openAPI/subway/%s/%s"

exports.DEFAULT_USER_DATA = {
    "action": "1",
    "register": "1990-01-01T00:00:00",
    "update": "1990-01-01T00:00:00"
}
exports.DEFAULT_RESPONSE_TYPE_ZERO = "0"

exports.LIST_OF_PANTIES_COLOR = [
    "파랑", "검점", "빨강", "하양", "핑크", "살색"
]

exports.GMT_KOREA_TIME_MIN = 540
exports.HOUR_TO_MILE = 60000
exports.TIME_SEC_10MIN = 600

exports.RESPONSE_SHUTTLE_SCHEDULE_FIRST = 1
exports.RESPONSE_SHUTTLE_SCHEDULE_NORMAL = 2
exports.RESPONSE_SHUTTLE_SCHEDULE_LAST = 3
exports.RESPONSE_SHUTTLE_SCHEDULE_MISSED = 4

exports.API_KANGNAM_SHUTTLE_ADDONS_DOMAIN = "kangnam-shuttle-addons.herokuapp.com"
exports.API_AUTH_SIGN_IN = "/auth/%s"
exports.API_SCHOOL_BASIC_INFO = "/school/profile/basic"
exports.API_SCHOOL_PROFILE_PIC = "/school/profile/img"
exports.API_SHUTTLE_SCHEDULE_PIC_DOWNLOAD = "https://us-central1-kangnamshuttle3.cloudfunctions.net/v3PublicApi/shuttleSchedulePic"

exports.ROLE_NORMAL = "Normal"
exports.ROLE_ADMIN = "Admin"
exports.ROLE_DEVELOPER = "Developer"

exports.UPLOAD_FILE_SIZE_LIMIT_5MB = "5mb"

exports.PROMISE_FILE_UPLOAD_REJECT_EMPTY_FILE = 'empty file'
exports.PROMISE_FILE_UPLOAD_REJECT_SAVE_FILE_ERROR = 'save file error'
exports.PROMISE_FILE_UPLOAD_REJECT_DOWNLOAD_URL_ERROR = 'url crashed'

exports.FORMAT_DATE_TIME_YYYY_MM_DD = "yyyy-mm-dd"

exports.SHUTTLE_SCHEDULE_PIC_BUCKET_DIR = "BusSchedule/"

exports.DATE_TIME_SATURDAY = 6
exports.DATE_TIME_SUNDAY = 0

exports.SUBWAY_DIRECTION_UP = "1"
exports.SUBWAY_DIRECTION_DOWN = "2"
exports.SUBWAY_NORMAL_DAY_OF_WEEK = "1"
exports.SUBWAY_SATURDAY_OF_WEEK = "2"
exports.SUBWAY_SUNDAY_OF_WEEK = "3"
exports.SUBWAY_OPEN_API_RESULT_OK = "INFO-000"

exports.PUBLIC_BUS_OPEN_API_RESULT_OK = "0"