angular.module('QuizApp', ['ngRoute', 'QuizService'])
    .controller('BerlinCtrl', function($scope, Quiz) {
        url = Quiz.url('Berlin');
        $scope.questions = Quiz.getQuestions(url.questions);
        console.log($scope.questions);
    })
    .config(function($routeProvider) {
        $routeProvider
            .when('/', { templateUrl: 'partials/newQuestion.html' })
            .when('/edit', { templateUrl: 'partials/editQuestion.html' })
            .otherwise({ redirectTo: '/' });
    })