*** Settings ***
Library     Browser    jsextension=${CURDIR}/playwright_page_method.js


*** Test Cases ***
Native Playwright
    New Browser    headless=False
    New Context    viewport={'width': 1280, 'height': 720}
    New Page    https://playwright.dev
    ${btn_txt}    Playwright Page Method    getByRole('link', { name: 'Get started' }).innerText()
    Log To Console    btn txt= ${btn_txt}
    Playwright Page Method    getByRole('link', { name: 'Get started' }).click()
    Playwright Page Method    getByLabel('Search').click()
    Playwright Page Method    getByLabel('Search').nth(1).type('locators')
    ${pw_locator}    Playwright Page Method    getByRole('link', { name: 'FrameLocator' })
    Click    ${pw_locator}
    Sleep    3s

Playwright Assertions
    New Browser    headless=False
    New Context    viewport={'width': 1800, 'height': 720}
    New Page
    #    Navigate to the page
    Playwright JS    page.goto('https://practicesoftwaretesting.com/')
    # Search for Thor hammer and add to cart
    Playwright JS    page.locator('[data-test="search-query"]').fill('Thor hammer')
    Playwright JS    page.locator('[data-test="search-submit"]').click()
    Playwright JS    page.locator('a.card').getByText('Thor Hammer').click()
    Playwright JS    page.locator('[data-test="add-to-cart"]').click()
    Playwright JS    expect(page.locator('div.toast-success')).toHaveText('Product added to shopping cart.')
    # Go back to the homepage
    Playwright JS    page.locator('[data-test="nav-home"]').click()
    # Search for Bolt Cutters and add 2 to cart
    Playwright JS    page.locator('[data-test="search-query"]').fill('Bolt Cutters')
    Playwright JS    page.locator('[data-test="search-submit"]').click()
    Playwright JS    page.locator('a.card').getByText('Bolt Cutters').click()
    Playwright JS    page.locator('[data-test="increase-quantity"]').click()
    Playwright JS    page.locator('[data-test="add-to-cart"]').click()
    # Check total quantity shopping cart
    Playwright JS    expect(page.locator('[data-test="cart-quantity"]')).toContainText('3')
    Playwright JS    page.locator('[data-test="nav-cart"]').click()
    # Check quantity for Thor Hammer
    Playwright JS    expect(page.getByLabel('Quantity for Thor Hammer')).toHaveValue('1')
    # Check quantity for Bolt Cutters
    Playwright JS    expect(page.getByLabel('Quantity for Bolt Cutters')).toHaveValue('2')
