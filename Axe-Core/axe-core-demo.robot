*** Settings ***
Library           Browser    jsextension=${CURDIR}${/}axe-core-extension.js
Library           Collections

*** Test Cases ***
AXE DEMO
    New Page    https://robotframework-browser.org
    Wait Until Network Is Idle
    Generate Axe Results

*** Keywords ***
Generate Axe Results
    [Arguments]    ${loglevel}=WARN
    [Documentation]    expects AxeAnalyzePage keyword as a Browser extention
    ...    This keyword will give a summery of the results as a Warning in the RF logs
    ...    To get a better understanding of the output and specifically it's nesting
    ...    refer to: https://github.com/dequelabs/axe-core/blob/master/doc/API.md#results-object
    ...    Also read the documentation in AxeAnalyzePage in axe-core-extention.js
    ...    ${/n}
    ...    This keyword deliberately creates more chuncs of information in step 3 than needed,
    ...    to help you start customizing this to your need.
    ...    ${/n}
    ...    You can adjust the loglevel. Adjusting to 'INFO' would mean, no summary will be visible
    ...    on the top of your RF logs.
    # 1. Checks if ${INDEX} exists within current scope
    ${status}    Run Keyword and return status    Variable Should Exist    ${INDEX}
    IF    ${status} == ${FALSE}
        ${INDEX}    Set Variable    ${1}
    ELSE
        ${INDEX}    Set Variable    ${INDEX + 1}
    END
    Set Test Variable    ${INDEX}    ${INDEX}
    # 2. RUN Axe on current Page
    #    The keyword AxeAnalyzePage comes from axe-core-extension.js
    &{results}    AxeAnalyzePage    ${OUTPUT_DIR}    ${TEST_NAME}_${INDEX}.html
    # 3. Split results in to chuncks
    ${testEngine}    Get From Dictionary    ${results}    testEngine
    ${testRunner}    Get From Dictionary    ${results}    testRunner
    ${testEnvironment}    Get From Dictionary    ${results}    testEnvironment
    ${timestamp}    Get From Dictionary    ${results}    timestamp
    ${wcag_url}    Get From Dictionary    ${results}    url
    ${toolOptions}    Get From Dictionary    ${results}    toolOptions
    ${violations}    Get From Dictionary    ${results}    violations
    ${passes}    Get From Dictionary    ${results}    passes
    ${incomplete}    Get From Dictionary    ${results}    incomplete
    ${inapplicable}    Get From Dictionary    ${results}    inapplicable
    Log Many    ${testEngine}[name]    ${testEngine}[version]
    ${violations_count}    Get Length    ${violations}
    ${passes_count}    Get Length    ${passes}
    ${incomplete_count}    Get Length    ${incomplete}
    ${inapplicable_count}    Get Length    ${inapplicable}
    ${count}    Get Length    ${violations}
    ${html_body}    Set Variable
    FOR    ${violationNumber}    ${violation}    IN ENUMERATE    @{violations}
        ${nodes}    Get From Dictionary    ${violation}    nodes
        @{targets}    Create List
        FOR    ${node}    IN    @{nodes}
            ${target}    Get From Dictionary    ${node}    target
            Append To List    ${targets}    ${target}
        END
        ${found}    Get Length    ${targets}
        # 4. Here the rows of the table are build for each violation
        ${html_body}    Catenate
        ...    ${html_body}<tr><td>${violation.description}</td><td style="text-align:center">${violation.impact}</td><td style="text-align:center">${found}:${\n}${targets}</td></tr>
    END
    # 5. Here the table header and closing of the table is generated
    ${html_headers}    Catenate
    ...    <style>#demo table, #demo th, #demo td{border: 1px dotted black;border-collapse: collapse;table-layout: auto;}</style><P style="text-align:left"><strong><a href="${OUTPUT_DIR}${/}AxeReport${/}${TEST_NAME}_${INDEX}.html">WCAG Summary for ${wcag_url}</strong></a></p><table id="demo" style="width:100%%"><tr><th style="width:40%%">Issue</th><th style="width:7%%">Impact</th><th style="width:5%%">Elements Affected</th></tr>
    ${html_end}    Catenate    </table>
    # 6. Here a quick summary to include is generated
    ${html_footer}    Catenate
    ...    <p><b>Total</b> passes: ${passes_count} | violations: ${violations_count} | incomplete: ${incomplete_count} | inapplicable: ${inapplicable_count}
    IF    ${violations_count} > 0
        Log    message=${html_headers}${html_body}${html_end}${html_footer}    level=${loglevel}    html=True
    END
