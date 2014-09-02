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
						sa(function() { $scope.resp = {}; });
					};
					
                var submitAnswers = function (userid, question_id, answer, misc) {
                    try {
                        console.log("submitAnswers");
                        if (!misc) { misc = ""; }
                        if (userid === undefined) { console.log('skipping!'); return; }
                        answer = JSON.stringify(answer);
                        misc = JSON.stringify(misc);
                        jQuery.ajax({
                            url: "submit", // customise this
                            type: "POST",
                            data: {"uuid": userid, "question_id": question_id, "answer": answer, "misc": misc},
                            success: function () { console.log("submitted successfully"); },
                            error: function (jqXHR, textStatus, errorThrown) { console.log("submission failure", textStatus, errorThrown); },
                        });
                    } catch (e) {
                        console.error("submitAnswers error", e);
                    }
                };
                window.sa = submitAnswers;
			    $scope.stage = 0;
			    $scope.laststage = 0;
			    $scope.resp = {};
				resetTime();
				resetVals();				
			    $scope.startSurvey = function() { 
					$scope.userid = [u.guid(4),u.guid(4),u.guid(4)].join('-');
					$scope.stage = 1;
			    };
			    $scope.next = function(qid, data, misc) { 
			    	$scope.stage++;
			    };
			    $scope.prev = function() { 
			    	$scope.stage--;
			    };
			    $scope.$watch('stage', function(x) { 
			    	console.log('stage ! ', x, $scope.laststage);
			    	if (x === undefined) { return; }
			    	var lS = $scope.laststage,
			    		qid = 'q'+(lS-1), // question # is stage -1 
			    		data = $scope.resp["q"+(lS-1)], // data for that question
			    		nextResp = $scope.resp["q"+(x-1)];

			    	if (lS - 1 > 0) { 
				    	var elapsed = (new Date()).valueOf() - stageTime;
	                    misc = {"elapsed": elapsed, "stageTime": stageTime, "misc": ''};
	                    console.log('submitting answers >> ', $scope.userid, qid, data, misc);
	                    submitAnswers($scope.userid, qid, data, misc);
	                }
			    	resetTime();
			    	// initialise next response
		    		$scope.resp["q"+(x-1)] = nextResp === undefined ? {} : nextResp;

		    		// reset for next run
		    		$scope.laststage = $scope.stage;
			    });
			    $scope.startOver = function() {  resetVals(); $scope.stage = 0;   };
   			    window.ss = $scope;
			}
		});
	}).controller('main', function($scope, utils) { 
		var u = utils, sa = function(f) { utils.safeApply($scope, f); };
	});
