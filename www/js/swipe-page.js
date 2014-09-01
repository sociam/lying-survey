/* jshint undef: true, strict:false, trailing:false, unused:false */
/* global require, exports, console, process, module, L, angular, _, jQuery, Backbone, d3 */

angular.module('survey')
	.directive('swipePage', function() { 
		return {
			restrict:'E',
			transclude:true,
			replace:true,
			scope:{activepage:'=page'},
			templateUrl:'tmpl/swipe-page.html',
			controller:function($scope, $element, $transclude, utils) {

				var u = utils, sa = function(f) { utils.safeApply($scope, f); },			
					scrollBlock = false, to, 
					viewport = $element.find('.viewport'),
					w = viewport.outerWidth(),
					el, evtseq = [];

				window.$el = $element;
					
				var update = function() { 
					console.log('w is ', w);
					var npages = $scope.npages = $element.find('.page').length;
					$scope.dots = u.range(npages); 
					$element.find('.page').outerWidth(w); // set to w.
					var viewidth =(w+2)*npages;
					console.info('setting viewport width ', viewidth); 
					viewport.width(viewidth);			
				};

				$scope.$parent.$watch(function() { 
					console.log('change'); 
					console.log('viewportWidth > ', w, $element.find('.page').length);
					update();
				});
				$scope.clickDot = function(i) { 
					$scope.activepage = i;
					var currentElement = $element.find('.page')[i],
						view = $element.filter('.swipe-page');
					if (!currentElement || !view) { return ;}
					$element.filter('.swipe-page').animate({scrollLeft: $(currentElement).position().left}, 200, 'swing', function() { 
						console.log('done anim');
					});
				};
				var snapScroll = function() { 
					// console.log('snap scrolling');
					var eL = $element.scrollLeft();
					if (eL > $scope.activepage * w && $scope.activepage < $scope.npages - 1) { 
						sa(function() { $scope.clickDot($scope.activepage + 1); });
					} else if (eL < $scope.activepage * w && $scope.activepage > 0) {
						sa(function() { $scope.clickDot($scope.activepage - 1); });						
					}
				};

				$element.on('scroll', function() { 
					if (evtseq[0] == 'ts') {
						evtseq[1] = 'scroll';
					} else {
						evtseq = [];
					}
				});
				$element.on('touchstart', function() { 
					evtseq = ['ts']; // reset touchseq
					console.log('touchstart!!'); 
				});
				$element.on('touchend', function() { 
					console.log('touchend!!'); 
					if (evtseq.length == 2) { 
						evtseq = [];						
						console.log('fire seq ', evtseq);
						snapScroll();
					}
				});
				$element.on('click', function() { evtseq = []; });
				$scope.clickDot(0);
				$scope.$watch('activepage', function() { $scope.clickDot($scope.activepage); });
				update();				
			}
		};
	}); 
