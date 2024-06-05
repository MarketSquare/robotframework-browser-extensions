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

This adds a keyword `mockUrl` to your browser library instance and it takes one more arguments of dictionary with following keys:

* `url` - absolute URL to mock
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

See [mockurl_example.robot](./mockurl_example.robot) for full example.
```
