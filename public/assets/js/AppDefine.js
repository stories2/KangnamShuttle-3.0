var LOG_LEVEL_VERBOSE = 0
var LOG_LEVEL_INFO = 1
var LOG_LEVEL_DEBUG = 2
var LOG_LEVEL_WARN = 3
var LOG_LEVEL_ERROR = 4

var APP_TITLE = '강남대학교 달구지봇'

var TOAST_SHOW_SHORT = 800
var TOAST_SHOW_LONG = 3000

var ZERO = 0

var SHUTTLE_LOCATION_REFRESH_TIME = 30000
var PUBLIC_TRANSPORT_BUS_REFRESH_TIME = 60000
var PUBLIC_TRANSPORT_SUBWAY_REFRESH_TIME = 60000

var LIVE_SERVER_DOMAIN = 'https://asia-northeast1-kangnamshuttle3.cloudfunctions.net/'

var API_GET_SHUTTLE_LOCATION = LIVE_SERVER_DOMAIN + 'v3PublicApi/realtimeShuttleLocation'
var API_AUTH_SIGN_UP = LIVE_SERVER_DOMAIN + 'v3PublicApi/auth'
// MENU
var API_GET_MENU = LIVE_SERVER_DOMAIN + 'v3PrivateApi/menu'
// ACCOUNT
var API_GET_ACCOUNTS_LIST = LIVE_SERVER_DOMAIN + 'v3PrivateApi/accounts'
var API_PATCH_ACCOUNT = LIVE_SERVER_DOMAIN + 'v3PrivateApi/accounts'
var API_DELETE_ACCOUNT = LIVE_SERVER_DOMAIN + 'v3PrivateApi/accounts'
var API_IS_ACCOUNT_VERIFIED = LIVE_SERVER_DOMAIN + 'v3PrivateApi/accounts/isVerified'
var API_REGISTER_GOOGLE_ACCOUNT = LIVE_SERVER_DOMAIN + 'v3PublicApi/register/google'
// SHUTTLE
var API_GET_ROUTINE_LIST = LIVE_SERVER_DOMAIN + 'v3PrivateApi/shuttle/routine'
var API_POST_ROUTINE = LIVE_SERVER_DOMAIN + 'v3PrivateApi/shuttle/routine'
var API_PATCH_ROUTINE = LIVE_SERVER_DOMAIN + 'v3PrivateApi/shuttle/routine'
var API_DELETE_ROUTINE = LIVE_SERVER_DOMAIN + 'v3PrivateApi/shuttle/routine'
var API_GET_ROUTINE_STATION_LIST = LIVE_SERVER_DOMAIN + 'v3PrivateApi/shuttle/routine/station'
var API_POST_ROUTINE_STATION = LIVE_SERVER_DOMAIN + 'v3PrivateApi/shuttle/routine/station'
var API_PATCH_ROUTINE_STATION = LIVE_SERVER_DOMAIN + 'v3PrivateApi/shuttle/routine/station'
var API_DELETE_ROUTINE_STATION = LIVE_SERVER_DOMAIN + 'v3PrivateApi/shuttle/routine/station'
var API_GET_ROUTINE_STATION_SCHEDULE_LIST = LIVE_SERVER_DOMAIN + 'v3PrivateApi/shuttle/routine/station/schedule'
var API_PATCH_ROUTINE_STATION_SCHEDULE = LIVE_SERVER_DOMAIN + 'v3PrivateApi/shuttle/routine/station/schedule'
var API_GET_ROUTE_PATH = LIVE_SERVER_DOMAIN + 'v3PrivateApi/shuttle/routine/path'
var API_PATCH_ROUTE_PATH = LIVE_SERVER_DOMAIN + 'v3PrivateApi/shuttle/routine/path'
var API_POST_SHUTTLE_SCHEDULE_PIC = LIVE_SERVER_DOMAIN + 'v3FileApi/upload/shuttleSchedulePic'
var API_GET_SHUTTLE_NOTICE_LIST = LIVE_SERVER_DOMAIN + 'v3PrivateApi/shuttle/notice'
var API_PATCH_SHUTTLE_NOTICE_LIST = LIVE_SERVER_DOMAIN + 'v3PrivateApi/shuttle/notice'
// ROLE
var API_GET_ROLE_LIST = LIVE_SERVER_DOMAIN + 'v3PrivateApi/role'
// API
var API_GET_API_LIST = LIVE_SERVER_DOMAIN + 'v3PrivateApi/api'
// PUBLIC TRANSPORT
var API_GET_PUBLIC_SUBWAY = LIVE_SERVER_DOMAIN + 'v3PublicApi/public/subway'
var API_PATCH_PUBLIC_SUBWAY = LIVE_SERVER_DOMAIN + 'v3PublicApi/public/subway'
var API_GET_PUBLIC_BUS = LIVE_SERVER_DOMAIN + 'v3PublicApi/public/bus'
var API_PATCH_PUBLIC_BUS = LIVE_SERVER_DOMAIN + 'v3PublicApi/public/bus'
// SCHOOL
var API_GET_PUBLIC_SCHOOL_LIFE_SCHEDULE = LIVE_SERVER_DOMAIN + 'v3PublicApi/school/schedule/latest'
var API_GET_PRIVATE_SCHOOL_MY_CALENDAR = LIVE_SERVER_DOMAIN + 'v3PrivateApi/school/mySchedule'
var API_PATCH_PRIVATE_SCHOOL_MY_CALENDAR = LIVE_SERVER_DOMAIN + 'v3PrivateApi/school/mySchedule'

var FEEDBACK_SIGN_UP_SUCCESS = '계정 생성이 완료되었습니다.'
var FEEDBACK_SIGN_UP_FAILED = '계정 생성 중 문제가 발생되었습니다. 저런;'
var FEEDBACK_VERIFY_FIRST = '계정 인증이 확인되지 않았습니다. 이메일 인증을 해주세요.'
var FEEDBACK_SIGN_IN_SUCCESS = '로 로그인 되었습니다.'
var FEEDBACK_SIGN_IN_FAILED = '로그인 하지 못 하였습니다.'

var HTTP_STATUS_OK = 200

var MAXIMUM_OF_ROUTINE_SIZE = 3
var MAXIMUM_OF_STATION_SIZE = 5
