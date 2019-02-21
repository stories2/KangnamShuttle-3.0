exports.createUserRoutine = function (request, response, callbackFunc) {
  const getSignInSession = this.getSignInSession
  const getUserBasicInfo = this.getUserBasicInfo
  const getUserProfilePic = this.getUserProfilePic
  const registerUser = this.registerUser

  var userData = {}
  var responseTemplate = {
    'success': false
  }

  global.log.info('accountManager', 'createUserRoutine', 'get sign in session process will start')
  getSignInSession(request.body, function (session) {
    if (session) {
      global.log.info('accountManager', 'createUserRoutine', "get user's basic info process will start")
      getUserBasicInfo(session, function (userBasicData) {
        if (userBasicData) {
          userData = {
            'birthday': userBasicData['birthday'],
            'nameKor': userBasicData['nameKor'],
            'separate': userBasicData['separate'],
            'sex': userBasicData['sex'],
            'studentId': userBasicData['studentId'],
            'pic': '',
            'email': request.body['email'],
            'uid': '',
            'password': request.body['password'],
            'role': global.define.ROLE_NORMAL
          }
          if (userData['nameKor'] === request.body['name']) {
            global.log.info('accountManager', 'createUserRoutine', "get user's profile pic process will start")
            getUserProfilePic(session, function (userProfilePic) {
              if (userProfilePic) {
                userData['pic'] = userProfilePic
                global.log.info('accountManager', 'createUserRoutine', 'register user to server process will start')
                registerUser(userData, function (uid) {
                  if (uid) {
                    global.log.info('accountManager', 'createUserRoutine', 'ok, all process passed successfully')
                    responseTemplate['success'] = true
                    responseTemplate['uid'] = uid
                    callbackFunc(responseTemplate)
                  } else {
                    global.log.warn('accountManager', 'createUserRoutine', 'cannot register user to server')
                    callbackFunc(responseTemplate)
                  }
                })
              } else {
                global.log.warn('accountManager', 'createUserRoutine', 'cannot get user profile pic')
                callbackFunc(responseTemplate)
              }
            })
          } else {
            global.log.warn('accountManager', 'createUserRoutine', 'name mismatch detected')
            callbackFunc(responseTemplate)
          }
        } else {
          global.log.warn('accountManager', 'createUserRoutine', 'cannot get user basic info')
          callbackFunc(responseTemplate)
        }
      })
    } else {
      global.log.warn('accountManager', 'createUserRoutine', 'wrong user sign in info detected')
      callbackFunc(responseTemplate)
    }
  })
}

exports.getSignInSession = function (accountData, callbackFunc) {
  const request = require('request')
  const util = require('util')
  var studentId = accountData['email'].split('@')[0]
  const authApiUrl = 'https://' + global.define.API_KANGNAM_SHUTTLE_ADDONS_DOMAIN +
        util.format(global.define.API_AUTH_SIGN_IN, studentId)
  const payload = {
    'password': accountData['password']
  }
  global.log.debug('accountManager', 'getSignInSession', '#' + studentId + ' full data: ' + JSON.stringify(accountData))
  global.log.debug('accountManager', 'getSignInSession', 'url: ' + authApiUrl + ' payload: ' + JSON.stringify(payload))

  request.post(
    authApiUrl,
    {
      json: payload
    },
    function (error, response, body) {
      if (!error && body['success']) {
        var session = response.headers['set-cookie'][0]
        // global.log.debug("accountManager", "getSignInSession", "headers: " + JSON.stringify(response.headers))
        global.log.debug('accountManager', 'getSignInSession', 'ok signed in, session: ' + session)
        callbackFunc(session)
      } else {
        global.log.error('accountManager', 'getSignInSession', 'cannot sign in, error: ' + JSON.stringify(error) + ' body: ' + JSON.stringify(body))
        callbackFunc(undefined)
      }
    }
  )
}

exports.getUserBasicInfo = function (session, callbackFunc) {
  const request = require('request')
  var options = {
    url: 'https://' + global.define.API_KANGNAM_SHUTTLE_ADDONS_DOMAIN + global.define.API_SCHOOL_BASIC_INFO,
    headers: {
      'Cookie': session
    }
  }

  global.log.debug('accountManager', 'getUserBasicInfo', 'payload: ' + JSON.stringify(options))

  request.get(
    options,
    function (error, response, body) {
      body = JSON.parse(body)
      if (!error && body['success']) {
        global.log.debug('accountManager', 'getUserBasicInfo', 'user basic info: ' + JSON.stringify(body['info']))
        callbackFunc(body['info'])
      } else {
        global.log.error('accountManager', 'getUserBasicInfo', 'cannot get basic info, error: ' + JSON.stringify(error) + ' body: ' + JSON.stringify(body))
        callbackFunc(undefined)
      }
    }
  )
}

exports.getUserProfilePic = function (session, callbackFunc) {
  const request = require('request')
  var options = {
    url: 'https://' + global.define.API_KANGNAM_SHUTTLE_ADDONS_DOMAIN + global.define.API_SCHOOL_PROFILE_PIC,
    headers: {
      'Cookie': session
    }
  }

  global.log.debug('accountManager', 'getUserProfilePic', 'payload: ' + JSON.stringify(options))

  request.get(
    options,
    function (error, response, body) {
      body = JSON.parse(body)
      if (!error && body['success']) {
        global.log.debug('accountManager', 'getUserProfilePic', 'user profile pic size: ' + JSON.stringify(body['pic']).length)
        callbackFunc(body['pic'])
      } else {
        global.log.error('accountManager', 'getUserProfilePic', 'cannot get profile pic, error: ' + JSON.stringify(error) + ' body: ' + JSON.stringify(body))
        callbackFunc(undefined)
      }
    }
  )
}

exports.registerUser = function (userData, callbackFunc) {
  const admin = global.admin
  const util = require('util')
  var userCreateOption = {
    email: userData['email'],
    emailVerified: false,
    // phoneNumber: "+11234567890",
    password: userData['password'],
    displayName: userData['nameKor'],
    // photoURL: "http://www.example.com/12345678/photo.png",
    disabled: false
  }
  var uid = undefined
  userData['password'] = null
  global.log.debug('accountManager', 'registerUser', 'collected user data: ' + JSON.stringify(userData))
  global.log.debug('accountManager', 'registerUser', 'create user data: ' + JSON.stringify(userCreateOption))
  admin.auth().createUser(userCreateOption)
    .then(function (userRecord) {
      // See the UserRecord reference doc for the contents of userRecord.
      uid = userRecord.uid
      userData['uid'] = uid
      global.log.debug('accountManager', 'registerUser', 'user created uid: ' + uid)

      var accountDbPath = util.format(global.define.DB_PATH_ACCOUNTS_UID, uid)
      admin.database().ref(accountDbPath).set(userData, function (error) {
        if (error) {
          global.log.error('accountManager', 'registerUser', 'cannot write user info to db, rollback: ' + uid)
          admin.auth().deleteUser(uid)
            .then(function () {
              global.log.debug('accountManager', 'registerUser', 'write user info is failed, so i delete user too: ' + uid)
              callbackFunc(undefined)
            })
            .catch(function (error) {
              global.log.error('accountManager', 'registerUser', 'write user info is failed, and cannot delete user: ' + JSON.stringify(error) + ' #' + uid)
              callbackFunc(undefined)
            })
        } else {
          global.log.debug('accountManager', 'registerUser', 'user registered: ' + uid)
          callbackFunc(uid)
        }
      })

      // console.log("Successfully created new user:", userRecord.uid);
    })
    .catch(function (error) {
      global.log.error('accountManager', 'registerUser', 'cannot create user: ' + error)
      admin.auth().deleteUser(uid)
        .then(function () {
          global.log.debug('accountManager', 'registerUser', 'create user is failed, so i delete user too: ' + uid)
          callbackFunc(undefined)
        })
        .catch(function (error) {
          global.log.error('accountManager', 'registerUser', 'create user is failed, and cannot delete user: ' + JSON.stringify(error) + ' #' + uid)
          callbackFunc(undefined)
        })
      // callbackFunc(undefined)
    })
}

exports.checkUserIsVerified = function (request, response, callbackFunc) {
  var admin = global.admin
  var uid = request.query['uid']

  global.log.debug('AuthManager', 'checkUserIsVerified', 'check user info using: ' + uid)

  admin.auth().getUser(uid)
    .then(function (userRecord) {
      global.log.debug('AuthManager', 'checkUserIsVerified', "this is user's info: " + JSON.stringify(userRecord))
      if (userRecord['emailVerified']) {
        global.log.debug('AuthManager', 'checkUserIsVerified', 'this user #' + uid + ' verified')
        callbackFunc(true)
      } else {
        global.log.debug('AuthManager', 'checkUserIsVerified', 'this user #' + uid + ' not verified')
        callbackFunc(false)
      }
    })
    .catch(function (error) {
      global.log.error('AuthManager', 'checkUserIsVerified', 'cannot get user info from uid: ' + JSON.stringify(error))
    })
}

exports.getAllAccountList = function (request, response, callbackFunc) {
  var admin = global.admin

  var accountsRef = admin.database().ref(global.define.DB_PATH_ACCOUNT)
  accountsRef.once('value', function (accountSnapshot) {
    callbackFunc(accountSnapshot.val())
  })
}

exports.patchAccount = function (request, response, callbackFunc) {
  var admin = global.admin
  const util = require('util')
  var uid = request.body['uid']

  var targetAccountDBPath = util.format(global.define.DB_PATH_ACCOUNTS_UID, uid)
  var bodyData = request.body

  var accountsRef = admin.database().ref(targetAccountDBPath)
  accountsRef.once('value', function (accountSnapshot) {
    var accountSnapshotData = accountSnapshot.val()

    accountSnapshotData['birthday'] = bodyData['birthday'] || ''
    accountSnapshotData['nameKor'] = bodyData['nameKor'] || ''
    accountSnapshotData['role'] = bodyData['role'] || global.define.ROLE_NORMAL
    accountSnapshotData['separate'] = bodyData['separate'] || ''
    accountSnapshotData['sex'] = bodyData['sex'] || ''
    accountSnapshotData['studentId'] = bodyData['studentId'] || ''

    global.log.debug('accountManager', 'patchAccount', 'patch user: ' + JSON.stringify(accountSnapshotData))

    accountsRef.set(accountSnapshotData, function (error) {
      if (!error) {
        global.log.info('accountManager', 'patchAccount', 'success')
        callbackFunc(true)
      } else {
        global.log.error('accountManager', 'patchAccount', 'failed: ' + JSON.stringify(error))
        callbackFunc(false)
      }
    })
  })
}

exports.deleteAccount = function (request, response, callbackFunc) {
  var admin = global.admin
  const util = require('util')
  var uid = request.body['uid']

  var targetAccountDBPath = util.format(global.define.DB_PATH_ACCOUNTS_UID, uid)
  admin.auth().deleteUser(uid)
    .then(function () {
      global.log.debug('accountManager', 'deleteAccount', 'user deleted: ' + uid)
      var accountsRef = admin.database().ref(targetAccountDBPath)
      accountsRef.set({}, function (error) {
        if (!error) {
          global.log.info('accountManager', 'deleteAccount', 'success')
          callbackFunc(true)
        } else {
          global.log.error('accountManager', 'deleteAccount', 'failed: ' + JSON.stringify(error))
          callbackFunc(false)
        }
      })
    })
    .catch(function (error) {
      global.log.error('accountManager', 'deleteAccount', 'cannot delete user: ' + JSON.stringify(error) + ' #' + uid)
      callbackFunc(false)
    })
}

exports.registerGoogleAccount = function (request, response, callbackFunc) {
  var admin = global.admin
  const util = require('util')
  var uid = request.body['uid']

  admin.auth().getUser(uid)
    .then(function (userRecord) {
      global.log.debug('accountManager', 'registerGoogleAccount', "this is user's info: " + JSON.stringify(userRecord))

      var payload = {
        email: userRecord.email,
        nameKor: userRecord.displayName,
        picUrl: userRecord.photoURL,
        role: global.define.ROLE_NORMAL,
        uid: userRecord.uid,
        phone: userRecord.phoneNumber || ''
      }

      var accountDbPath = util.format(global.define.DB_PATH_ACCOUNTS_UID, uid)

      global.log.debug('accountManager', 'registerGoogleAccount', 'save user info to: ' + accountDbPath)
      global.log.debug('accountManager', 'registerGoogleAccount', 'save user info data: ' + JSON.stringify(payload))

      var accountDBRef = admin.database().ref(accountDbPath)
      accountDBRef.once('value', function (accountSnapshot) {
        var accountSnapshotData = accountSnapshot.val()
        if (accountSnapshotData == null || accountSnapshotData === undefined) {
          global.log.info('accountManager', 'registerGoogleAccount', 'current user is newbie')

          accountDBRef.set(payload, function (error) {
            if (error) {
              global.log.error('accountManager', 'registerGoogleAccount', 'cannot register user#' + uid + ': ' + JSON.stringify(error))
              admin.auth().deleteUser(uid)
                .then(function () {
                  global.log.debug('accountManager', 'registerGoogleAccount', 'write user info is failed, so i delete user too: ' + uid)

                  callbackFunc(false)
                })
                .catch(function (error) {
                  global.log.error('accountManager', 'registerGoogleAccount', 'write user info is failed, and cannot delete user: ' + JSON.stringify(error) + ' #' + uid)

                  callbackFunc(false)
                })
            } else {
              global.log.info('accountManager', 'registerGoogleAccount', 'ok user registered')
              callbackFunc(true)
            }
          })
        } else {
          global.log.info('AuthManager', 'registerGoogleAccount', 'already registered')
          callbackFunc(true)
        }
      })
    })
    .catch(function (error) {
      global.log.error('AuthManager', 'registerGoogleAccount', 'cannot get user info from uid: ' + JSON.stringify(error))
    })
}
