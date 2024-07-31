*** Settings ***
Library     Browser    jsextension=${CURDIR}${/}throttle_network.js


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
