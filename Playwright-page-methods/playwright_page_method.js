async function playwrightPageMethod(page_method, page, logger) {
    const playwright_function = '(page.' + page_method + ')';
    logger("Executing Playwright Page method: " + page_method)
    return eval(playwright_function);
}

playwrightPageMethod.rfdoc = `
This keyword executes a Playwright Page method. 

Parameters: page_function : (string) The page method to be executed in Playwright.

Example
| Playwright Page Method  getByRole('link', { name: 'Get started' }).click()
`

exports.__esModule = true;
exports.playwrightPageMethod = playwrightPageMethod;
