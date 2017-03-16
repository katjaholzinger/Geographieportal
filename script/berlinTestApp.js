angular.module('berlinTest', ['ngRoute'])

.controller('mainCtrl', function($scope, $http, $location) {
        $scope.formData = {};

        // when landing on the page, get all questions and show them
        $http.get('/api/questions')
            .success(function(data) {
                $scope.questions = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
        $http.get('/api/answers')
            .success(function(data) {
                $scope.answers = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });

        // when submitting the add form, send the text to the node API
        $scope.createQuestion = function() {
            if ($scope.formData.newQuestion) {


                $http.post('/api/question', $scope.formData.newQuestion)
                    .success(function(data) {
                        $scope.questions = data;
                    })
                    .error(function(data) {
                        console.log('Error: ' + data);
                    });
                var newQuestionId = "";
                $http.get('/api/question/' + encodeURIComponent($scope.formData.newQuestion.text))
                    .success(function(data) {
                        var newQuestionId = data._id;
                        angular.forEach($scope.formData.newAnswers, function(value) {
                            if (value.text) {
                                var answer = new Object;
                                answer.text = value.text;
                                if (value.bool) { answer.bool = value.bool; } else { answer.bool = false; }
                                answer.fragenId = newQuestionId;
                                $http.post('/api/answer', answer)
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
            $http.delete('/api/question_delete/' + id)
                .success(function(data) {
                    //Antworten raussuchen mit selber fragenID
                    $scope.answers.forEach(function(answer) {
                        if (answer.fragenId == id) {
                            $http.delete('/api/answer_delete/' + answer._id)
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
            $http.delete('/api/answer_delete/' + id)
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
        };

        // update a Question
        $scope.updateQuestion = function() {
            $http.post('/api/question_update', $scope.QuestionEdit)
                .success(function(data) {
                    //Antworten raussuchen mit selber fragenID
                    $scope.AnswersEdit.forEach(function(answer) {
                        answer.fragenID = $scope.QuestionEdit._id;
                        $http.post('/api/answer_update', answer)
                            .success(function(data) {
                                $scope.answers = data;
                            })
                            .error(function(data) {
                                console.log('Error: ' + data);
                            });
                    })
                    $scope.questions = data;
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
            //Die Antworten müssen durchlaufen werden, für jede Frage wird ein Array der richtigen Antworten (ID) (antworten.bool ==1 )zurückgegeben
            var boolArray = [];
            //scope.questions und scope.answers müssen durchlaufen werden
            $scope.questions.forEach(function(question) {
                var activequestion = question
                var arrayright = [];
                $scope.answers.forEach(function(answer) {
                    if (answer.fragenId == activequestion._id) {
                        if (answer.bool) {
                            arrayright.push(answer._id)
                        }
                    }
                })
                boolArray.push(arrayright);
            })


            quiz = new Quiz('quiz', boolArray);


            if (quiz.checkAnswers()) {
                document.getElementById('quiz-result').innerHTML = "Du hast " + quiz.result.score.toString() + " von " + quiz.result.totalQuestions.toString() + " Frage(n) richtig beantwortet."

                quiz.highlightResults(handleAnswers);
            }
        };
        /** Callback for Quiz.highlightResults. Highlights the correct answers of incorrectly answered questions */
        function handleAnswers(question, no, correct) {
            if (!correct) {
                var answers = question.getElementsByTagName('input');
                for (var i = 0; i < answers.length; i++) {
                    switch (answers[i].type) {
                        case "checkbox":
                        case "radio":
                            if (quiz.answers[no].indexOf(answers[i].value) > -1) {
                                answers[i].parentNode.classList.add(quiz.Classes.CORRECT);
                            }
                            break;
                        default:
                            var correctAnswer = document.createElement('span');
                            correctAnswer.classList.add(quiz.Classes.CORRECT);
                            correctAnswer.classList.add(quiz.Classes.TEMP);
                            correctAnswer.innerHTML = quiz.answers[no];
                            correctAnswer.style.marginLeft = '10px';
                            answers[i].parentNode.insertBefore(correctAnswer, answers[i].nextSibling);
                    }
                }
            }
        }
    })
    .config(function($routeProvider) {
        $routeProvider
            .when('/', { templateUrl: 'partials/newQuestion.html' })
            .when('/edit', { templateUrl: 'partials/editQuestion.html' })
            .otherwise({ redirectTo: '/' });
    })