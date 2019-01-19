var LOG_LEVEL_VERBOSE = 0;
var LOG_LEVEL_INFO = 1;
var LOG_LEVEL_DEBUG = 2;
var LOG_LEVEL_WARN = 3;
var LOG_LEVEL_ERROR = 4;

var APP_TITLE = "강남대학교 달구지봇"

var TOAST_SHOW_SHORT = 800
var TOAST_SHOW_LONG = 3000

var ZERO = 0

var SHUTTLE_LOCATION_REFRESH_TIME = 30000

var API_GET_SHUTTLE_LOCATION = "https://us-central1-kangnamshuttle3.cloudfunctions.net/v3PublicApi/realtimeShuttleLocation"
var API_AUTH_SIGN_UP = "https://us-central1-kangnamshuttle3.cloudfunctions.net/v3PublicApi/auth"

var FEEDBACK_SIGN_UP_SUCCESS = "계정 생성이 완료되었습니다."
var FEEDBACK_SIGN_UP_FAILED = "계정 생성 중 문제가 발생되었습니다. 저런;"
var FEEDBACK_VERIFY_FIRST = "계정 인증이 확인되지 않았습니다. 이메일 인증을 해주세요."
var FEEDBACK_SIGN_IN_SUCCESS = "로 로그인 되었습니다."
var FEEDBACK_SIGN_IN_FAILED = "로그인 하지 못 하였습니다."