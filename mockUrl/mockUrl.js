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


exports.__esModule = true;
exports.mockUrl = mockUrl
exports.blockUrl= blockUrl
exports.RecordHAR = RecordHAR;
exports.MockWithHar = MockWithHar;
