# Using Axe-Core with Robot Framework ® Browser

This is an extension for Robot Framework ® Browser, leveraging [Axe Core for Playwright](https://www.npmjs.com/package/@axe-core/playwright) made and maintained by [Deque](https://deque.com/). Basically, this is what you could use in your automated tests and would give you the results you probably know from the Axe DevTools Browser plugin.

## Requirements:

1. Robot Framework => 4     | `pip install -U robotframework`
2. Robotframework-browser   | `pip install robotframework-browser` ⚠️ requires other installation steps, refer to the libraries own documentation
3. @axe-core/playwright     | `npm install @axe-core/playwright` 
4. axe-html-reporter        | `npm install axe-html-reporter`

The additional npm packages mentioned can be installed by using the package.json file. Run `npm i .` in the folder where the package.json file is. This could be the folder where you execute your tests, or, if you know what you're doing at another location.

## Usage
For example usage, please have a look in `axe-core-demo.robot` which is kind of self-documenting

## Example output

Executed example will result in:
1. [Robotframework logging](https://marketsquare.github.io/robotframework-browser-extensions/rflog-axe-core.html)
2. [Axe html report](https://marketsquare.github.io/robotframework-browser-extensions/AXE%20DEMO_1.html)
