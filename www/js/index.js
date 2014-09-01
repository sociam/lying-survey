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
					$scope.qid = 1;
					// advance!
			    };
			    $scope.next = function(data) { 
			    	console.log('next >> ');
			    	$scope.qid++;
			    };
			    $scope.prev = function() { 
			    	console.log('<< prev ');
			    	$scope.qid--;
			    };
			}
		});
	}).controller('main', function($scope, utils) { 
		var u = utils, sa = function(f) { utils.safeApply($scope, f); };
	});





