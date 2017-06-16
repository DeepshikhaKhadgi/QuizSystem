controllerModule.controller('QuestionCtrl', [

 '$scope',
 '$rootScope',
 '$state',
 'localStorageService',
 '$http',
 '$interval',
 'QuestionService',
 'AssessmentTimeEntryService',
 'SubmitService',
 'ngProgressLite',
 '$cookies',
 QuestionCtrl
]);

function QuestionCtrl($scope, $rootScope, $state, localStorageService, $http, $interval, QuestionService, AssessmentTimeEntryService, SubmitService, ngProgressLite, $cookies) {
    ngProgressLite.start();
    $rootScope.title = 'Questions';    
    $scope.responseAnswerId = [];
    var count = 0;
    var authData = localStorageService.get('authInfo');

    if (authData) {
        $scope.user = authData.userName;
        $scope.respondentId = authData.respondentId;
        $scope.assessmentId = authData.assessmentId;
    }
    $scope.loadQuestions = function () {

        $scope.sessionAssessmentData = $cookies.get('questionstate');

        var data = {
            assessmentId: $scope.assessmentId,
            //respondentId: $scope.respondentId
            respondentId: 2
        };

        AssessmentTimeEntryService.logAssessmentTime(data).then(function (res) {
            $scope.responseId = res.data.data.ResponseID;

        })
         .catch(function (response) {
             ngProgressLite.done();
             $scope.responseId = null;
             var errMsg = {
                 'errorMsg': 'Sorry response platform could not be set!! Please try again.',
                 'timeOutMsg': ''
             };
             $state.go('information', errMsg);

         })
         .finally(function () {
             ngProgressLite.done();
         });

        QuestionService.getQuestions($scope.assessmentId).then(function (res) {

            //if ($scope.sessionAssessmentData) {
            //    $scope.allQuestions = $scope.sessionAssessmentData;
            //} else {
            //    $scope.allQuestions = res.data.data.AssessmentQuestions;
            //}
            $scope.allQuestions = res.data.data.AssessmentQuestions;
            $scope.totalItems = $scope.allQuestions.length;
            $scope.itemsPerPage = 1;
            $scope.currentPage = 1;
            $scope.mode = 'quiz';
            $rootScope.title = 'Exam';
            $scope.duration = res.data.data.AssessmentDuration;

            var tick = function () {
                if ($scope.duration > 60) {
                    var hr = new String($scope.duration / 60);
                    var min = ($scope.duration % 60);
                    hr = hr.split('.');
                    $scope.hr = hr[0];
                    $scope.min = new String(min - 1);
                } else {
                    $scope.hr = 0;
                    $scope.min = $scope.duration - 1;
                }
                $scope.clock = new Date(1999, 1, 2, $scope.hr, $scope.min, '60');
                $scope.tempClock = $scope.hr + ':' + $scope.min + ':60';
            }
            tick();
            var updateDate = function () {
                dt2 = $scope.tempClock.split(':');
                var hr = parseInt(dt2[0]);
                var min = parseInt(dt2[1]);
                var sec = parseInt(dt2[2]);
                sec = sec - 1;
                if (sec == 0) {
                    min = min - 1;
                    sec = 59;
                }
                if (min == 0 && hr != 0) {
                    hr = hr - 1;
                    min = 59;
                }
                if (hr == 0 && min == 0 && sec == 1) {
                    $scope.onNext($scope.currentPage + 1, null, true)
                    //submit
                    // var c = 'submit';
                }
                if (min == 5 && sec > 52) {
                    $('#box').notify('You have around 5 minutes remaining to complete your exam !!!!', { position: "right" });
                    $scope.notifyUser = true;
                    $scope.displaynormal = false;
                } else {
                    $scope.notifyUser = false;
                    $scope.displaynormal = true;
                }
                $scope.tempClock = hr + ':' + min + ':' + sec;
                $scope.clock = new Date(1999, 1, 1, hr, min, sec);
            }
            $interval(updateDate, 1000);

            $scope.$watch('currentPage + itemsPerPage', function () {
                var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
                 end = begin + $scope.itemsPerPage;
                $scope.filteredQuestions = $scope.allQuestions.slice(begin, end);
            });
        }, function (x) {
            var errMsg = {
                'errorMsg': 'Sorry questions could be loaded at the moment. Please try again!!',
                'timeOutMsg': ''
            };
            $state.go('information', errMsg);           
        });
    }

    $scope.goTo = function (index) {
        if (!localStorageService.get('authInfo')) {
            $state.go('login');
        } else {
            if (index > 0 && index <= $scope.totalItems) {
                $scope.currentPage = index;
            }
        }
    }

    $scope.onSelect = function (question, option) {
        if (question.QuestionType.QuestionTypeID == 1) {
            question.Options.forEach(function (element, index, array) {
                if (element.OptionID != option.OptionID) {
                    element.Selected = false;
                }
            });
        }
    }
   
    //$scope.checkanswerstatus = function () {
    //    var notify = false;
    //    var countSelectedOption = 0;
    //        $scope.allQuestions.forEach(function (q, index) {
    //            countSelectedOption = 0;
    //            if (q.QuestionType.QuestionTypeID == 1) {
    //                q.Options.forEach(function (o, index) {
    //                    if (o.Selected) {
    //                        countSelectedOption++;
    //                    }                        
    //                });
    //                if (countSelectedOption == 0) {
    //                    notify = true;
    //                }
    //            }
    //        });
  
    $scope.onNext = function (i, event, timeUpStatus) {

        if (!localStorageService.get('authInfo')) {
            $state.go('login');
        } else {
            var answer = {};
            var optionList = [];
            var selectedOptionId = null;
            i = i - 2;
            if ($scope.allQuestions[i].QuestionType.QuestionTypeID == 1 || $scope.allQuestions[i].QuestionType.QuestionTypeID == 2) {
                $scope.allQuestions[i].Answer = null;
                $scope.allQuestions[i].Options.forEach(function (o, index) {
                    if (o.Selected) {
                        selectedOptionId = o.OptionID;
                        optionList.push({
                            'OptionID': selectedOptionId
                        });
                    }
                });
            } else if ($scope.allQuestions[i].QuestionType.QuestionTypeID == 3) {
                optionList = null;
            }
            answer = {
                'ResponseID': $scope.responseId,
                'ResponseAnswerID': $scope.responseAnswerId[i],
                'QuestionID': $scope.allQuestions[i].QuestionID,
                'Answer': $scope.allQuestions[i].Answer,
                'ResponseAnswerOptions': optionList
            };
            $cookies.put('questionstate', $scope.allQuestions);
            SubmitService.submitResponse(answer).then(function (res) {
                if (timeUpStatus) {
                    var data = {
                        assessmentId: $scope.assessmentId,
                        respondentId: 2,
                        ResponseSubmitDateTime: getDateTime()
                    };
                    AssessmentTimeEntryService.logAssessmentTime(data).then(function (res) {
                        $scope.submitTime = true;

                    }, function (x) {
                        $scope.submitTime = false;

                    });
                    localStorageService.remove('authInfo');

                    var errMsg = {
                        'errorMsg': '',
                        'timeOutMsg': 'Your Time is Up'
                    };
                    $state.go('thankyou', errMsg);
                    
                }
                if (event.target.id == 'submitBtn') {
                    var data = {
                        assessmentId: $scope.assessmentId,
                        respondentId: 2,
                        ResponseSubmitDateTime: getDateTime()
                    };
                    AssessmentTimeEntryService.logAssessmentTime(data).then(function (res) {
                        $scope.submitTime = true;
                        localStorageService.remove('authInfo');
                        $state.go('thankyou');

                    }, function (x) {
                        $scope.responseId = null;
                        $scope.submitTime = false;
                        var errMsg = {
                            'errorMsg': 'Sorry your time could not be submitted!!',
                            'timeOutMsg': ''
                        };
                        $state.go('information', errMsg);
                       
                    });

                }

                $scope.responseAnswerId[i] = res.data.data.responseAnswerID;
            }, function (x) {
                if (event.target.id == 'submitBtn') {
                    var errMsg = {
                        'errorMsg': 'Sorry your answers were not submitted!! \n Please start again!!',
                        'timeOutMsg': ''
                    };
                    $state.go('information', errMsg);                   
                }

            });
        }
    }
    $scope.showPrevious = function () {
        if ($scope.currentPage > 1)
            return true;
        else
            return false;
    }
    $scope.showSubmit = function () {
        if ($scope.currentPage == $scope.totalItems)
            return true;
        else
            return false;
    }
    $scope.showNext = function () {
        if ($scope.currentPage != $scope.totalItems)
            return true;
        else
            return false;
    }
    function getDateTime() {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        var millisecond = now.getMilliseconds();
        if (month.toString().length == 1) {
            var month = '0' + month;
        }
        if (day.toString().length == 1) {
            var day = '0' + day;
        }
        if (hour.toString().length == 1) {
            var hour = '0' + hour;
        }
        if (minute.toString().length == 1) {
            var minute = '0' + minute;
        }
        if (second.toString().length == 1) {
            var second = '0' + second;
        }
        if (millisecond.toString().length == 1) {
            var millisecond = '0' + millisecond;
        }
        var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second + '.' + millisecond;
        return dateTime;
    }
}