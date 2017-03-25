// server.js
// set up ========================
var express = require('express');
var app = express(); // create our app w/ express
var mongoose = require('mongoose'); // mongoose for mongodb
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================

mongoose.connect('mongodb://localhost/questionDatabase'); // connect to mongoDB database

app.use(express.static(__dirname + '')); // set the static files location /public/img will be /img for users
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ 'extended': 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// define model =================
var Question = mongoose.model('Question', {
    text: String
});
var Answer = mongoose.model('Answer', {
    text: String,
    fragenId: String,
    bool: Boolean
});

var QuestionDtschl = mongoose.model('QuestionDtschl', {
    text: String
});
var AnswerDtschl = mongoose.model('AnswerDtschl', {
    text: String,
    fragenId: String,
    bool: Boolean
});

var ShellQuestion = mongoose.model('ShellQuestion', {
    text: String
});
var ShellAnswer = mongoose.model('ShellAnswer', {
    text: String,
    fragenId: String,
    bool: Boolean
});

// listen (start app with node server.js) ======================================
app.listen(8765);
console.log("App listening on port 8765");

// routes ======================================================================

// api ---------------------------------------------------------------------
// get all Questions
app.get('/api/questions', function(req, res) {

    // get and return all the questions after you create another
    Question.find(function(err, questions) {
        if (err)
            res.send(err)
        res.json(questions);
    });
});

// get Question by Text
app.get('/api/question/:text', function(req, res) {

    // get and return all the questions after you create another
    Question.findOne({ text: req.params.text }, function(err, questions) {
        if (err)
            res.send(err)
        res.json(questions);
    }).sort({ _id: -1 });
});

// create question and send back all questions after creation
app.post('/api/question', function(req, res) {

    // create a question, information comes from AJAX request from Angular
    Question.create({
        text: req.body.text
    }, function(err, question) {
        if (err)
            res.send(err);

        // get and return all the questions after you create another
        Question.find(function(err, questions) {
            if (err)
                res.send(err)
            res.json(questions);
        });
    });

});

// delete a question
app.delete('/api/question_delete/:_id', function(req, res) {
    Question.remove({
        _id: req.params._id
    }, function(err, question) {
        if (err)
            res.send(err);

        // get and return all the questions after you create another
        Question.find(function(err, questions) {
            if (err)
                res.send(err)
            res.json(questions);
        });
    });
});


// get all Answers
app.get('/api/answers', function(req, res) {

    // get and return all the answers
    Answer.find(function(err, answers) {
        if (err)
            res.send(err)
        res.json(answers);
    });
});

// create answer and send back all questions after creation
app.post('/api/answer', function(req, res) {
    // create a answer, information comes from AJAX request from Angular
    Answer.create({
        //boolean und FragenIDmuss extraiert werden aus dem Body
        text: req.body.text,
        fragenId: req.body.fragenId,
        bool: req.body.bool
    }, function(err, answer) {
        if (err)
            res.send(err);

        // get and return all the answers after you create another
        Answer.find(function(err, answers) {
            if (err)
                res.send(err)
            res.json(answers);
        });
    });

});

// delete a answer
app.delete('/api/answer_delete/:_id', function(req, res) {
    Answer.remove({
        _id: req.params._id
    }, function(err, answer) {
        if (err)
            res.send(err);

        // get and return all the answers after you create another
        Answer.find(function(err, answers) {
            if (err)
                res.send(err)
            res.json(answers);
        });
    });
});

// update a question
app.post('/api/question_update', function(req, res) {
    console.log(req);
    Question.update({ _id: req.body._id }, {
        text: req.body.text
    }, function(err, question) {
        if (err)
            res.send(err);

        // get and return all the answers after you create another
        Question.find(function(err, questions) {
            if (err)
                res.send(err)
            res.json(questions);
        });
    });
});

// update a answer
app.post('/api/answer_update', function(req, res) {
    Answer.findOne({ _id: req.body._id }, function(err, answer) {
        console.log(answer);
        if (answer === null) {
            // create a answer, information comes from AJAX request from Angular
            Answer.create({
                //boolean und FragenIDmuss extraiert werden aus dem Body
                text: req.body.text,
                fragenId: req.body.fragenID,
                bool: req.body.bool
            }, function(err, answer) {
                if (err)
                    res.send(err);

                // get and return all the answers after you create another
                Answer.find(function(err, answers) {
                    if (err)
                        res.send(err)
                    res.json(answers);
                });
            })
        } else {
            Answer.update({ _id: req.body._id }, {
                text: req.body.text,
                bool: req.body.bool
            }, function(err, answer) {
                if (err)
                    res.send(err);

                // get and return all the answers after you create another
                Answer.find(function(err, answers) {
                    if (err)
                        res.send(err)
                    res.json(answers);
                });
            });
        }
    });

});

//-----DeutschlandQuiz

// get all Questions
app.get('/api/questions_dtschl', function(req, res) {

    // get and return all the questions after you create another
    QuestionDtschl.find(function(err, questions) {
        if (err)
            res.send(err)
        res.json(questions);
    });
});

// get Question by Text
app.get('/api/question_dtschl/:text', function(req, res) {

    // get and return all the questions after you create another
    QuestionDtschl.findOne({ text: req.params.text }, function(err, questions) {
        if (err)
            res.send(err)
        res.json(questions);
    }).sort({ _id: -1 });
});

// create question and send back all questions after creation
app.post('/api/question_dtschl', function(req, res) {

    // create a question, information comes from AJAX request from Angular
    QuestionDtschl.create({
        text: req.body.text
    }, function(err, question) {
        if (err)
            res.send(err);

        // get and return all the questions after you create another
        QuestionDtschl.find(function(err, questions) {
            if (err)
                res.send(err)
            res.json(questions);
        });
    });

});

// delete a question
app.delete('/api/question_delete_dtschl/:_id', function(req, res) {
    QuestionDtschl.remove({
        _id: req.params._id
    }, function(err, question) {
        if (err)
            res.send(err);

        // get and return all the questions after you create another
        QuestionDtschl.find(function(err, questions) {
            if (err)
                res.send(err)
            res.json(questions);
        });
    });
});


// get all Answers
app.get('/api/answers_dtschl', function(req, res) {

    // get and return all the answers
    AnswerDtschl.find(function(err, answers) {
        if (err)
            res.send(err)
        res.json(answers);
    });
});

// create answer and send back all questions after creation
app.post('/api/answer_dtschl', function(req, res) {
    // create a answer, information comes from AJAX request from Angular
    AnswerDtschl.create({
        //boolean und FragenIDmuss extraiert werden aus dem Body
        text: req.body.text,
        fragenId: req.body.fragenId,
        bool: req.body.bool
    }, function(err, answer) {
        if (err)
            res.send(err);

        // get and return all the answers after you create another
        AnswerDtschl.find(function(err, answers) {
            if (err)
                res.send(err)
            res.json(answers);
        });
    });

});

// delete a answer
app.delete('/api/answer_delete_dtschl/:_id', function(req, res) {
    AnswerDtschl.remove({
        _id: req.params._id
    }, function(err, answer) {
        if (err)
            res.send(err);

        // get and return all the answers after you create another
        AnswerDtschl.find(function(err, answers) {
            if (err)
                res.send(err)
            res.json(answers);
        });
    });
});

// update a answer
app.post('/api/answer_update_dtschl', function(req, res) {
    AnswerDtschl.findOne({ _id: req.body._id }, function(err, answer) {
        console.log(answer);
        if (answer === null) {
            // create a answer, information comes from AJAX request from Angular
            AnswerDtschl.create({
                //boolean und FragenIDmuss extraiert werden aus dem Body
                text: req.body.text,
                fragenId: req.body.fragenID,
                bool: req.body.bool
            }, function(err, answer) {
                if (err)
                    res.send(err);

                // get and return all the answers after you create another
                AnswerDtschl.find(function(err, answers) {
                    if (err)
                        res.send(err)
                    res.json(answers);
                });
            })
        } else {
            AnswerDtschl.update({ _id: req.body._id }, {
                text: req.body.text,
                bool: req.body.bool
            }, function(err, answer) {
                if (err)
                    res.send(err);

                // get and return all the answers after you create another
                AnswerDtschl.find(function(err, answers) {
                    if (err)
                        res.send(err)
                    res.json(answers);
                });
            });
        }
    })
});

// delete a answer
app.delete('/api/answer_delete_dtschl/:_id', function(req, res) {
    AnswerDtschl.remove({
        _id: req.params._id
    }, function(err, answer) {
        if (err)
            res.send(err);

        // get and return all the answers after you create another
        AnswerDtschl.find(function(err, answers) {
            if (err)
                res.send(err)
            res.json(answers);
        });
    });
});

// update a question
app.post('/api/question_update_dtschl', function(req, res) {
    console.log(req);
    QuestionDtschl.update({ _id: req.body._id }, {
        text: req.body.text
    }, function(err, question) {
        if (err)
            res.send(err);

        // get and return all the answers after you create another
        QuestionDtschl.find(function(err, questions) {
            if (err)
                res.send(err)
            res.json(questions);
        });
    });
});

//---- ShellQuiz

// get all ShellQuestions
app.get('/api/Shellquestions', function(req, res) {

    // get and return all the Shellquestions after you create another
    ShellQuestion.find(function(err, Shellquestions) {
        if (err)
            res.send(err)
        res.json(Shellquestions);
    });
});

// get ShellQuestion by Text
app.get('/api/Shellquestion/:text', function(req, res) {

    // get and return all the Shellquestions after you create another
    ShellQuestion.findOne({ text: req.params.text }, function(err, Shellquestions) {
        if (err)
            res.send(err)
        res.json(Shellquestions);
    }).sort({ _id: -1 });
});

// create Shellquestion and send back all Shellquestions after creation
app.post('/api/Shellquestion', function(req, res) {

    // create a Shellquestion, information comes from AJAX request from Angular
    ShellQuestion.create({
        text: req.body.text
    }, function(err, Shellquestion) {
        if (err)
            res.send(err);

        // get and return all the Shellquestions after you create another
        ShellQuestion.find(function(err, Shellquestions) {
            if (err)
                res.send(err)
            res.json(Shellquestions);
        });
    });

});

// delete a Shellquestion
app.delete('/api/Shellquestion_delete/:_id', function(req, res) {
    ShellQuestion.remove({
        _id: req.params._id
    }, function(err, Shellquestion) {
        if (err)
            res.send(err);

        // get and return all the Shellquestions after you create another
        ShellQuestion.find(function(err, Shellquestions) {
            if (err)
                res.send(err)
            res.json(Shellquestions);
        });
    });
});


// get all ShellAnswers
app.get('/api/Shellanswers', function(req, res) {

    // get and return all the Shellanswers
    ShellAnswer.find(function(err, Shellanswers) {
        if (err)
            res.send(err)
        res.json(Shellanswers);
    });
});

// create Shellanswer and send back all Shellquestions after creation
app.post('/api/Shellanswer', function(req, res) {
    // create a Shellanswer, information comes from AJAX request from Angular
    ShellAnswer.create({
        //boolean und FragenIDmuss extraiert werden aus dem Body
        text: req.body.text,
        fragenId: req.body.fragenId,
        bool: req.body.bool
    }, function(err, Shellanswer) {
        if (err)
            res.send(err);

        // get and return all the Shellanswers after you create another
        ShellAnswer.find(function(err, Shellanswers) {
            if (err)
                res.send(err)
            res.json(Shellanswers);
        });
    });

});

// delete a Shellanswer
app.delete('/api/Shellanswer_delete/:_id', function(req, res) {
    ShellAnswer.remove({
        _id: req.params._id
    }, function(err, Shellanswer) {
        if (err)
            res.send(err);

        // get and return all the Shellanswers after you create another
        ShellAnswer.find(function(err, Shellanswers) {
            if (err)
                res.send(err)
            res.json(Shellanswers);
        });
    });
});

// update a Shellquestion
app.post('/api/Shellquestion_update', function(req, res) {
    console.log(req);
    ShellQuestion.update({ _id: req.body._id }, {
        text: req.body.text
    }, function(err, Shellquestion) {
        if (err)
            res.send(err);

        // get and return all the Shellanswers after you create another
        ShellQuestion.find(function(err, Shellquestions) {
            if (err)
                res.send(err)
            res.json(Shellquestions);
        });
    });
});

// update a Shellanswer
app.post('/api/Shellanswer_update', function(req, res) {
    ShellAnswer.findOne({ _id: req.body._id }, function(err, Shellanswer) {
        console.log(Shellanswer);
        if (Shellanswer === null) {
            // create a Shellanswer, information comes from AJAX request from Angular
            ShellAnswer.create({
                //boolean und FragenIDmuss extraiert werden aus dem Body
                text: req.body.text,
                fragenId: req.body.fragenID,
                bool: req.body.bool
            }, function(err, Shellanswer) {
                if (err)
                    res.send(err);

                // get and return all the Shellanswers after you create another
                ShellAnswer.find(function(err, Shellanswers) {
                    if (err)
                        res.send(err)
                    res.json(Shellanswers);
                });
            })
        } else {
            ShellAnswer.update({ _id: req.body._id }, {
                text: req.body.text,
                bool: req.body.bool
            }, function(err, Shellanswer) {
                if (err)
                    res.send(err);

                // get and return all the Shellanswers after you create another
                ShellAnswer.find(function(err, Shellanswers) {
                    if (err)
                        res.send(err)
                    res.json(Shellanswers);
                });
            });
        }
    });

});