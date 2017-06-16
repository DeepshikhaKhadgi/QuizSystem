serviceModule.factory('QuestionService', ['$http', 'configuration', GetAllQuestions])


function GetAllQuestions($http, configuration) {

    var services = {}
    services.getQuestions = function (id) {
        return $http.get(configuration.API_URL + 'assessment/' + id)
    }
    return services;
}