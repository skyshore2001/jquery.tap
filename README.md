# jQuery.tap

A jQuery plugin that replaces "click" event with "tap" event *transparently* for touch enabled browsers.

If you find your "click" event handler slow on touch device (caused by 300ms-delay problem), you can just add this JS library *without changing any code*.

The "tap" event is simulated by "touchend" event. This project is a fork of jQuery.tap plugin:

http://aarongloege.github.com/jquery.tap/
A jQuery plugin that creates a click alternative for touch enabled browsers.

My change:

- Support fast "click" event. You don't need replace "click" event with "tap" manually.
- On desktop web browser, this plugin does nothing, which means the native click event is used.

NOTE:

- This plugin does not work on the Weixin explore.
- This plugin does not handle the "onclick" property or "<a>" tag with "href" property.

## Why?

Click events on touch devices do not work the best. There is a 300ms delay from when you release your finger to the time the click event is triggered. This behavior is not desired.

## How do I use it?

Just add this JS library, then your 'click' handler turns faster.

```javascript
// jQuery.on method
$('.element').on('click', onTapHandler);
$('.element').on('click', dataObject, onTapHandler);
```

And, because the event is bound through jQuery's `on` API, you can take advantage of namespaces and delegate events:

```javascript
// Namespace
$('.element').on('click.widget', onTapHandler);
$('.element').on('click.widget', dataObject, onTapHandler);

// Delegate
$('.element').on('click', '.child-element', onTapHandler);
$('.element').on('click', '.child-element', dataObject, onTapHandler);

// Together now
$('.element').on('click.widget', '.child-element', onTapHandler);
$('.element').on('click.widget', '.child-element', dataObject, onTapHandler);
```

The event will also bubble.

## What About Desktop?

If the browser does not support touch events, then the regular click event will be used. No need for if/else statements, jQuery.tap will do that for you.

## Licence

jQuery.tap is licensed under the [MIT license](http://opensource.org/licenses/mit-license.html).
