/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery */

angular.module('survey', ['ui.router', 'ngAnimate'])
	.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/start');
		$stateProvider.state('splash', {
			url:'/start',
			templateUrl:'tmpl/start.html',
			controller:function($scope, $state, utils) {
				
				var u = utils, 
					sa = function(f) { utils.safeApply($scope, f); },
					stageTime = 0,
					resetTime = function() { stageTime = (new Date()).valueOf(); };

			    $scope.stage = 0;
			    $scope.startSurvey = function() { 
					$scope.userid = u.guid();
					$scope.stage = 1;
					resetTime();
			    };
			    $scope.next = function(qid, data) { 
			    	$scope.stage++;
			    	var elapsed = (new Date()).valueOf() - stageTime;
			    	// add elapsed here
			    	resetTime();
			    };
			    $scope.prev = function() { 
			    	console.log('<< prev ');
			    	$scope.stage--;
			    };
   			    window.ss = $scope;
			}
		});
	}).controller('main', function($scope, utils) { 
		var u = utils, sa = function(f) { utils.safeApply($scope, f); };
	});
