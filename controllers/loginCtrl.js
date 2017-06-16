'use strict';

function LoginCtrl($scope, $rootScope, $state,localStorageService, AuthService) {

    $rootScope.title = "Login";
    $scope.loginModel = new LoginModel();
    $scope.loginModel.UserName = '';
    $scope.loginModel.Password = '';
    $scope.loginModel.AuthMsg = 'Incorrect credentials !!!!!';
    var storageKey = 'authInfo';

    $scope.login = function () {
        $('#loginfrm').data('formValidation').validate();
       
        AuthService.login($scope.loginModel).then(function (response) {
            // assumes if ok, response is an object with some data, if not, a string with error
            // customize according to your api
            if (response.data.msg != "Success") {
                 $('#box').notify('Invalid UserName or Password!!!!');
                $scope.loginModel.AuthMsg = 'Incorrect Credentials !!!!!.';
            } else {
                localStorageService.set(storageKey, { token: response.data.tokenKey, userName: response.data.respondentName, respondentId: response.data.respondentID, assessmentId: response.data.assessmentID  });
                $state.go('dashboard');
            }
        }, function (x) {
            $scope.loginModel.AuthMsg = 'Incorrect credentials.';
        });

    }

   
}

controllerModule.
	controller('LoginCtrl', [
		'$scope', '$rootScope', '$state', 'localStorageService', 'AuthService', LoginCtrl
	]);

