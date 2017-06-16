serviceModule.factory('SubmitService', ['$http', 'configuration', SubmitService])


function SubmitService($http, configuration) {

    var submitServices = {};

    submitServices.submitAllResponses = function (responses) {
        return $http
          .post(configuration.API_URL + 'responseAllAnswers', responses);

    }

    submitServices.submitResponse = function (response) {
        return $http
          .post(configuration.API_URL + 'responseAnswers', response);

    }
    return submitServices;
}