# mockUrl extension

Small extension to mock / block requests to specific URL's.

## Requirements

* robotframework
* robotframework-browser

## Usage

To enable the keyword:

```robot
*** Settings ***
Library        Browser      jsextension=${CURDIR}/mockUrl.js
```

This adds a keyword 2 keywords, `mockUrl` and  `blockUrl` to your browser library instance.

### mockUrl

it takes one more arguments of dictionary with following keys:

* `url` - URL to mock, absolute or with wildcards.
* `statusCode` - HTTP status code to return for the request
* `contentType` - HTTP Content-Type header to return for the request
* `body`- HTTP body to return for the request

Example:

```robot
*** Variables ***
&{CHAT_MOCK}            url=**/widget/*   contentType=text/plain    statusCode=418   body=I'm a teapot
&{CC_MOCK}              url=**/scripttemplates/*   contentType=text/plain   statusCode=500   body=Internal Server Error
*** Test Cases ***
Does Nothing But Highlghts Usage
  # call mockUrl after New Context && New Page -- but before any navigations.
  mockUrl       ${CHAT_MOCK}
```

### blockUrl

It takes one argument of URL to block, absolute or with wildcards and string for error code. This can be used to block requests to specific URLs that so that it can simulate network errors, host not reachable and stuff like that..

* `url` - URL to mock, absolute or with wildcards.
* `errorCode` - HTTP status code to return for the request

Available error codes are listed in [Playwright API](https://playwright.dev/docs/api/class-route#route-abort) documentation.

Example:

```robot
   VAR   &{BLOCK_WITH_ACCESS_DENIED}   url=https://www.google.com/**    errorCode=accessdenied
   New Browser    chromium
   New Context    baseURL=https://www.google.com
   New Page    about:blank    # New Page has to be called or page.route ain't a function.
   blockUrl    ${BLOCK_WITH_ACCESS_DENIED}
   Go To    /
```


### RecordHAR

To record a HAR file, you can use the `RecordHAR` keyword. This will capture all network requests made during the test execution and save them to a specified file and then later on, this HAR file be used to mock requests using the `MockWithHAR` keyword. Do provide a full path for HAR file since default location will be where playwright has been installed.

Worth pointing out that RecordHAR keyword is not nessarily needed to record the HAR file. New Context can be created with `recordHar`, See [documentatio](https://marketsquare.github.io/robotframework-browser/Browser.html#New%20Context) for more details.

Example:
```robot
    VAR   &{HAR_OPTIONS}   url=**/*    har=${CURDIR}/pcuf.har
    RecordHAR    ${HAR_OPTIONS}
```

### MockWithHAR

Once you have a har recording, you can use the `MockWithHAR` keyword to mock requests based on the recorded HAR file. This will intercept requests and respond with the data from the HAR file. Example of modified har file is found in this repository.

Example:

```robot
    VAR   &{HAR_OPTIONS}   url=**/*    har=${CURDIR}/modified_pcuf.har
    MockWithHar   ${HAR_OPTIONS}
```

## More Examples

See [mockurl_example.robot](./mockurl_example.robot) for full examples.
```
