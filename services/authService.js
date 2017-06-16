'use strict';

serviceModule
	.factory('AuthService', [
		'$http', 'configuration', 'localStorageService', '$q', AuthService
	]);

function AuthService($http, configuration, localStorageService, $q) {
    var storageKey = 'authInfo';
    var authService = {};
    var currentUser = null;

    var authInfo = localStorageService.get(storageKey);
    if (authInfo) {
        //performLogin(authInfo);
    }

    authService.login = function (credentials) {
        return $http
            .post(configuration.API_URL + 'login', credentials);


    };

    //authService.login = function (loginData) {

    //    var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

    //    var deferred = $q.defer();

    //    $http.post('http://localhost:4649/token', data,{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

    //        localStorageService.set(storageKey, { token: response.access_token, userName: loginData.userName });

    //        //_authentication.isAuth = true;
    //        //_authentication.userName = loginData.userName;

    //        deferred.resolve(response);

    //    }).error(function (err, status) {
    //       // _logOut();
    //        deferred.reject(err);
    //    });

    //    return deferred.promise;

    //};



    authService.getCurrentUser = function () {
        return currentUser;
    };

    //function performLogin(info) {
    //    session.create(info.name, info.userRole, info.accessToken);
    //    $http.defaults.headers.common['Authorization'] = "bearer " + info.accessToken;
    //    currentUser = { name: info.name, role: info.userRole };
    //};

    authService.logout = function () {
        // session.destroy();
        localStorageService.set(storageKey, null);
    };

    authService.isAuthenticated = function () {
        var user = localStorageService.get('authInfo');
        if (!user)
            return false;
        else
            return true;
    };

    authService.isAuthorized = function (authorizedRoles) {
        if (!angular.isArray(authorizedRoles)) {
            authorizedRoles = [authorizedRoles];
        }
        return (authService.isAuthenticated());
    };

    return authService;
}