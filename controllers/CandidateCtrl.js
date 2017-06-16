'use strict';

function CandidateCtrl($scope, $rootScope, $state, localStorageService) {

    $scope.user = localStorageService.get('authInfo');
    $rootScope.title = "Dashboarad";

    $scope.takeTest = function () {
        $state.go('information');
    }
}

controllerModule.
	controller('CandidateCtrl', [
		'$scope', '$rootScope', '$state', 'localStorageService', CandidateCtrl
	]);



