/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery */

angular.module('survey', ['ui.router', 'ngAnimate'])
	.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/start');
		$stateProvider.state('splash', {
			url:'/start',
			templateUrl:'tmpl/start.html',
			controller:function($scope, $state, utils) {
				var u = utils, sa = function(f) { utils.safeApply($scope, f); };
			    window.ss = $scope;

			    $scope.startSurvey = function() { 
					$scope.userid = u.guid();
					// advance!
			    };
			    $scope.next = function() { 
			    	console.log('next >> ');
			    };
			    $scope.prev = function() { 
			    	console.log('<< prev ');
			    };
			}
		});
	}).controller('main', function($scope, utils) { 
		var u = utils, sa = function(f) { utils.safeApply($scope, f); };
	});





