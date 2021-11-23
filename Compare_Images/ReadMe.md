# Comparing Screenshots with Robotframework-Browser

Have you heard yet of the new Browser library? It's brings Playwright technology to my favorite testing tool: Robot Framework.

Since I'm on a GIS assignment when writing this, and I'm comparing maps, I needed some extra functionality. Browser gives you the possibility to [extend it's functionality with CommonJS](https://marketsquare.github.io/robotframework-browser/Browser.html#Extending Browser library with a JavaScript module).

Together with my front-end colleague,  we've created a code snippet, which you can find in [above](https://github.com/MarketSquare/robotframework-browser-extensions/blob/main/Compare_Images/pixelmatch.js). Note, that there's no exeption handeling for arg[1], as we've decided that this keyword will always be called **after** we've taken the "Actual" screenshot.

```js
function CompareImagesWithPixelmatch(page, args, logger)  {
		const fs = require('fs');
		const PNG = require('pngjs').PNG;
		const pixelmatch = require('pixelmatch');
		let img1;
		try {
			img1 = PNG.sync.read(fs.readFileSync(args[0]));
		} catch (error) {
			if (error.code === 'ENOENT') {
				throw Error("File not found: "+args[0]);
			} else {
				throw error;
			}  
		}
		const img2 = PNG.sync.read(fs.readFileSync(args[1]));
		const {width, height} = img1;
		const diff = new PNG({width, height});
		const result = pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: args[3]});
		fs.writeFileSync(args[2], PNG.sync.write(diff));
		if (result>0){
			logger("Different pixels found: "+result)
			throw Error("Images do not match: "+args[2]);
		}
	}
	
	exports.__esModule = true;
	exports.CompareImagesWithPixelmatch = CompareImagesWithPixelmatch;
```

To use this in Robot Framework, you can go forth like:

```
***settings***
LIBRARY  Browser   jsextension=${CURDIR}${/}pixelmatch.js

*** Test Cases ***
Compare with baseline
    CompareImagesWithPixelmatch  ${baseline}  ${actual}  ${diff}  ${Threshold}
```

What this does is: it takes an actual screenshot from your test run, compares it with a baseline, spits out a neat diff image, all based on a Threshold. To understand how this threshold works, I'm going to refer to https://observablehq.com/@mourner/pixelmatch-demo. It's been described and you can play with it at the same time, so I think there is no better clarification done. It's an excellent post.

Now to make even more use of the keyword we've just created, you'll now need some more logic around this. Although this could be done much nicer in python, I've for this purpose just made the logic with existing Robot Framework keywords. Here we go.

Let's say we want to call a keyword, that creates an Actual.png image, all within the [scope](http://robotframework.org/robotframework/latest/RobotFrameworkUserGuide.html#variable-scopes) of Testcase. And we also want to be able, to call this keyword multiple times within this scope. This requires some logic around an Index. Although the Browser keyword "Take Screenshot" provides a {index} parameter, this cannot be used in other parts of the keyword we're going to create, so we start from scratch. 

```sh

Compare images with pixelmatch
    [Documentation]    This keywords will require an 'actual' directory. Can be called 
    ...    multiple times in one Test.
    ...    Directory names will be name of test, containing ${index}.png. 
    ...    Requires following npm packages to work:
    ...    | npm install pixelmatch
    ...    | npm install fs
    [Arguments]    ${selector}=None    ${Threshold}=0.15
    #Check if ${INDEX} exists within scope, set to 1 if it doesn't, otherwise increase
    #by one
    ${status}    Run Keyword and return status    Variable Should Exist    ${INDEX}
    ${INDEX}    Run Keyword if    ${status} == ${FALSE}    Set Variable    ${1}    ELSE   
    ...   Set Variable    ${INDEX + 1}
    Set Test Variable    ${INDEX}    ${INDEX}
    #Replace spaces in testname with underscore
    ${TEST_NAME}    Replace String    ${TEST NAME}    ${SPACE}    _
    #Create the directories
    Create Directory    ${EXECDIR}${/}baseline${/}${TEST_NAME}
    Create Directory    ${OUTPUTDIR}${/}actual${/}${TEST_NAME}
    Create Directory    ${OUTPUTDIR}${/}diff${/}${TEST_NAME}
    #Make screenshot. Note that Browser library sets the img extention, so we're only
    #using ${INDEX} as filename.
    Take Screenshot    ${OUTPUTDIR}${/}actual${/}${TEST_NAME}${/}${INDEX}    ${selector}
    #For readablilty: set full paths to baseline, actual en diff in a scalar variable
    ${baseline}  Convert To String  ${EXECDIR}${/}baseline${/}${TEST_NAME}${/}${INDEX}.png
    ${actual}    Convert To String  ${OUTPUTDIR}${/}actual${/}${TEST_NAME}${/}${INDEX}.png
    ${diff}      Convert To String  ${OUTPUTDIR}${/}diff${/}${TEST_NAME}${/}${INDEX}.png
    #finally do the magic, without ImgMagick (ツ)
    CompareImagesWithPixelmatch    ${baseline}    ${actual}    ${diff}    ${Threshold}

```

