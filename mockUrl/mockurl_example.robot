*** Settings ***
Library         Browser   jsextension=${CURDIR}/mockUrl.js

*** Variables ***
${PAYLOAD}                this is a mock response\nfor google.com
&{GOOGLE_MOCK}            url=https://www.google.com/**   contentType=text/plain    statusCode=200   body=${PAYLOAD}

*** Test Cases ***
Test Mock Url
    New Browser   chromium
    New Context   baseURL=https://www.google.com
    New Page      about:blank   # New Page has to be called or page.route ain't a function.
    mockUrl       ${GOOGLE_MOCK}
    Go To         /
    Get Text      body    ==    ${PAYLOAD}
    Close Browser
