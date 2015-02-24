'use strict';

/* App Module */

var userApp = angular.module('dndApp', [
	'ngRoute',
	'controllers',
	'services'
]);

userApp.config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.when('/fighter', {
			templateUrl: 'fighter.html',
			controller: 'FighterController'
		})
		.otherwise({
			redirectTo: '/fighter'
		});
}]);