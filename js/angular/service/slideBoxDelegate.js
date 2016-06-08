/**
 * @ngdoc service
 * @name $atajoUiSlideBoxDelegate
 * @module atajoui
 * @description
 * Delegate that controls the {@link atajoui.directive:auiSlideBox} directive.
 *
 * Methods called directly on the $atajoUiSlideBoxDelegate service will control all slide boxes.  Use the {@link atajoui.service:$atajoUiSlideBoxDelegate#$getByHandle $getByHandle}
 * method to control specific slide box instances.
 *
 * @usage
 *
 * ```html
 * <aui-view>
 *   <aui-slide-box>
 *     <aui-slide>
 *       <div class="box blue">
 *         <button ng-click="nextSlide()">Next slide!</button>
 *       </div>
 *     </aui-slide>
 *     <aui-slide>
 *       <div class="box red">
 *         Slide 2!
 *       </div>
 *     </aui-slide>
 *   </aui-slide-box>
 * </aui-view>
 * ```
 * ```js
 * function MyCtrl($scope, $atajoUiSlideBoxDelegate) {
 *   $scope.nextSlide = function() {
 *     $atajoUiSlideBoxDelegate.next();
 *   }
 * }
 * ```
 */
AtajoUiModule
.service('$atajoUiSlideBoxDelegate', atajoui.DelegateService([
  /**
   * @ngdoc method
   * @name $atajoUiSlideBoxDelegate#update
   * @description
   * Update the slidebox (for example if using Angular with ng-repeat,
   * resize it for the elements inside).
   */
  'update',
  /**
   * @ngdoc method
   * @name $atajoUiSlideBoxDelegate#slide
   * @param {number} to The index to slide to.
   * @param {number=} speed The number of milliseconds the change should take.
   */
  'slide',
  'select',
  /**
   * @ngdoc method
   * @name $atajoUiSlideBoxDelegate#enableSlide
   * @param {boolean=} shouldEnable Whether to enable sliding the slidebox.
   * @returns {boolean} Whether sliding is enabled.
   */
  'enableSlide',
  /**
   * @ngdoc method
   * @name $atajoUiSlideBoxDelegate#previous
   * @param {number=} speed The number of milliseconds the change should take.
   * @description Go to the previous slide. Wraps around if at the beginning.
   */
  'previous',
  /**
   * @ngdoc method
   * @name $atajoUiSlideBoxDelegate#next
   * @param {number=} speed The number of milliseconds the change should take.
   * @description Go to the next slide. Wraps around if at the end.
   */
  'next',
  /**
   * @ngdoc method
   * @name $atajoUiSlideBoxDelegate#stop
   * @description Stop sliding. The slideBox will not move again until
   * explicitly told to do so.
   */
  'stop',
  'autoPlay',
  /**
   * @ngdoc method
   * @name $atajoUiSlideBoxDelegate#start
   * @description Start sliding again if the slideBox was stopped.
   */
  'start',
  /**
   * @ngdoc method
   * @name $atajoUiSlideBoxDelegate#currentIndex
   * @returns number The index of the current slide.
   */
  'currentIndex',
  'selected',
  /**
   * @ngdoc method
   * @name $atajoUiSlideBoxDelegate#slidesCount
   * @returns number The number of slides there are currently.
   */
  'slidesCount',
  'count',
  'loop'
  /**
   * @ngdoc method
   * @name $atajoUiSlideBoxDelegate#$getByHandle
   * @param {string} handle
   * @returns `delegateInstance` A delegate instance that controls only the
   * {@link atajoui.directive:auiSlideBox} directives with `delegate-handle` matching
   * the given handle.
   *
   * Example: `$atajoUiSlideBoxDelegate.$getByHandle('my-handle').stop();`
   */
]));

