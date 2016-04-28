/**
change by skyshore:

- dont emit event if there's offset 
- use tap instead of click on mobile.

 * @author Aaron Gloege
 * @version 1.0
 */
(function(document, $) {
    'use strict';

    /**
     * Flag to determine if touch is supported
     *
     * @type {boolean}
     * @constant
     */
    var isMobile = navigator.userAgent.match(/(iPhone|iPad|Android)/i);
    var TOUCH = $.support.touch = ('ontouchstart' in window && isMobile);
    if (!TOUCH) {
        return;
    }

    /**
     * Event namespace
     *
     * @type {string}
     * @constant
     */
    var HELPER_NAMESPACE = '._tap';

    /**
     * Event name
     *
     * @type {string}
     * @constant
     */
    var EVENT_NAME = 'click';

    /**
     * Event variables to copy to touches
     *
     * @type {Array}
     * @constant
     */
    var EVENT_VARIABLES = 'clientX clientY screenX screenY pageX pageY'.split(' ');

    /**
     * Object for tracking current touch settings (x, y, target, canceled, etc)
     *
     * @type {object}
     * @static
     */
    var TOUCH_VALUES = {

        /**
         * target element of touchstart event
         *
         * @type {jQuery}
         */
        $el: null,

        /**
         * pageX position of touch on touchstart
         *
         * @type {number}
         */
        x: 0,

        /**
         * pageY position of touch on touchstart
         *
         * @type {number}
         */
        y: 0,

        /**
         * Number of touches currently active on touchstart
         *
         * @type {number}
         */
        count: 0,

        /**
         * Has the current tap event been canceled?
         *
         * @type {boolean}
         */
        cancel: false

    };

    /**
     * Create a new event from the original event
     * Copy over EVENT_VARIABLES from the first changedTouches
     *
     * @param {string} type
     * @param {jQuery.Event} e
     * @return {jQuery.Event}
     * @private
     */
    var _createEvent = function(type, e) {
        var originalEvent = e.originalEvent;
        var event = $.Event(originalEvent);
        var touch = originalEvent.changedTouches ? originalEvent.changedTouches[0] : originalEvent;

        event.type = type;

        var i = 0;
        var length = EVENT_VARIABLES.length;

        for (; i < length; i++) {
            event[EVENT_VARIABLES[i]] = touch[EVENT_VARIABLES[i]];
        }

        return event;
    };

    /**
     * Tap object that will track touch events and
     * trigger the tap event when necessary
     *
     * @name Tap
     * @type {object}
     */
    var Tap = {

        /**
         * Flag to determine if touch events are currently enabled
         *
         * @type {boolean}
         */
        isEnabled: false,

        /**
         * Are we currently tracking a tap event?
         *
         * @type {boolean}
         */
        isTracking: false,

        /**
         * Enable touch event listeners
         *
         * @return {Tap}
         */
        enable: function() {
            if (this.isEnabled) {
                return this;
            }

            this.isEnabled = true;

            $(document.body)
                .on('touchstart' + HELPER_NAMESPACE, this.onTouchStart)
                .on('touchend' + HELPER_NAMESPACE, this.onTouchEnd)
                .on('touchcancel' + HELPER_NAMESPACE, this.onTouchCancel);

            return this;
        },

        /**
         * Disable touch event listeners
         *
         * @return {boolean}
         */
        disable: function() {
            if (!this.isEnabled) {
                return this;
            }

            this.isEnabled = false;

            $(document.body)
                .off('touchstart' + HELPER_NAMESPACE, this.onTouchStart)
                .off('touchend' + HELPER_NAMESPACE, this.onTouchEnd)
                .off('touchcancel' + HELPER_NAMESPACE, this.onTouchCancel);

            return this;
        },

        /**
         * Store touch start values and target
         * @param {jQuery.Event} e
         */
        onTouchStart: function(e) {
            var touches = e.originalEvent.touches;
            TOUCH_VALUES.count = touches.length;

            if (Tap.isTracking) {
                return;
            }

            Tap.isTracking = true;
            var touch = touches[0];

            TOUCH_VALUES.cancel = false;
            TOUCH_VALUES.$el = $(e.target);
            TOUCH_VALUES.x = touch.pageX;
            TOUCH_VALUES.y = touch.pageY;
        },

        /**
         * If touch has not been canceled, create a
         * tap event and trigger it on the target element
         *
         * @param {jQuery.Event} e
         */
        onTouchEnd: function(e) {
            var isTap = false;
            var touches = e.originalEvent.changedTouches;
            if (touches && touches[0]) {
                isTap = (touches[0].pageX == TOUCH_VALUES.x && touches[0].pageY == TOUCH_VALUES.y);
            }

            if (isTap &&
                !TOUCH_VALUES.cancel &&
                TOUCH_VALUES.count === 1 &&
                Tap.isTracking
            ) {
                TOUCH_VALUES.$el.trigger(_createEvent(EVENT_NAME, e));
            }
            // Cancel tap
            Tap.onTouchCancel(e);
        },

        /**
         * Cancel tap by setting TOUCH_VALUES.cancel to true
         *
         * @param {jQuery.Event} e
         */
        onTouchCancel: function(e) {
            Tap.isTracking = false;
            TOUCH_VALUES.cancel = true;
        }

    };

    // Setup special event and enable
    // tap only if a tap event is bound
    $.event.special[EVENT_NAME] = {
        setup: function() {
            Tap.enable();
        }
    };

}(document, jQuery));
