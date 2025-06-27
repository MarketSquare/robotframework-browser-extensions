*** Settings ***
Library     Browser    jsextension=${CURDIR}/mockUrl.js


*** Variables ***
${PAYLOAD}          this is a mock response\nfor google.com
&{GOOGLE_MOCK}      url=https://www.google.com/**    contentType=text/plain    statusCode=200    body=${PAYLOAD}

&{BLOCK_1}          url=https://www.google.com/**    errorCode=addressunreachable
&{BLOCK_2}          url=https://www.google.com/**    errorCode=accessdenied
&{BLOCK_3}          url=https://www.google.com/**


*** Test Cases ***
Test Mock Url
    New Browser    chromium
    New Context    baseURL=https://www.google.com
    New Page    about:blank    # New Page has to be called or page.route ain't a function.
    mockUrl    ${GOOGLE_MOCK}
    Go To    /
    Get Text    body    ==    ${PAYLOAD}
    Close Browser

Test Block Url with address unreachable
    New Browser    chromium
    New Context    baseURL=https://www.google.com
    New Page    about:blank    # New Page has to be called or page.route ain't a function.
    blockUrl    ${BLOCK_1}
    TRY
        Go To    /
        Fail    The page should not have loaded
    EXCEPT
        No Operation
    END

Test Block Url with access denied
    New Browser    chromium
    New Context    baseURL=https://www.google.com
    New Page    about:blank    # New Page has to be called or page.route ain't a function.
    blockUrl    ${BLOCK_2}
    TRY
        Go To    /
        Fail    The page should not have loaded
    EXCEPT
        No Operation
    END

Test Block Url without error code
    New Browser    chromium
    New Context    baseURL=https://www.google.com
    New Page    about:blank    # New Page has to be called or page.route ain't a function.
    blockUrl    ${BLOCK_3}
    TRY
        Go To    /
        Fail    The page should not have loaded
    EXCEPT
        No Operation
    END
