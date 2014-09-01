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
					resetTime = function() { stageTime = (new Date()).valueOf(); },
					resetVals = function() { 
						sa(function() { $scope.resp = {q1:{},q2:{},q3:{},q4:{},q5:{},q6:{},q7:{}}; });
					};
					
                var submitAnswers = function (uuid, question_id, answer, misc) {
                    if (!misc) { misc = ""; }
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
					$scope.userid = [u.guid(4),u.guid(4),u.guid(4)].join('-');
					resetTime();
					resetVals();					
					$scope.stage = 1;
			    };
			    $scope.next = function(qid, data, misc) { 
			    	$scope.stage++;
			    	var elapsed = (new Date()).valueOf() - stageTime;
			    	// add elapsed here
                    misc = {"elapsed": elapsed, "stageTime": stageTime, "misc": misc};
                    submitAnswers($scope.userid, qid, data, misc);
			    	resetTime();
			    };
			    $scope.prev = function() { 
			    	console.log('<< prev ');
			    	$scope.stage--;
			    };
			    $scope.startOver = function() {  resetVals(); $scope.stage = 0;   };
   			    window.ss = $scope;
			}
		});
	}).controller('main', function($scope, utils) { 
		var u = utils, sa = function(f) { utils.safeApply($scope, f); };
	});
