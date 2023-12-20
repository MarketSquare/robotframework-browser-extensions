# Highlighter

This plugin provides an alternative to the built-in highlight option of BrowserLibrary. We found using the default option with a border could cause page layout issues, providing us with weird screenshots and preventing us from using it with site demos or recordings. This highlighter creates a DOM element on z-layer 50000 with that overlays the target element, avoiding those issues.

The provided demo file has two simple tests in place to show using the highlight with various colors and opacities. It also shows off one keyword we use internally to highlight objects during visual test debugging/development and when we create tutorial videos, 'Highlight Object Blink.' 

To run the provided demo file, run the following command inside the highlighter directory: `robot .`

To include it in your project, copy the Highlight.js file into a folder and including it where you instantiate browser like so:

```sh
Library        Browser
...            jsextension=./path/to/Highlighter.js
```

This library provides two keywords with the following parameters.

`Highlight Element`
- **locator**  : (string) Locator string (xpath, css, id)
- **bgColor**  : (string) Background color of highligter. Part that actually covers the element. CSS style color.
- **brdrColor** : (string) Border color of highlight. Wraps highlighter element to help draw attention. CSS style color.
- **opacity**  : (string|float) The opacity of the background color. We tend towards lighter opacity levels so element could still be seen through the overlay. Value is between 0 and 1.

`Remove Highlight`
- **locator**  : (string) Locator string (xpath, css, id)

Authors: 
<br> W. Wells III (waynewellsiii)
<br> T. Erckert (terckert)