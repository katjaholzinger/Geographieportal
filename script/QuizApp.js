angular.module('QuizApp', ['ngRoute', 'QuizService', 'ngSanitize'])

.controller('mainCtrl', function($scope, $http, $location, QuizLogic) {

        activeUrl = $location.absUrl().slice(($location.absUrl().search('site/') + 5));
        if (activeUrl == "test_berlin.html" || activeUrl == "test_berlin.html#/") {
            url = QuizLogic.url(0);
        } else {
            if (activeUrl == "test_shell.html" || activeUrl == "test_shell.html#/") {
                url = QuizLogic.url(2);
            } else {
                url = QuizLogic.url(1);
            }
        }
        $scope.formData = {};

        // when landing on the page, get all questions and show them
        $http.get(url.questions)
            .success(function(data) {
                //Select Questions
                $scope.questions = QuizLogic.selectRandom(data, 10);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        $http.get(url.answers)
            .success(function(data) {
                $scope.answers = QuizLogic.selectRandom(data, 1000);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

        // when submitting the add form, send the text to the node API
        $scope.createQuestion = function() {
            if ($scope.formData.newQuestion) {

                $http.post(url.questionPost, $scope.formData.newQuestion)
                    .success(function(data) {
                        $scope.allquestions = data;
                        angular.forEach($scope.allquestions, function(question) {
                            if (question.text == $scope.formData.newQuestion.text) {
                                $scope.questions.push(question);
                            }
                        })
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });
                var newQuestionId = "";
                $http.get(url.questionGet + encodeURIComponent($scope.formData.newQuestion.text))
                    .success(function(data) {
                        var newQuestionId = data._id;
                        angular.forEach($scope.formData.newAnswers, function(value) {
                            if (value.text) {
                                var answer = new Object;
                                answer.text = value.text;
                                if (value.bool) { answer.bool = value.bool; } else { answer.bool = false; }
                                answer.fragenId = newQuestionId;
                                $http.post(url.answer, answer)
                                    .success(function(data) {
                                        $scope.formData = {}; // clear the form so our user is ready to enter another
                                        $scope.formData.newAnswers = [{ id: 'a1' }, { id: 'a2' }];
                                        $scope.answers = data;
                                    })
                                    .error(function(data) {
                                        console.log('Error: ' + data);
                                    });
                            }
                        });
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });
            } else {
                alert("Bitte geben sie eine Frage ein.");
            }

        };

        // delete a Question
        $scope.deleteQuestion = function(id) {
            var bool = window.confirm("Wollen sie die Frage endgültig löschen?")
            if (bool) {
                $http.delete(url.questionDelete + id)
                    .success(function(data) {
                        //Antworten raussuchen mit selber fragenID
                        $scope.answers.forEach(function(answer) {
                            if (answer.fragenId == id) {
                                $http.delete(url.answerDelete + answer._id)
                                    .success(function(data) {
                                        $scope.answers = data;
                                    })
                                    .error(function(data) {
                                        console.log('Error: ' + data);
                                    });
                            }
                        })
                        $scope.questions = data;
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });
            };

            // delete a Answer
            $scope.deleteAnswer = function(id) {
                $http.delete(url.answerDelete + id)
                    .success(function(data) {
                        $scope.answers = data;
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });
                var i = 0;
                $scope.AnswersEdit.forEach(function(answer) {
                    if (answer._id == id) {
                        delete $scope.AnswersEdit[i];
                    } else {
                        i++;
                    }
                })
            }
        };

        // update a Question
        $scope.updateQuestion = function() {
            $http.post(url.questionUpdate, $scope.QuestionEdit)
                .success(function(data) {
                    //Antworten raussuchen mit selber fragenID
                    $scope.AnswersEdit.forEach(function(answer) {
                        answer.fragenID = $scope.QuestionEdit._id;
                        $http.post(url.answerUpdate, answer)
                            .success(function(data) {
                                $scope.answers = data;
                            })
                            .error(function(data) {
                                console.log('Error: ' + data);
                            });
                    })
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
            $location.path('#/');
        };

        $scope.editQuestion = function(id) {
            $scope.questions.forEach(function(question) {
                if (question._id == id) {
                    $scope.QuestionEdit = question;
                }
            });
            $scope.AnswersEdit = [];
            $scope.answers.forEach(function(answer) {
                if (answer.fragenId == id) {
                    $scope.AnswersEdit.push(answer);
                }
            })
            $location.path('/edit');
        };

        $scope.formData.newAnswers = [{ id: 'a1' }, { id: 'a2' }];

        $scope.addAnswer = function() {
            var newItemNo = $scope.formData.newAnswers.length + 1;
            $scope.formData.newAnswers.push({ 'id': newItemNo });
        };

        $scope.EditaddAnswer = function() {
            var newItemNo = $scope.AnswersEdit.length + 1;
            $scope.AnswersEdit.push({ 'id': newItemNo });
        };


        //Quiz Handler
        $scope.checkAnswers = function() {
            QuizLogic.checkAnswers($scope.questions, $scope.answers);
        }

    })
    .config(function($routeProvider) {
        $routeProvider
            .when('/', { templateUrl: 'partials/newQuestion.html' })
            .when('/edit', { templateUrl: 'partials/editQuestion.html' })
            .otherwise({ redirectTo: '/' });
    })