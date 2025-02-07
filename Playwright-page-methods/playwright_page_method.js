const path = require('node:path');
const { expect } = require(path.resolve('node_modules/playwright/test'));

async function playwrightPageMethod(page_method, page, logger) {
    const playwright_function = '(page.' + page_method + ')';
    logger("Executing Playwright Page method: " + page_method)
    const result = await eval(playwright_function);
    // If the result is an object we assume it's a locator so we return the _selector property of the locator object
    if (typeof result == "object") {
        return result._selector;
    } else {
        return result;
    }
}

async function playwrightJS(statement, page, logger) {
    const playwright_statement = '(' + statement + ')';
    logger("Executing Playwright method: " + statement)
    const result = await eval(playwright_statement);
    // If the result is an object we assume it's a locator so we return the _selector property of the locator object
    if (typeof result == "object") {
        return result._selector;
    } else {
        return result;
    }
}

playwrightPageMethod.rfdoc = `
This keyword executes a Playwright Page method. 

Parameters: page_method : (string) The page method to be executed in Playwright.

Example
| Playwright Page Method  getByRole('link', { name: 'Get started' }).click()
`

playwrightJS.rfdoc = `
This keyword executes a JavaScript Playwright statement, which can be page methods including assertions.
Except for the following assertions which are not supported: 
| expect(page).toHaveScreenshot()
| expect(page).toMatchSnapshot()

Parameters: statement : (string) The Playwright statement to be executed.

Example
| Playwright JS  page.getByRole('link', { name: 'Get started' }).click()
| Playwright JS  expect(page.getByRole('link', { name: 'Get started' })).toBeVisible()
`

exports.__esModule = true;
exports.playwrightPageMethod = playwrightPageMethod;
exports.playwrightJS = playwrightJS;
