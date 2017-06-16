'use strict';

serviceModule
	.service('SessionService', [SessionService]);

function SessionService() {

    var sessionService = {};

    sessionService.create = function (userName, userRole, accessToken) {
        sessionService.userName = userName;
        sessionService.userRole = userRole;
        sessionService.accessToken = accessToken;
    };

    sessionService.destroy = function () {
        sessionService.userName = null;
        sessionService.accessToken = null;
        sessionService.userRole = null;
    };

    return sessionService;
}