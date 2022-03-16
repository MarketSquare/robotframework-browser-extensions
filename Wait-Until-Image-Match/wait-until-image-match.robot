*** Settings ***
Documentation    Wait Until Image Match keyword. Wait for the image found at Browser selector to match with the given reference image
...    Resembles the functionality and remove the need to use e.g. SikuliX for image comparison
...    Parameters:
...        ${image}    The name of the reference image to compare with (assuming all reference images are stored under ${IMG_REF} directory as defined below)
...        ${selector}    Any web element selector as defined by Browser library
...        ${timeout}    How long to wait for image to appear (assumes image is not loaded instantly but it takes some time for the image to appear on screen)
...        ${threshold}    Pixelmatch threshold. See the other extension from this repository for explanation
...        ${tolerance}    Tolerance of pixel mismatch, relative to image resolution. Default 1%. Usually images might not compare due to 1 pixel differnce, or more
...                       which can be seen as false negative. This tolerandce solves that, e.g. similar with SikuliX similarities.
...        ${region}      A list of [x, y, width, height], meaning the region within the given image to compare, when it is more desirable to compare only parts of the image
...                       Also sometimes pixelmatch return image size does not match, due to e.g. 1 pixel difference in width, and using a region solves this
...    Created on: 14.03.2022

Library    OperatingSystem
Library    DateTime
Library    Browser    jsextension=${CURDIR}/extension.js


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


*** Keywords ***
Wait Until Image Match
    [Arguments]    ${image}    ${selector}    ${timeout}=${DEFAULT_WAIT}    ${threshold}=${PX_THRESHOLD}    ${tolerance}=${PX_TOLERANCE_PERCENT}    ${region}=@{EMPTY}
    [Documentation]    Wait for the image found at ${selector} to match with the given reference ${image}.

    Wait For Elements State    ${selector}

    # 1. On first run, reference image does not exists and should be created from the screenshot
    ${ref_exists}    Set Variable    ${{ os.path.isfile(r'${IMG_REF}/${image}.png') }}
    IF   not ${ref_exists}
        # Arbitrary sleep so that the reference image is fully loaded before taking screenshot to create it
        Sleep    ${WAIT_FOR_REF_CREATION}
        Take Screenshot    filename=${IMG_OUTPUT}/${image}.png    selector=${selector}
        Copy File    ${IMG_OUTPUT}/${image}.png    ${IMG_REF}/${image}.png
        Move File    ${IMG_OUTPUT}/${image}.png    ${IMG_OUTPUT}/ref_${image}.png
        Log    Reference image does not exists and it was created under: ${IMG_OUTPUT}/ref_${image}.png    WARN
        #${out_path} =    get relpath    ${IMG_OUTPUT}    ${OUTPUT DIR}
        ${out_path} =    Set Variable    ${{ os.path.relpath('${IMG_OUTPUT}', '${OUTPUT DIR}') }}
        Log    Created Reference Image: <img src="${out_path}/ref_${image}.png">    html=True
    END

    # 2. When reference image exists, wait for image match within a time limited loop
    ${res} =    Create List    0    0.00
    ${range} =    Evaluate    int(datetime.timedelta(${timeout}) / datetime.timedelta(${time_inc}))
    ${i} =    Set Variable    1
    FOR    ${i}    IN RANGE    ${range}
        Sleep    ${TIME_INC} s    Wait for image
        Take Screenshot    filename=${IMG_OUTPUT}/${image}.png    selector=${selector}
        IF    $region == []
            ${res}    Compare With Pixelmatch    ${IMG_REF}/${image}.png    ${IMG_OUTPUT}/${image}.png    ${IMG_OUTPUT}/${image}_diff.png    ${threshold}
        ELSE
            ${res}    Compare With Pixelmatch    ${IMG_REF}/${image}.png    ${IMG_OUTPUT}/${image}.png    ${IMG_OUTPUT}/${image}_diff.png    ${threshold}    @{region}
        END
        # end loop if image match perfectly or if not but tolerance percent is lower than given value
        Exit For Loop If    ${res}[0] == 0 or ${res}[1] <= ${tolerance}
        ${timeout}    Subtract Time From Time    ${timeout}    ${time_inc} s
        Exit For Loop If    ${timeout} <= 0
    END

    # 3. Handle result by displaying log when images don't match
    IF    ${res}[0] > 0 and ${res}[1] > 0.00
        Copy File    ${IMG_REF}/${image}.png    ${OUTPUT DIR}/refimg/${image}.png
        #${ref_path} =    get relpath    ${OUTPUT DIR}/refimg    ${OUTPUT DIR}
        #${out_path} =    get relpath    ${IMG_OUTPUT}    ${OUTPUT DIR}
        ${ref_path} =    Set Variable    ${{ os.path.relpath('${IMG_REF_LOG}', '${OUTPUT DIR}') }}
        ${out_path} =    Set Variable    ${{ os.path.relpath('${IMG_OUTPUT}', '${OUTPUT DIR}') }}
        Log    Reference Image: <img src="${ref_path}/${image}.png">    html=True
        Log    Actual Image: <img src="${out_path}/${image}.png">    html=True
        Log    Diff Image: <img src="${out_path}/${image}_diff.png">    html=True
        # Ignore if missmatch percent is lower than specific number (default 0.15?)
        IF    ${res}[1] > ${tolerance}
            IF    not ${ref_exists}
                Log    The creation of the reference image was not successful. Please check and replace it with the actual output/${image}.png and rerun.    ERROR
            ELSE
                Log    Image ${out_path}/${image}.png does not match. ${res}[1]% different pixels found for threshold ${threshold} and tolerance ${tolerance}%: ${res}[0] pixels   ERROR
		    END
            Fail
        #ELSE
        #    Log    Image ${out_path}/${image}.png match with ${res}[1]% different pixels for threshold ${threshold}: ${res}[0]    WARN
        END
	END
