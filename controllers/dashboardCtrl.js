'use strict';

function DashboardCtrl($scope, $rootScope, localStorageService) {
    var authData = localStorageService.get('authInfo');
    if (authData) {
        $scope.user = authData.userName;
    }
    $rootScope.title = "Dashboard";

}

controllerModule.
	controller('DashboardCtrl', [
		'$scope', '$rootScope', 'localStorageService', DashboardCtrl
	]);



