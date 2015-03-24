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
		if ($scope.fighter.masterwork) {
			bonus ++;
		}
		attack = (bonus < 0) ? 'd20 - ' + bonus : 'd20 + ' + bonus;
		if ($scope.fighter.bab > 5) {
			attack += ((bonus - 5) < 0) ? ' d20 ' + (bonus - 5) : ' d20 + ' + (bonus - 5);
		}
		if ($scope.fighter.bab > 10) {
			attack += ((bonus - 10) < 0) ? ' d20 ' + (bonus - 10) : ' d20 + ' + (bonus - 10);
		}
		if ($scope.fighter.bab > 15) {
			attack += ((bonus - 15) < 0) ? ' d20 ' + (bonus - 15) : ' d20 + ' + (bonus - 15);
		}
		return attack;
	}

	function getDamage(strBonus) {
		var dam = strBonus;
		if ($scope.fighter.twoHanded) {
			dam += Math.floor(strBonus * .5)
		}
		if ($scope.pa != null && $scope.pa >= 0) {
			if ($scope.fighter.twoHanded) {
				dam += ($scope.pa * 2);
				if ($scope.leap) {
					dam += (($scope.pa * 2) * 3);
				}
			} else {
				dam += $scope.pa;
				if ($scope.leap) {
					dam += (($scope.pa * 2) * 2);
				}
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
			increaseWeaponSize();
		} else {
			$scope.fighter.str = $scope.fighter.str - 2;
			$scope.fighter.dex = $scope.fighter.dex + 2;
			$scope.fighter.ac = $scope.fighter.ac + 2;
			decreaseWeaponSize();
		}
	}

	$scope.mightyWallop = function() {
		if ($scope.mw) {
			increaseWeaponSize();
			increaseWeaponSize();
		} else {
			decreaseWeaponSize();
			decreaseWeaponSize();
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

	function increaseWeaponSize() {
		switch ($scope.damDie) {
			case '1d2':
				$scope.damDie = '1d3';
				return;
			case '1d3':
				$scope.damDie = '1d4';
				return;
			case '1d4':
				$scope.damDie = '1d6';
				return;
			case '1d6':
				$scope.damDie = '1d8';
				return;
			case '1d8':
				$scope.damDie = '2d6';
				return;
			case '1d10':
				$scope.damDie = '2d8';
				return;
			case '1d12':
				$scope.damDie = '3d6';
				return;
			case '2d4':
				$scope.damDie = '2d6';
				return;
			case '2d6':
				$scope.damDie = '3d6';
				return;
			case '2d8':
				$scope.damDie = '3d8';
				return;
			case '2d10':
				$scope.damDie = '4d8';
				return;
			case '3d6':
				$scope.damDie = '4d6';
				return;
			case '3d8':
				$scope.damDie = '4d8';
				return;
			case '4d6':
				$scope.damDie = '6d6';
				return;
			case '4d8':
				$scope.damDie = '6d8';
				return;
			case '6d6':
				$scope.damDie = '8d6';
				return;
			case '6d8':
				$scope.damDie = '8d8';
				return;
			case '8d8':
				$scope.damDie = '12d8';
				return;
		}
	}

	function decreaseWeaponSize() {
		switch ($scope.damDie) {
			case '1d3':
				$scope.damDie = '1d2';
				return;
			case '1d4':
				$scope.damDie = '1d3';
				return;
			case '1d6':
				$scope.damDie = '1d4';
				return;
			case '1d8':
				$scope.damDie = '1d6';
				return;
			case '2d6':
				$scope.damDie = '1d8';
				return;
			case '2d8':
				$scope.damDie = '1d10';
				return;
			case '3d6':
				$scope.damDie = '1d12';
				return;
			case '3d8':
				$scope.damDie = '2d8';
				return;
			case '4d6':
				$scope.damDie = '3d6';
				return;
			case '4d8':
				$scope.damDie = '3d8';
				return;
			case '6d6':
				$scope.damDie = '4d6';
				return;
			case '6d8':
				$scope.damDie = '4d8';
				return;
			case '8d6':
				$scope.damDie = '6d6';
				return;
			case '8d8':
				$scope.damDie = '6d8';
				return;
			case '12d8':
				$scope.damDie = '8d8';
				return;

		}
	}

}]);
