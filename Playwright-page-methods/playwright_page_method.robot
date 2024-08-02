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
    Playwright Page Method    getByRole('link', { name: 'Filtering Locators​ Locators' }).click()
    Sleep    5s
