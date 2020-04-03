# Layout Tween

This is a library to assist in animating changes to the DOM, to use it

* Call the function on some elements whose children are going to be affected by your changes
* Do your changes
* Run the returned callback function to animate the changes

## Demo

https://samsunginter.net/layout-tween/

## Example

```javascript
import tween from './tween-dom.js';

// Measure the current elements
const callback = tween(... elements, options);

// Make some changes


// animate the changes
callback();
```
