*** Settings ***

Library        Browser
...            jsextension=./Highlighter.js


*** Variables ***
${URL}    https://robotframework-browser.org/

# Nave menu
${introduction_a}        \#navigation a[href='\#introduction']
${robocon_a}             \#navigation a[href='\#robocon-talk']
${community_a}           \#navigation a[href='\#community']
${intro_head}            //div[./h1[text()='Introduction']]
${intro_body}            //div[./p[contains(text(),'Browser library powered by')]]
${intro_talk_body}       //div[./p[contains(text(),'team gave this introduction talk')]]

*** Test Cases ***
Highlight Browser Library
        Open Browser
    ...  ${URL}

    [Documentation]  Shows off thehighlighter using different page elements. 

    Highlight Element  ${introduction_a}  red     blue    0.35
    Highlight Element  ${robocon_a}       green   yellow  0.75
    Highlight Element  ${community_a}     yellow  purple  1.00
    Sleep  2
    Remove Highlight   ${introduction_a}  
    Remove Highlight   ${robocon_a}
    Remove Highlight   ${community_a}


Blinking Highlight Custom Keyword Demo Browser Library Homepage
    Open Browser
    ...  ${URL}
    
    [Documentation]  Shows off a keyword made using a highlight element. We use this keyword
    ...    for visual debugging and to automate the website during demos or tutorial recordings.

    Highlight Object Blink  ${introduction_a}
    Highlight Object Blink  ${robocon_a}
    Highlight Object Blink  ${community_a}
    Highlight Object Blink  ${intro_head}
    Highlight Object Blink  ${intro_body}    
    Highlight Object Blink  ${intro_talk_body}


*** Keywords ***
Highlight Object Blink  [Arguments]
    ...  ${locator}
    ...  ${duration}=1.00
    ...  ${background_color}=purple
    ...  ${border_color}=green
    ...  ${opacity}=0.35
    
    [Documentation]  Highlights the element for a set duration then removes the highlight.

    Scroll To ELement  ${locator}

    Highlight Element  
    ...  ${locator}
    ...  ${background_color}
    ...  ${border_color}
    ...  ${opacity}
    
    Sleep  ${duration}

    Remove Highlight  ${locator}
