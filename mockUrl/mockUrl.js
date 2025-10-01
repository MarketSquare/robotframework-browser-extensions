async function mockUrl(args, page, logger) {
  for (const arg of args) {
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
    await page.route(String(arg.url), route => {
      route.abort(arg.errorCode || 'failed');
    });
  }
}

async function RecordHAR(args, page, logger, playwright) {
  for (const arg of args) {
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
