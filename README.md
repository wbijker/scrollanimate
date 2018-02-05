# scrollanimate
Very small customizable JS library (4KB minified) for animating elements on scroll.

ScrollAnimate is build around these concepts:
1. Scroller
3. Trigger points

2. DOM elements
4. Markers
5. Actions

In more plain english: when markers are within trigger points, actions are performed on elements. Each set of markers, trigger points and elements belongs to a scene.

## Scroller
A scroller is a wrapper for a scrollable element in which elements, markers, trigger points, markers and actions are performed. You may have a infinite number of different scenes on one page. Usually a scene is associated with either the main document body or a inline scroll element.

```js
import Scroller from 'scrollanimate'

let scroller = new ScrollAnimate({
    // set options for scroller
})
```

## Scene
A scene is a container that holds markers, elements and actions.
To add a scene
```js
scroller.addScene(elements, triggers, actions)
```

## DOM elements
Simple DOM elements on which actions are peformed. 
It can be a query string, array of DOM elements, or a single DOM element.
```js
element = '.image'
element = '#id'
element = document.getElementById('element225')
element =[document.getElementById('element225'), document.getElementById('element226')]
```

## Markers
Per default there are two markers, one at the very top (0) and one at the very bottom (window.innerHeight). They are used as references to determine when trigger points should be triggerd.

All above the top marker are invisible
All below the top marker are visible
All above the btoom marker are visible
All below the bottom marker are invisible 

Of course they can be configured and even disabled.
```js
config = {
    topOffset: 0,
    bottomOffset: 0,
    useTop: true,
    useBottom: false
}
```

[img]

## Trgger Points
A trigger point is a set of coordinats determening when a action should be trigger.
It's a object containing begin and end functions return a value.
Values returned from the begin and end functions are both relative to the top marker.
```js
let customTrigger = {
    begin: function(el, rect) {
        // animation should start at 10px from the top marker
        return 10;
    },
    end: function(el, rect) {
        // animation should end at 200px from the top marker
        return 200
    }
}
```

## Actions
An action is either on or off. 

```js
let action = {
    enter: function(el, rect) {
        // trigger when the animation is about to start. We will receive progress updates until leave is called
    },
    progress: function(el, rect) {
        // Fired when element is withtin markers for each scroll event
    },
    leave: function(el, rect) {
        // Trigger when the animation is about to leave. Stop progress updated
    }
}
```




