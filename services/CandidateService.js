'use strict';

function CandidateService($http, $rootScope, configuration) {

    var service = {};
    service.get = function (resource) {
        return $http({ method: 'GET', url: configuration.API_URL + resource });
    }
    service.login = function (candidateModel) {
        //return $http({ method: "POST", data: candidateModel, url: configuration.API_URL + "login/" });
        return true;
    }

    return service;
}

serviceModule
	.service('CandidateService', [
		'$http', '$rootScope', 'configuration', CandidateService
	]);