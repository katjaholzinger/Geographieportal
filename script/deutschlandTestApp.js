angular.module('deutschlandTest', [])

.controller('mainCtrl', function($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all questions and show them
    $http.get('/api/questions_dtschl')
        .success(function(data) {
            $scope.questions = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    $http.get('/api/answers_dtschl')
        .success(function(data) {
            $scope.answers = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createQuestion = function() {
        if ($scope.formData.newQuestion) {


            $http.post('/api/question_dtschl', $scope.formData.newQuestion)
                .success(function(data) {
                    $scope.questions = data;
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });
            var newQuestionId = "";
            $http.get('/api/question_dtschl/' + encodeURIComponent($scope.formData.newQuestion.text))
                .success(function(data) {
                    var newQuestionId = data._id;
                    angular.forEach($scope.formData.newAnswers, function(value) {
                        if (value.text) {
                            var answer = new Object;
                            answer.text = value.text;
                            if (value.bool) { answer.bool = value.bool; } else { answer.bool = false; }
                            answer.fragenId = newQuestionId;
                            $http.post('/api/answer_dtschl', answer)
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
        $http.delete('/api/question_delete_dtschl/' + id)
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

    $scope.formData.newAnswers = [{ id: 'a1' }, { id: 'a2' }];

    $scope.addAnswer = function() {
        var newItemNo = $scope.formData.newAnswers.length + 1;
        $scope.formData.newAnswers.push({ 'id': newItemNo });
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
});