serviceModule.factory('AssessmentTimeEntryService', ['$http', 'configuration', PostAssessmentTime])


function PostAssessmentTime($http, configuration) {

    var services = {}
    services.logAssessmentTime = function (data) {

        return $http
            .post(configuration.API_URL + 'response', data);

    }
    return services;
}