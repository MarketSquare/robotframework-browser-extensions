async function playwrightPageMethod(page_method, page, logger) {
    const playwright_function = '(page.' + page_method + ')';
    logger("Executing Playwright Page method: " + page_method)
    return await eval(playwright_function);
}

function convertLocatorToBrowser(playwright_locator, logger) {
    if (typeof playwright_locator == "object") {
        const browser_locator = playwright_locator['_selector']
        logger("Locator converted to : " + browser_locator)
        return browser_locator;
    } else {
        throw new Error("convertPlaywrightLocatorToBrowser: playwright_locator is not an object");
    }
}

playwrightPageMethod.rfdoc = `
This keyword executes a Playwright Page method. 

Parameters: page_function : (string) The page method to be executed in Playwright.

Examples
| Playwright Page Method  getByRole('link', { name: 'Get started' }).click()
| Playwright Page Method  getByRole('listitem').filter({ has: page.getByRole('heading', { name: 'Product 2' }) }).getByRole('button', { name: 'Add to cart' }).click();
`

convertLocatorToBrowser.rfdoc = `
Converts a returned PlaywrightPageMethod locator to a BrowserLibrary locator.

Parameters: playwright_locator : (object) Playwright locator object.

Example:
|  \${pw_locator}    Playwright Page Method    getByRole('link', { name: 'Get started' })
|  \${bl_locator}    Convert Locator To Browser    {pw_locator}
|  Click  \${bl_locator}
`

exports.__esModule = true;
exports.playwrightPageMethod = playwrightPageMethod;
exports.convertLocatorToBrowser = convertLocatorToBrowser;
