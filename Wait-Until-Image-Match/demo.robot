*** Settings ***
Resource    wait-until-image-match.robot


*** Test Cases ***   
Wait Until Image Match Test
    New Browser    chromium    headless=false

    New Page    https://robotframework.org/foundation
    Wait For Elements State    .bar >> text=Foundation
    Hover    div[style*='nokia.png']

    # image should match
    Wait Until Image Match    nokia-logo    div[style*='nokia.png']

    # image should match
    Wait Until Image Match    nordea-logo    div[style*='nordea.png']

    # image mismatch, and have different sizes
    ${region} =    Evaluate    ['0','0','160','65']
    Run Keyword And Ignore Error    Wait Until Image Match    nokia-logo    div[style*='nordea.png']    region=${region}

    # image match with given tolerance
    Wait Until Image Match    nokia-logo    div[style*='nordea.png']    region=${region}    tolerance=25.0

    Close Page
    Close Browser
