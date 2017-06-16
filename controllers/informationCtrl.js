'use strict';

function InformationCtrl($scope, $rootScope, localStorageService, $state) {

    $scope.errorMsg = $state.params.errorMsg;
    $scope.timeOutMsg = $state.params.timeOutMsg;

    $rootScope.title = "Instructions";
    $scope.user = localStorageService.get('authInfo');

    $scope.startTest = function () {
        $state.go('questions');
    }

    $scope.backToDashboard = function () {
        $state.go('dashboard');
    }

}

controllerModule.
	controller('InformationCtrl', [
		'$scope', '$rootScope', 'localStorageService', '$state', InformationCtrl
	]);


