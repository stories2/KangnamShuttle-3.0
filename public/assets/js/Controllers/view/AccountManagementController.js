app.controller('AccountManagementController', function ($scope, $http, $mdToast, $mdSidenav, $window, $timeout, $rootScope, $mdDialog, KSAppService) {
  KSAppService.info('AccountManagementController', 'AccountManagementController', 'init')

  $scope.accountList = {}
  $scope.roleList = {}

  $scope.onLoad = function () {
    getAccountList()
    getRoleList()
  }

  $scope.edit = function (item) {
    KSAppService.debug('AccountManagementController', 'AccountManagementController', 'selected item: ' + JSON.stringify(item))

    $mdDialog.show({
      controller: accountDetailDialogController,
      templateUrl: 'assets/view/dialog/accountDetail.html',
      parent: angular.element(document.body),
      // targetEvent: ev,
      clickOutsideToClose: true,
      locals: {
        accountData: item,
        roleList: $scope.roleList
      }
    })
      .then(function (accountData) {
        KSAppService.debug('AccountManagementController', 'edit', 'user data: ' + JSON.stringify(accountData))
        patchAccount(accountData)
      }, function () {
        KSAppService.info('AccountManagementController', 'edit', 'you just canceled dialog')
      })
  }

  $scope.delete = function (accountData) {
    var confirm = $mdDialog.confirm()
      .title('유저 삭제')
      .textContent('유저 ' + accountData['nameKor'] + ' #' + accountData['studentId'] + '를 삭제합니다')
    // .targetEvent(ev)
      .ok('확인')
      .cancel('취소')

    $mdDialog.show(confirm).then(function () {
      KSAppService.info('AccountManagementController', 'delete', 'delete account confirmed')
      deleteAccount(accountData)
    }, function () {
      KSAppService.info('AccountManagementController', 'delete', 'delete account canceled')
    })
  }

  function getRoleList () {
    var payload = {}
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
      // Send token to your backend via HTTPS
      // ...
      KSAppService.setToken(idToken)
      KSAppService.getReq(
        API_GET_ROLE_LIST,
        payload,
        function (data) {
          KSAppService.debug('AccountManagementController', 'getRoleList', 'role received: ' + JSON.stringify(data))
          initRoleList(data)
        },
        function (error) {
          KSAppService.error('AccountManagementController', 'getRoleList', 'cannot get role: ' + JSON.stringify(error))
          KSAppService.showToast('Cannot get role', TOAST_SHOW_LONG)
        })
    }).catch(function (error) {
      // Handle error
      KSAppService.error('AccountManagementController', 'getRoleList', 'failed generate token: ' + JSON.stringify(error))
      KSAppService.showToast('Failed generate token', TOAST_SHOW_LONG)
    })
  }

  function initRoleList (data) {
    $scope.roleList = data['data']
  }

  function deleteAccount (accountData) {
    var payload = {
      'uid': accountData['uid']
    }
    KSAppService.deleteReq(
      API_DELETE_ACCOUNT,
      payload,
      function (data) {
        if (data['status'] == HTTP_STATUS_OK && data['data']['success']) {
          KSAppService.debug('AccountManagementController', 'deleteAccount', 'account deleted: ' + JSON.stringify(data))
          KSAppService.showToast('Account deleted successfully', TOAST_SHOW_LONG)
          getAccountList()
        } else {
          throw null
        }
      },
      function (error) {
        KSAppService.error('AccountManagementController', 'deleteAccount', 'cannot delete account: ' + JSON.stringify(error))
        KSAppService.showToast('Failed to delete account', TOAST_SHOW_LONG)
      })
  }

  function patchAccount (accountData) {
    var payload = {
      'birthday': accountData['birthday'],
      'nameKor': accountData['nameKor'],
      'role': accountData['role'],
      'separate': accountData['separate'],
      'sex': accountData['sex'],
      'studentId': accountData['studentId'],
      'uid': accountData['uid']
    }
    KSAppService.patchReq(
      API_PATCH_ACCOUNT,
      payload,
      function (data) {
        if (data['status'] == HTTP_STATUS_OK && data['data']['success']) {
          KSAppService.debug('AccountManagementController', 'patchAccount', 'account patched: ' + JSON.stringify(data))
          KSAppService.showToast('Account patched successfully', TOAST_SHOW_LONG)
          getAccountList()
        } else {
          throw null
        }
      },
      function (error) {
        KSAppService.error('AccountManagementController', 'patchAccount', 'cannot patch account: ' + JSON.stringify(error))
        KSAppService.showToast('Failed to patch account', TOAST_SHOW_LONG)
      })
  }

  function getAccountList () {
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function (idToken) {
      // Send token to your backend via HTTPS
      // ...
      KSAppService.setToken(idToken)
      var payload = {}
      KSAppService.getReq(API_GET_ACCOUNTS_LIST,
        payload,
        function (data) {
          if (data['status'] == HTTP_STATUS_OK) {
            KSAppService.debug('AccountManagementController', 'getAccountList', 'accounts list: ' + JSON.stringify(data))
            initAccountList(data)
          } else {
            throw null
          }
        },
        function (error) {
          KSAppService.error('AccountManagementController', 'getAccountList', 'failed get accounts list: ' + JSON.stringify(error))
          KSAppService.showToast('Failed to get account list', TOAST_SHOW_LONG)
        })
    }).catch(function (error) {
      // Handle error
      KSAppService.error('AccountManagementController', 'getAccountList', 'failed generate token: ' + JSON.stringify(error))
      KSAppService.showToast('Failed generate token', TOAST_SHOW_LONG)
    })
  }

  function initAccountList (data) {
    $scope.accountList = data['data']
  }

  function accountDetailDialogController ($scope, $mdDialog, accountData, roleList) {
    KSAppService.info('accountDetailDialogController', 'accountDetailDialogController', 'init')

    $scope.user = accountData
    $scope.roleList = roleList
    $scope.emailVerified = false

    isAccountVerified($scope.user['uid'])

    $scope.hide = function () {
      $mdDialog.cancel()
    }

    $scope.cancel = function () {
      $mdDialog.cancel()
    }

    $scope.submit = function () {
      KSAppService.debug('accountDetailDialogController', 'submit', 'user data: ' + JSON.stringify($scope.user))
      $mdDialog.hide($scope.user)
    }

    function isAccountVerified (uid) {
      var payload = {
        uid: uid
      }

      KSAppService.getReq(
        API_IS_ACCOUNT_VERIFIED,
        payload,
        function (data) {
          KSAppService.debug('accountDetailDialogController', 'isAccountVerified', 'verified result received: ' + JSON.stringify(data))
          initAccountVerified(data)
        },
        function (error) {
          KSAppService.error('accountDetailDialogController', 'isAccountVerified', 'cannot check user verified: ' + JSON.stringify(error))
          KSAppService.showToast('Cannot check user is verified', TOAST_SHOW_LONG)
        })
    }

    function initAccountVerified (data) {
      $scope.emailVerified = data['data']['status']
    }
  }
})
