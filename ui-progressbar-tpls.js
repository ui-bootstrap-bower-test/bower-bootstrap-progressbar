/*
 * angular-ui-bootstrap
 * http://angular-ui.github.io/bootstrap/
 * Version: 0.11.1 - 2014-01-30
 * License: MIT
 */



angular.module('ui.bootstrap.progressbar', [])

.constant('progressConfig', {
  animate: true,
  max: 100
})

.controller('ProgressController', ['$scope', '$attrs', 'progressConfig', function($scope, $attrs, progressConfig) {
    var self = this,
        animate = angular.isDefined($attrs.animate) ? $scope.$parent.$eval($attrs.animate) : progressConfig.animate;

    this.bars = [];
    this.max = angular.isDefined($attrs.max) ? $scope.$parent.$eval($attrs.max) : progressConfig.max;

    this.addBar = function(bar, element) {
        bar.$element = element;

        if ( !animate ) {
            bar.$element.css({'transition': 'none'});
        }

        this.bars.push(bar);

        bar.$watch('value', function() {
            self.update( bar );
        });

        bar.$on('$destroy', function() {
            bar.$element = null;
            self.removeBar(bar);
        });
    };

    this.update = function( bar ) {
        var percent = this.getPercentage( bar.value );
        bar.$element.css({ 'width': percent + '%' });
    };

    this.removeBar = function(bar) {
        this.bars.splice(this.bars.indexOf(bar), 1);
    };

    this.getPercentage = function(value) {
        return Math.round(100 * value / this.max);
    };
}])

.directive('progress', function() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        controller: 'ProgressController',
        require: 'progress',
        scope: {},
        templateUrl: 'template/progressbar/progress.html'
    };
})

.directive('bar', function() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        require: '^progress',
        scope: {
            value: '=',
            type: '@'
        },
        templateUrl: 'template/progressbar/bar.html',
        link: function(scope, element, attrs, progressCtrl) {
            progressCtrl.addBar(scope, element);
        }
    };
})

.directive('progressbar', function() {
    return {
        restrict: 'EA',
        replace: true,
        transclude: true,
        controller: 'ProgressController',
        scope: {
            value: '=',
            type: '@'
        },
        templateUrl: 'template/progressbar/progressbar.html',
        link: function(scope, element, attrs, progressCtrl) {
            progressCtrl.addBar(scope, angular.element(element.children()[0]));
        }
    };
});
angular.module('template/progressbar/bar.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/progressbar/bar.html',
    '<div class="progress-bar" ng-class="type && \'progress-bar-\' + type" ng-transclude=""></div>');
}]);

angular.module('template/progressbar/progress.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/progressbar/progress.html',
    '<div class="progress" ng-transclude=""></div>');
}]);

angular.module('template/progressbar/progressbar.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/progressbar/progressbar.html',
    '<div class="progress"><div class="progress-bar" ng-class="type && \'progress-bar-\' + type" ng-transclude=""></div></div>');
}]);
