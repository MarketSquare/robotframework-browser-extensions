# Extension to throttle the network speed in Chromium based browsers
This an extension for Robot Framework Browser Library that lets you throttle the network speed in your test scripts.
Because it uses the Chrome DevTools Protocol, it will only work with the Chromium, Chrome and MS Edge!

To include it in your project, copy the throttle_network.js file into a folder and include it where you instantiate the browser like so:
```
Library        Browser    jsextension=${CURDIR}/path/to/throttle_network.js
```

This library provides 4 keywords:<br> 
- Throttle Network Speed To Slow 3 G 
- Throttle Network Speed To Fast 3 G
- Throttle Network Speed To | downloadSpeedMbps | uploadSPeedMbps | latencyInMilliseconds
- DisableNetworkThrottle<br>


# Requirements:
[Robot Framework](https://github.com/robotframework/robotframework#installation).<br>
[Robotframework-browser](https://github.com/MarketSquare/robotframework-browser?tab=readme-ov-file#installation-instructions).<br>


# Example usage
```
*** Settings ***
Library     Browser    jsextension=${CURDIR}/throttle_network.js


*** Test Cases ***
Network throttle Test
    New Browser    headless=False
    New Context
    New Page
    Set Browser Timeout    60s
    # Set the network speed to realy slow
    Throttle Network Speed To Slow 3 G
    Go To    https://robotframework-browser.org/
    # Set the network speed it little bit faster
    Throttle Network Speed To Fast 3 G
    Go To    https://practicesoftwaretesting.com/
    Throttle Network Speed To    1    1    10
    Go To    https://playwright.dev/
    # Disable the the network speed settings
    Disable Network Throttle
    Go To    https://robotframework.org/
    Sleep    2s
```
