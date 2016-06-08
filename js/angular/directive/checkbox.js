
/**
 * @ngdoc directive
 * @name auiCheckbox
 * @module atajoui
 * @restrict E
 * @codepen hqcju
 * @description
 * The checkbox is no different than the HTML checkbox input, except it's styled differently.
 *
 * The checkbox behaves like any [AngularJS checkbox](http://docs.angularjs.org/api/ng/input/input[checkbox]).
 *
 * @usage
 * ```html
 * <aui-checkbox ng-model="isChecked">Checkbox Label</aui-checkbox>
 * ```
 */

AtajoUiModule
.directive('auiCheckbox', ['$atajoUiConfig', function($atajoUiConfig) {
  return {
    restrict: 'E',
    replace: true,
    require: '?ngModel',
    transclude: true,
    template:
      '<label class="item item-checkbox">' +
        '<div class="checkbox checkbox-input-hidden disable-pointer-events">' +
          '<input type="checkbox">' +
          '<i class="checkbox-icon"></i>' +
        '</div>' +
        '<div class="item-content disable-pointer-events" ng-transclude></div>' +
      '</label>',
    compile: function(element, attr) {
      var input = element.find('input');
      forEach({
        'name': attr.name,
        'ng-value': attr.ngValue,
        'ng-model': attr.ngModel,
        'ng-checked': attr.ngChecked,
        'ng-disabled': attr.ngDisabled,
        'ng-true-value': attr.ngTrueValue,
        'ng-false-value': attr.ngFalseValue,
        'ng-change': attr.ngChange,
        'ng-required': attr.ngRequired,
        'required': attr.required
      }, function(value, name) {
        if (isDefined(value)) {
          input.attr(name, value);
        }
      });
      var checkboxWrapper = element[0].querySelector('.checkbox');
      checkboxWrapper.classList.add('checkbox-' + $atajoUiConfig.form.checkbox());
    }
  };
}]);
