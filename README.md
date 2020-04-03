# Layout Tween

This is a library to assist in animating changes to the DOM, to use it

* Call the function on some elements whose children are going to be affected by your changes
* Do your changes
* Run the returned callback function to animate the changes

## Demo

https://samsunginter.net/layout-tween/

## Example

### HTML
```html
<ul>
  <li onClick="onclick(this)">Cat</li>
  <li onClick="onclick(this)">Dog</li>
  <li onClick="onclick(this)">Cow</li>
  <li onClick="onclick(this)">Horse</li>
</ul>
```

### Javascript
```Javascript
import tween from './tween-dom.js';

function onclick(item){
  const options = {
    translate: true,      // Animate position change
    scale: true,          // Animate size change
    exemptParents: true,  // Will ignore elements explicitly passed when they are matched as a child of another element.
    exempt: [],           // List of element to exempt 
    animationOptions: {
      easing: 'ease-out', // Https://developer.mozilla.org/en-US/docs/Web/API/Element/animate#Parameters
      duration: 500       // Animation duration
    }
  };
  
  const animate = tween(item.parentNode, document.body, options)
  
  // Make some dom changes e.g. this.remove();
  
  animate();
}

```
