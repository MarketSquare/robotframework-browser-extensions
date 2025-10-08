const _errorCodes = [
  'aborted',
  'accessdenied',
  'addressunreachable',
  'blockedbyclient',
  'blockedbyresponse',
  'connectionaborted',
  'connectionclosed',
  'connectionfailed',
  'connectionrefused',
  'connectionreset',
  'internetdisconnected',
  'namenotresolved',
  'timedout',
  'failed']


function _checkProperties(requiredProps, obj) {
  for (const prop of requiredProps) {
    if (Object.hasOwn(obj, prop) == false) {
      throw Error(`Provided argument object doesnt have required property ${prop}`)
    }
  }
}

async function mockUrl(args, page, logger) {
  for (const arg of args) {
    _checkProperties(["url", "statusCode", "contentType", "body"], arg)
    await page.route(String(arg.url), route => {
      route.fulfill({
        status: parseInt(arg.statusCode, 10),
        contentType: String(arg.contentType),
        body: String(arg.body)
      });
    });
  }
}

mockUrl.rfdoc = `
    Keyword adds a mock response to any request browser makes.
    = Argument information =
    - \`mockData\`  single or list of dictionaries containing following members: \`url\`,  \`statusCode\`, \`contentType\` & \`body\`. All arguments are required
`

async function blockUrl(args, page, logger) {
  for (const arg of args) {
    _checkProperties(["url"], arg)
    if (_errorCodes.includes(arg.errorCode) || arg.errorCode === undefined || arg.errorCode === null) {
      await page.route(String(arg.url), route => {
        route.abort(arg.errorCode || 'failed');
      });
    } else {
      throw Error(`Provided errorCode ${arg.errorCode} is not valid errorcode.\nSee: https://playwright.dev/docs/api/class-route#route-abort-option-error-code `)
    }
  }
}

blockUrl.rfdoc = `
    Keyword sets up a browser to prevent network requests from being sent.
    = Argument information =
    - \`blockData\`  single or list of dictionaries containing following members \`url\` & \`errorCode\` where \`errorCode\` is optional and defaults to \`failed\` if not provided.\nCurrently supported errorCodes: \`aborted\`, \`accessdenied\`, \`addressunreachable\`, \`blockedbyclient\`, \`blockedbyresponse\`, \`connectionaborted\`, \`connectionclosed\`, \`connectionfailed\`, \`connectionrefused\`, \`connectionreset\`, \`internetdisconnected\`, \`namenotresolved\` and \`timedout\` and  \`failed\`
`

async function RecordHAR(args, page, logger, playwright) {
  for (const arg of args) {
    _checkProperties(["url", "har"], arg)
    await page.routeFromHAR(arg.har, {
      url: arg.url,
      update: true,
      updateMode: "full",
      notFound: "fallback"
    });
  }
}

RecordHAR.rfdoc = `
    Keyword records network requests to provided HAR file.
    = Argument information =
    - \`harData\`  single or list of dictionaries containing following members \`url\` & \`har\` where \`har\` is the path to HAR file where recorded data is stored.
`

async function MockWithHar(args, page, logger, playwright) {
  for (const arg of args) {
    _checkProperties(["url", "har"], arg)
    await page.routeFromHAR(arg.har, {
      url: arg.url,
      update: false,
      notFound: "fallback"
    });
  }
}

MockWithHar.rfdoc = `
    Keyword sets up mocked requests from provided HAR file.
    = Argument information =
    - \`harData\`  single or list of dictionaries containing following members \`url\` & \`har\` where \`har\` is the path to HAR file thats used to setup mocked responses.
`



exports.__esModule = true;
exports.mockUrl = mockUrl
exports.blockUrl= blockUrl
exports.RecordHAR = RecordHAR;
exports.MockWithHar = MockWithHar;
