app.controller('DefaultPageController', function ($scope, $http, $mdToast, $mdSidenav, $window, $mdDialog, KSAppService) {
  KSAppService.info('DefaultPageController', 'DefaultPageController', 'init')

  $scope.onDonateBtnClicked = function () {
    KSAppService.info('DefaultPageController', 'onDonateBtnClicked', 'yea! donate!')

    $mdDialog.show({
      controller: donateDialogController,
      templateUrl: 'assets/view/dialog/donate.html',
      parent: angular.element(document.body),
      // targetEvent: ev,
      clickOutsideToClose: true
    })
      .then(function () {
        KSAppService.debug('DefaultPageController', 'onDonateBtnClicked', 'donate ok')
      }, function () {
        KSAppService.info('DefaultPageController', 'onDonateBtnClicked', 'you just canceled donate dialog')
      })
  }

  $scope.onLoad = function () {
      // 플러스친구 친구추가 버튼을 생성합니다.
      Kakao.PlusFriend.createAddFriendButton({
          container: '#kakaoBtn',
          plusFriendId: '_wkxjxoxl' // 플러스친구 홈 URL에 명시된 id로 설정합니다.
      });
  }

  function donateDialogController ($scope, $mdDialog) {
    $scope.data = {}
    $scope.donateMoney = 5

    $scope.hide = function () {
      $mdDialog.cancel()
    }

    $scope.cancel = function () {
      $mdDialog.cancel()
    }

    $scope.submit = function () {
      // $scope.data["signIn"] = isSignIn
      // KSAppService.debug("ToolbarController", "signInDialogController-submit", "user data: " + JSON.stringify($scope.data))
      $mdDialog.hide()
    }
  }
})
