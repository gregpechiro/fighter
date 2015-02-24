'use strict';

/* Controllers */

var controllers = angular.module('controllers', ['ngCookies']);

controllers.controller('FighterController', ['$scope', 'FighterService', '$cookies', function($scope, FighterService, $cookies) {

	function getAttrBonus(attr) {
		var bon = 0;
		bon = Math.floor((attr - 10) / 2);
		return bon;
	}

	function getAttack(strBonus) {
		var bonus = strBonus + $scope.fighter.bab;
		var attack = ''
		if ($scope.charge) {
			bonus += 2;
		}
		if ($scope.pa != null && $scope.pa >= 0) {
			bonus -= $scope.pa;
		}
		if ($scope.ep) {
			bonus -= 1;
		}
		attack = 'd20 + ' + bonus;
		if ($scope.fighter.bab > 5) {
			attack += ' d20 + ' + (bonus - 5);
		}
		if ($scope.fighter.bab > 10) {
			attack += ' d20 + ' + (bonus - 10);
		}
		if ($scope.fighter.bab > 15) {
			attack += ' d20 + ' + (bonus - 15);
		}
		return attack;
	}

	function getDamage(strBonus) {
		var dam = strBonus;
		if ($scope.fighter.twoHanded) {
			dam = dam + Math.floor(strBonus * .5)
		}
		if ($scope.pa != null && $scope.pa >= 0) {
			if ($scope.fighter.twoHanded) {
				dam = dam + ($scope.pa * 2);	
			} else {
				dam = dam + $scope.pa;
			}
		}
		return dam;
	}

	function getArmor() {
		var arm = $scope.fighter.ac;
		if ($scope.charge) {
			arm = arm - 2;
		}
		return arm
	}

	$scope.enlargePerson = function() {
		if ($scope.ep) {
			$scope.fighter.str = $scope.fighter.str + 2;
			$scope.fighter.dex = $scope.fighter.dex - 2;
			$scope.fighter.ac = $scope.fighter.ac - 2;
			//$scope.special = $scope.special + 'Increase size category by one';
		} else {
			$scope.fighter.str = $scope.fighter.str - 2;
			$scope.fighter.dex = $scope.fighter.dex + 2;
			$scope.fighter.ac = $scope.fighter.ac + 2;
		}
	}

	$scope.calc = function() {
		if ($scope.pa > $scope.fighter.bab) {
			$scope.err = 'Power attack cannot exceed base attack bonus';
		} else {
			$scope.err = ''
			var dexBonus = getAttrBonus($scope.fighter.dex);
			var strBonus = getAttrBonus($scope.fighter.str);
			$scope.attack = getAttack(strBonus);
			$scope.damage = $scope.damDie + ' + ' + getDamage(strBonus);
			$scope.armor = getArmor(); 
			$scope.aoo = dexBonus + 1;
			$scope.result = true;
		}
	}

	$scope.makeAoo = function() {
		if ($scope.aoo > 0) {
			$scope.aoo = $scope.aoo - 1;
		} else {
			$scope.err = 'You are out of attack of opportunities';
		}
	}


	$scope.fighter = FighterService.get();
	$scope.damDie = '1d12';
	$scope.result = false;
	$scope.special = '';
	$scope.attack = '';
	$scope.damage = '';
	$scope.ep = false;
	$scope.armor = 0;
	$scope.aoo = 0;
	$scope.err = ''

}]);