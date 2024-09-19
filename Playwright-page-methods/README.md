# Playwright page methods
This an extension for Robot Framework Browser Library that lets you execute Playwright page methods.
To include it in your project, copy the playwright_page_method.js file into a folder and include it where you instantiate the browser like so:
```
Library        Browser    jsextension=${CURDIR}/path/to/playwright_page_method.js
```

# Requirements:
[Robot Framework](https://github.com/robotframework/robotframework#installation).<br>
[Robotframework-browser](https://github.com/MarketSquare/robotframework-browser?tab=readme-ov-file#installation-instructions).<br>

# Example usage
```
*** Settings ***
Library     Browser    jsextension=${CURDIR}/playwright_page_method.js


*** Test Cases ***
Native Playwright
    New Browser    headless=False
    New Context
    New Page    https://playwright.dev
    ${btn_txt}    Playwright Page Method    getByRole('link', { name: 'Get started' }).innerText()
    Log To Console    btn txt= ${btn_txt}
    Playwright Page Method    getByRole('link', { name: 'Get started' }).click()
    Playwright Page Method    getByLabel('Search').click()
    Playwright Page Method    getByLabel('Search').nth(1).type('locators')
    ${pw_locator}    Playwright Page Method    getByRole('link', { name: 'FrameLocator' })
    ${clickme}       Convert Locator To Browser    playwright_locator=${pw_locator}
    Click            ${clickme}
    Sleep    3s

```
