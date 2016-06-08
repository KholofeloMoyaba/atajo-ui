/**
 * @ngdoc directive
 * @name auiRadio
 * @module atajoui
 * @restrict E
 * @codepen saoBG
 * @description
 * The radio directive is no different than the HTML radio input, except it's styled differently.
 *
 * Radio behaves like [AngularJS radio](http://docs.angularjs.org/api/ng/input/input[radio]).
 *
 * @usage
 * ```html
 * <aui-radio ng-model="choice" ng-value="'A'">Choose A</aui-radio>
 * <aui-radio ng-model="choice" ng-value="'B'">Choose B</aui-radio>
 * <aui-radio ng-model="choice" ng-value="'C'">Choose C</aui-radio>
 * ```
 *
 * @param {string=} name The name of the radio input.
 * @param {expression=} value The value of the radio input.
 * @param {boolean=} disabled The state of the radio input.
 * @param {string=} icon The icon to use when the radio input is selected.
 * @param {expression=} ng-value Angular equivalent of the value attribute.
 * @param {expression=} ng-model The angular model for the radio input.
 * @param {boolean=} ng-disabled Angular equivalent of the disabled attribute.
 * @param {expression=} ng-change Triggers given expression when radio input's model changes
 */
AtajoUiModule
.directive('auiRadio', function() {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    transclude: true,
    template:
      '<label class="item item-radio">' +
        '<input type="radio" name="radio-group">' +
        '<div class="radio-content">' +
          '<div class="item-content disable-pointer-events" ng-transclude></div>' +
          '<i class="radio-icon disable-pointer-events icon aui-checkmark"></i>' +
        '</div>' +
      '</label>',

    compile: function(element, attr) {
      if (attr.icon) {
        var iconElm = element.find('i');
        iconElm.removeClass('aui-checkmark').addClass(attr.icon);
      }

      var input = element.find('input');
      forEach({
          'name': attr.name,
          'value': attr.value,
          'disabled': attr.disabled,
          'ng-value': attr.ngValue,
          'ng-model': attr.ngModel,
          'ng-disabled': attr.ngDisabled,
          'ng-change': attr.ngChange,
          'ng-required': attr.ngRequired,
          'required': attr.required
      }, function(value, name) {
        if (isDefined(value)) {
            input.attr(name, value);
          }
      });

      return function(scope, element, attr) {
        scope.getValue = function() {
          return scope.ngValue || attr.value;
        };
      };
    }
  };
});
