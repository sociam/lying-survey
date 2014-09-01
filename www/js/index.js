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

                var submitAnswers = function (uuid, question_id, answer, misc) {
                    answer = JSON.stringify(answer);
                    misc = JSON.stringify(misc);
                    jQuery.ajax({
                        url: "http://localhost:3000/submit", // customise this
                        type: "POST",
                        data: {"uuid": uuid, "question_id": question_id, "answer": answer, "misc": misc},
                        success: function () { console.log("submitted successfully"); },
                        error: function (jqXHR, textStatus, errorThrown) { console.log("submission failure", textStatus, errorThrown); },
                    });
                };
                window.sa = submitAnswers;
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
                    submitAnswers($scope.userid, qid, data, misc);			    	
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
