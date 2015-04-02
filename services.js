'use strict';

/* Services */

var services = angular.module('services', ['ngResource']);

services.factory('FighterService', ['$resource', function($resource){

    return $resource('fighter.json');

}]);
