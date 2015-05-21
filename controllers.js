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
		if ($scope.fighter.weapon.masterwork) {
			if ($scope.fighter.weapon.enhancement > 0) {
				bonus += $scope.fighter.weapon.enhancement;
			} else {
				bonus ++;
			}
		}
		if ($scope.rg) {
			bonus -= 2;
			$scope.rageRounds--;
			if ($scope.rageRounds < 1) {
				$scope.rg = false;
				$scope.rage();
				$scope.rageRounds = 3 + getAttrBonus($scope.fighter.con);
			}
		}
		attack = (bonus < 0) ? 'd20 - ' + bonus : 'd20 + ' + bonus;
		if ($scope.rg) {
			attack += (bonus < 0) ? ' d20 - ' + bonus : ' d20 + ' + bonus;
		}
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
		if ($scope.fighter.weapon.masterwork && $scope.fighter.weapon.enhancement > 0) {
			dam += $scope.fighter.weapon.enhancement;
		}
		if ($scope.pa != null && $scope.pa >= 0) {
			if ($scope.fighter.twoHanded) {
				if ($scope.leap) {
					dam += (($scope.pa * 2) * 3);
				} else {
					dam += ($scope.pa * 2);
				}
			} else {
				if ($scope.leap) {
					dam += (($scope.pa * 2) * 2);
				} else {
					dam += $scope.pa;
				}
			}
		}
		return dam;
	}


	$scope.enlargePerson = function() {
		if ($scope.ep) {
			$scope.fighter.str += 2;
			$scope.fighter.dex -= 2;
			$scope.getAc();
			increaseWeaponSize();
			$scope.special.push('Increase size category by one.<br>');
		} else {
			$scope.fighter.str -= 2;
			$scope.fighter.dex += 2;
			$scope.getAc();
			decreaseWeaponSize();
			$scope.special = removeValue($scope.special, 'Increase size category by one.<br>');
		}
	}

	$scope.mightyWallop = function() {
		if ($scope.mw) {
			increaseWeaponSize();
			increaseWeaponSize();
			$scope.special.push('Increase weapon size category by two.<br>');
		} else {
			decreaseWeaponSize();
			decreaseWeaponSize();
			$scope.special = removeValue($scope.special, 'Increase weapon size category by two.<br>');
		}
	}

	$scope.rage = function() {
		if ($scope.rg) {
			$scope.fighter.str += 4;
			$scope.getAc();
		} else {
			$scope.fighter.str -= 6;
			$scope.fighter.dex -= 2;
			$scope.getAc();
			$scope.special.push('<strong>FATIGUED</strong><br>');
			$scope.fatigued = true;

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
			$scope.damage = $scope.fighter.weapon.damDie + ' + ' + getDamage(strBonus);
			//$scope.armor = getArmor();
			$scope.getAc();
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

	$scope.getSpecial = function() {
		return $scope.special.join(' ');
	};

	$scope.getAc = function() {
		$scope.armor = $scope.fighter.armor + getAttrBonus($scope.fighter.dex);
		if ($scope.charge) {
			$scope.armor -= 2;
		}
		if ($scope.rg) {
			$scope.armor += 2;
		}
		if ($scope.ep) {
			$scope.armor -= 1;
		}
	}

	$scope.end = function() {
		$scope.rg = false;
		$scope.leap = false;
		$scope.charge = false;
		$scope.special = removeValue($scope.special, '<strong>FATIGUED</strong><br>');
		$scope.result = false;
		if ($scope.fatigued) {
			$scope.fatigued = false;
			$scope.fighter.str += 2;
			$scope.fighter.dex += 2;
			$scope.getAc();
		}
	};

	FighterService.get().$promise.then(function(data) {
		$scope.fighter = data;
		$scope.rageRounds = 3 + getAttrBonus($scope.fighter.con);
		$scope.getAc();
	});

	$scope.result = false;
	$scope.special = [];
	$scope.attack = '';
	$scope.damage = '';
	$scope.ep = false;
	//$scope.armor = 0;
	$scope.aoo = 0;
	$scope.err = '';

	function increaseWeaponSize() {
		switch ($scope.fighter.weapon.damDie) {
			case '1d2':
				$scope.fighter.weapon.damDie = '1d3';
				return;
			case '1d3':
				$scope.fighter.weapon.damDie = '1d4';
				return;
			case '1d4':
				$scope.fighter.weapon.damDie = '1d6';
				return;
			case '1d6':
				$scope.fighter.weapon.damDie = '1d8';
				return;
			case '1d8':
				$scope.fighter.weapon.damDie = '2d6';
				return;
			case '1d10':
				$scope.fighter.weapon.damDie = '2d8';
				return;
			case '1d12':
				$scope.fighter.weapon.damDie = '3d6';
				return;
			case '2d4':
				$scope.fighter.weapon.damDie = '2d6';
				return;
			case '2d6':
				$scope.fighter.weapon.damDie = '3d6';
				return;
			case '2d8':
				$scope.fighter.weapon.damDie = '3d8';
				return;
			case '2d10':
				$scope.fighter.weapon.damDie = '4d8';
				return;
			case '3d6':
				$scope.fighter.weapon.damDie = '4d6';
				return;
			case '3d8':
				$scope.fighter.weapon.damDie = '4d8';
				return;
			case '4d6':
				$scope.fighter.weapon.damDie = '6d6';
				return;
			case '4d8':
				$scope.fighter.weapon.damDie = '6d8';
				return;
			case '6d6':
				$scope.fighter.weapon.damDie = '8d6';
				return;
			case '6d8':
				$scope.fighter.weapon.damDie = '8d8';
				return;
			case '8d8':
				$scope.fighter.weapon.damDie = '12d8';
				return;
		}
	}

	function decreaseWeaponSize() {
		switch ($scope.fighter.weapon.damDie) {
			case '1d3':
				$scope.fighter.weapon.damDie = '1d2';
				return;
			case '1d4':
				$scope.fighter.weapon.damDie = '1d3';
				return;
			case '1d6':
				$scope.fighter.weapon.damDie = '1d4';
				return;
			case '1d8':
				$scope.fighter.weapon.damDie = '1d6';
				return;
			case '2d6':
				$scope.fighter.weapon.damDie = '1d8';
				return;
			case '2d8':
				$scope.fighter.weapon.damDie = '1d10';
				return;
			case '3d6':
				$scope.fighter.weapon.damDie = '1d12';
				return;
			case '3d8':
				$scope.fighter.weapon.damDie = '2d8';
				return;
			case '4d6':
				$scope.fighter.weapon.damDie = '3d6';
				return;
			case '4d8':
				$scope.fighter.weapon.damDie = '3d8';
				return;
			case '6d6':
				$scope.fighter.weapon.damDie = '4d6';
				return;
			case '6d8':
				$scope.fighter.weapon.damDie = '4d8';
				return;
			case '8d6':
				$scope.fighter.weapon.damDie = '6d6';
				return;
			case '8d8':
				$scope.fighter.weapon.damDie = '6d8';
				return;
			case '12d8':
				$scope.fighter.weapon.damDie = '8d8';
				return;

		}
	}

}]);
