angular.module('menuApp', [])

.controller('menuCtrl', function($scope) {
        console.log($scope.activePage);
        document.getElementById($scope.activePage).className = "active";
    })
    .directive("mainNavigation", function() {
        return {
            templateUrl: 'partials/menu.html',
            restrict: 'A',
            controller: function($scope) {}

        };
    })