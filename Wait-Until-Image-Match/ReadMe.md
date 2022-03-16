# Wait Until Image Match

`Wait Until Image Match` keyword. Wait for the image found at Browser selector to match with the given reference image. Resembles some functionality and might remove the need to use e.g. SikuliX or ImageHorizon libraries alternatives for image comparison.

`Wait Until Image Match    ${image}    ${selector}    ${timeout}=${DEFAULT_WAIT}    ${threshold}=${pixelmatch_threshold}    ${tolerance}=${pixelmatch_tolerance_percent}    ${region}=@{EMPTY}`

Parameters:
- ${image}    The name of the reference image to compare with (assuming all reference images are or will be stored under ${IMG_REF} directory as defined below)
- ${selector}    Any web element selector that can be defined when using Browser library
- ${timeout}    How long to wait for image to appear (sometimes image is not loaded instantly but it takes some time for it to appear on screen)
- ${threshold}    Pixelmatch threshold. See Compare_Images extension from this repository for detailed explanation
- ${tolerance}    Tolerance of pixel mismatch relative to image resolution. Default 1%. Usually images might not compare due to 1 pixel differnce, or more which can be seen as false negative. This tolerandce solves that, e.g. somehow similar with SikuliX or ImageHorizon similarities.
- ${region}      A list of [x, y, width, height], meaning the region within the given image to compare, when it is more desirable to compare only parts of the image. Also sometimes the selector screenshot size is different from reference image, thus pixelmatch will fail with image size does not match, due to e.g. 1 pixel difference in width. Using a region to compare with will solve this issue.

Since it is not possible to take the screenshots manually for a particular selector, the reference images are generated during first run and stored under ${IMG_REF} directory, as defined within `wait-until-image-match.robot` file.


```
*** Variables ***
# default timeout to wait for image to be displayed on screen
${DEFAULT_WAIT}    5
# default pixelmatch threshold
${PX_THRESHOLD}    0.1
# default pixelmatch tolerance percentage
${PX_TOLERANCE_PERCENT}    1.0
# how long to wait for reference image creation on first run (e.g. if some complex imagees might need more time to be generated)
${WAIT_FOR_REF_CREATION}    3s

# The sleep interval in seconds or increment to wait image for
${TIME_INC}    1

${IMG_REF}    ${CURDIR}/Test data
${IMG_OUTPUT}    ${OUTPUT DIR}/output/images
${IMG_REF_LOG}    ${OUTPUT DIR}/refimg
```

Some samples on how to use this keyword can be found within `demo.robot` file, e.g.

```
    # image should match
    Wait Until Image Match    nokia-logo    div[style*='nokia.png']
    
    # compare region of image
    ${region} =    Evaluate    ['0','0','160','65']
    Wait Until Image Match    nokia-logo    div[style*='nokia.png']    region=${region}    tolerance=10.0
```

where `nokia-logo` is the name of the reference image and `div[style*='nokia.png']` is the browser selector.

## How to run

- Within command prompt, go to your Python path, and then Browser wrapper (e.g. C:\Python3x\Lib\site-packages\Browser\wrapper) and run `npm install pixelmatch`, `npm install fs`, `npm install sharp`
- Then go to wait-until-image-match folder after downloading this extension and run `robot demo.robot`

## Example output

Executed example will result in:
1. [first-run-log](https://marketsquare.github.io/robotframework-browser-extensions/wait-until-image-match/demo-log/first-run-log.png)
2. [second-run-log](https://marketsquare.github.io/robotframework-browser-extensions/wait-until-image-match/demo-log/second-run-log.png)
3. [details-log](https://marketsquare.github.io/robotframework-browser-extensions/wait-until-image-match/demo-log/details-log.png)

