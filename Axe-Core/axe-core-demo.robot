*** Settings ***
Library           Browser    jsextension=${CURDIR}${/}axe-core-extension.js
Library           Collections


*** Variables ***
${PAGE}.   https://robotframework.org

*** Test Cases ***
AXE DEMO
    New Page    ${PAGE}
    Wait Until Network Is Idle    timeout=20s
    Generate Axe Results

*** Keywords ***
Generate Axe Results
    [Documentation]    expects AxeAnalyzePage keyword as a Browser extention
    ...    This keyword will give a summery of the results as a Warning in the RF logs
    ...    To get a better understanding of the output and specifically it's nesting
    ...    refer to: https://github.com/dequelabs/axe-core/blob/master/doc/API.md#results-object
    ...    Also read the documentation in AxeAnalyzePage in extentions.js
    ...    This keywords has two optional keywords: you can set the name of the report folder and the loglevel
    #Check of ${INDEX} bestaat binnen de huidige scope
    [Arguments]    ${Reportfolder}=AxeReport    ${loglevel}=WARN
    ${status}    Run Keyword and return status    Variable Should Exist    ${INDEX}
    IF    ${status} == ${FALSE}
        ${INDEX}    Set Variable    ${1}
    ELSE
        ${INDEX}    Set Variable    ${INDEX + 1}
    END
    Set Test Variable    ${INDEX}    ${INDEX}
    #RUN Axe on current Page
    Create Directory    ${OUTPUT_DIR}${/}${Reportfolder}
    &{results}    AxeAnalyzePage    ${OUTPUT_DIR}    ${Reportfolder}    ${TEST_NAME}_${INDEX}.html
    #If you want to extend the keyword with passes also, you can start here
    #${passes}    Get From Dictionary    ${results}    passes
    #FOR    ${index}    ${pass}    IN ENUMERATE    @{passes}
    #    Log    ${pass}
    #END
    ${html_body}    Set Variable
    FOR    ${violationNumber}    ${violation}    IN ENUMERATE    @{results.violations}
        ${nodes}    Get From Dictionary    ${violation}    nodes
        @{targets}    Create List
        # targets are the classes which have a violation
        FOR    ${node}    IN    @{nodes}
            ${target}    Get From Dictionary    ${node}    target
            Append To List    ${targets}    ${target}
        END
        ${found}    Get Length    ${targets}
        #Here the rows of the table are build for each violation
        ${html_body}    Catenate
        ...    ${html_body}<tr><td>${violation.description}</td><td style="text-align:center">${violation.impact}</td><td style="text-align:center">${found}:${\n}${targets}</td></tr>
    END
    #below is the header of the table
    ${html_headers}    Catenate
    ...    <style>#demo table, #demo th, #demo td{border: 1px dotted black;border-collapse: collapse;table-layout: auto;}</style><P style="text-align:left"><strong><a href="${OUTPUT_DIR}${/}AxeReport${/}${TEST_NAME}_${INDEX}.html">WCAG Summary for ${results}[url]</strong></a></p><table id="demo" style="width:100%%"><tr><th style="width:40%%">Issue</th><th style="width:7%%">Impact</th><th style="width:5%%">Elements Affected</th></tr>
    #below the closing tag of the table
    ${html_end}    Catenate    </table>
    #below is the footer under the table
    ${html_footer}    Catenate
    ...    <p><b>Total</b> passes: ${{ len (${results}[passes]) }} | violations: ${{ len (${results}[violations]) }} | incomplete: ${{ len (${results}[incomplete]) }} | inapplicable: ${{ len (${results}[inapplicable]) }}
    #Logs the violations if there are any. Depending on loglevel this wil be shown as a warn (default) or any other RF supported loglevel.
    IF    ${{ len (${results}[violations]) }} > 0
        Log    message=${html_headers}${html_body}${html_end}${html_footer}    level=${loglevel}    html=True
    END
