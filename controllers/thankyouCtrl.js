'use strict';

function ThankyouCtrl($scope, $rootScope, localStorageService, $state) {
    localStorageService.remove('authInfo');
    $rootScope.title = "Thank You";

    $scope.timeOutMsg = $state.params.timeOutMsg;
    $scope.errorMsg = $state.params.errorMsg;

    $scope.startAgain = function () {
        $state.go('login');
    }

}

controllerModule.
	controller('ThankyouCtrl', [
		'$scope', '$rootScope', 'localStorageService', '$state', ThankyouCtrl
	]);
