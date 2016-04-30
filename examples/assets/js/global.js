(function($) {
    'use strict';

    $(document).ready(function() {

        var $touchInner = $('.touch-inner');

        $('.touch-area').on('click', function(e) {
            console.log('click/tap event', e);
            $touchInner.prepend("Tap {\n    x: " + e.pageX + ",\n    y: " + e.pageY + "\n};\n");
        });

    });

}(jQuery));
