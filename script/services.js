var QuizService = angular.module('QuizService', [])
    .service('QuizLogic', function() {
        this.url = function(c) {
            if (c == 0) {
                url = {};
                url.questionPost = '/api/question';
                url.questionGet = '/api/question/';
                url.questions = '/api/questions';
                url.answer = '/api/answer';
                url.answers = '/api/answers';
                url.questionDelete = '/api/question_delete/';
                url.questionUpdate = '/api/question_update/';
                url.answerDelete = '/api/answer_delete/';
                url.answerUpdate = '/api/answer_Update/';
                return url;
            };
            if (c == 1) {
                url = {};
                url.questionPost = '/api/question_dtschl';
                url.questionGet = '/api/question_dtschl/';
                url.questions = '/api/questions_dtschl';
                url.answer = '/api/answer_dtschl';
                url.answers = '/api/answers_dtschl';
                url.questionDelete = '/api/question_delete_dtschl/';
                url.questionUpdate = '/api/question_update_dtschl/';
                url.answerDelete = '/api/answer_delete_dtschl/';
                url.answerUpdate = '/api/answer_Update_dtschl/';
                return url;
            };
            if (c == 2) {
                url = {};
                url.questionPost = '/api/Shellquestion';
                url.questionGet = '/api/Shellquestion/';
                url.questions = '/api/Shellquestions';
                url.answer = '/api/Shellanswer';
                url.answers = '/api/Shellanswers';
                url.questionDelete = '/api/Shellquestion_delete/';
                url.questionUpdate = '/api/Shellquestion_update/';
                url.answerDelete = '/api/Shellanswer_delete/';
                url.answerUpdate = '/api/Shellanswer_Update/';
                return url;
            };
        }

        //Es kann eine zufälligie Auswahl aus den Daten gemacht werden, oder einfach die Datensätze sortieren, wenn n> Länge der Daten
        this.selectRandom = function(data, n) {
            questions = [];
            var min = 0;
            var max = data.length;
            if (max > n) {
                number = n;
            } else {
                number = max;
            }
            console.log(number);

            // Select Random
            for (i = 0; i < number; i++) {
                var x = Math.floor(Math.random() * (max - min)) + min;
                if (data[x] == undefined) {
                    i--
                } else {
                    questions.push(data[x]);
                    delete data[x];
                }
            }
            return questions;
        };
        this.handleAnswers = function(question, no, correct) {
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
        };
        this.checkAnswers = function(questions, answers) {
            //Die Antworten müssen durchlaufen werden, für jede Frage wird ein Array der richtigen Antworten (ID) (antworten.bool ==1 )zurückgegeben
            var boolArray = [];
            //questions und answers müssen durchlaufen werden
            questions.forEach(function(question) {
                var activequestion = question
                var arrayright = [];
                answers.forEach(function(answer) {
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

                quiz.highlightResults(this.handleAnswers);
            }

        }
    });