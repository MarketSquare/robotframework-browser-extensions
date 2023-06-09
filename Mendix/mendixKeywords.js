function defineDate(operator, datetype, increment, form) {
    const { add, sub, format } = require('date-fns')
    const date = new Date()
    if (operator === '>') {
        var result = add((date), { [datetype]: increment })
    }
    else if (operator === '<') {
        var result = sub((date), { [datetype]: increment })
    }
    else {
        var result = date
    }
    var endResult = format(result, form)
    return endResult
}

async function pageFill(page, logger, locator, input, clear) {
    if (clear === true) {
        await page.fill(locator, "");
    }
    await page.fill(locator, input);
    logger(`Fills in the text '${input}' in the given field. \nClear value was '${clear}'.`)
}

async function mendixText(page, logger, label, input, occurrence = 1, clear = true) {
    locator = `(//label[text() = "${label}"]/following::input[1])[${occurrence}]`
    await pageFill(page, logger, locator, input, clear)
    logger(`Text input element was found by selector '${locator}'.`)
}

mendixText.rfdoc = `
    Fills the given \`input\` into the corresponding text input element which is found by \`label\`.

    The keyword will wait for the input element, corresponding to \`label\`, to become visible and interactable before filling in the text.
    If the element is not an input element this keyword will fail.

    = Argument information =
    - \`label\`: Label corresponding to the input element.
    - \`input\`: The text to be filled in.
    - \`occurrence\`: If the combination \`label\` and \`input\` is not unique, within the current page, the occurrence can be used to select the needed element. By default occurrence is set to 1, but this can be changed to 2 or greater.
    - \`clear\`: By default every text input will be cleared before filling in the text. If this is not desired clear can be set to _false_ and thus add the text as an addition to the already existing text.

    = Examples =
    == Basic usage ==
    In below example the basic usage is illustrated where user wants to fill in username.
    | =Keyword= | =label= | =input= | =occurrence= | =clear= |
    | Mendix Text | Username | \${username} | _N/A_ | _N/A_ |

    == Advanced usage ==
    In below example two of the same input elements are being detected and both have to be filled in.
    | =Keyword= | =label= | =input= | =occurrence= | =clear= |
    | Mendix Text | Phone number | \${phoneNumber} | _N/A_ | _N/A_ |
    | Mendix Text | Phone number | 0612345678 | 2 | _N/A_ |
    Above illustrates how the first usage does not necessarily need the occurrence to be filled in. The second time that we use the keyword we do however tell the occurrence that it needs value 2.

    In below example the above mobile phone number is going to be edited assuming that the prefix 06 was already filled in.
    | =Keyword= | =label= | =input= | =occurrence= | =clear= |
    | Mendix Text | Phone number | 12345678 | 2 | false |
`;

async function mendixTextArea(page, logger, label, input, occurrence = 1, clear = true) {
    locator = `(//label[text() = "${label}"]/following::textarea[1])[${occurrence}]`
    await pageFill(page, logger, locator, input, clear)
    logger(`Text area element was found by selector '${locator}'.`)
}

mendixTextArea.rfdoc = `
    Fills the given \`input\` into the corresponding text area element which is found by \`label\`.

    The keyword will wait for the text area element, corresponding to \`label\`, to become visible and interactable before filling in the text.
    If the element is not a text area element this keyword will fail.

    = Argument information =
    - \`label\`: Label corresponding to the text area element.
    - \`input\`: The text to be filled in.
    - \`occurrence\`: If the combination \`label\` and \`input\` is not unique, within the current page, the occurrence can be used to select the needed element. By default occurrence is set to 1, but this can be changed to 2 or greater.
    - \`clear\`: By default every text input will be cleared before filling in the text. If this is not desired clear can be set to _false_ and thus add the text as an addition to the already existing text.

    = Examples =
    == Basic usage ==
    In below examples two of the same text area elements are being detected and both have to be filled in.
    | =Keyword= | =label= | =input= | =occurrence= | =clear= |
    | Mendix Text Area | Contact | lorem ipsum dolor sit amet | _N/A_ | _N/A_ |
    | Mendix Text Area | Contact | secondary text area field for potentially remarks | 2 | _N/A_ |

    Above illustrates how the first usage does not necessarily need the occurrence to be filled in. The second time that we use the keyword we do however tell the occurrence that it needs value 2.
`;

async function mendixDate(page, logger, label, operator=null, datetype=null, increment=0, dateFormat="dd-MM-yyyy", occurrence = 1, clear = true) {
    locator = `(//label[text() = "${label}"]/following::input[1])[${occurrence}]`
    date = defineDate(operator, datetype, increment, dateFormat)
    await pageFill(page, logger, locator, date, clear)
    logger(`Date element was found by selector '${locator}'.`)
}

mendixDate.rfdoc = `
Fills the given \`date\` into the corresponding text input element which is found by \`label\`.

The keyword will wait for the text input element, corresponding to \`label\`, to become visible and interactable before filling in the date.
If the element is not a text input element this keyword will fail.

= Argument information =
- \`label\`: Label corresponding to the input element.
- \`operator\`: Can be left empty for todays date, or receive \` < \` for a substract or \` > \` for a addition on todays date.
- \`datetype\`: By default set to \`null\`, but can be passed any of the following values \`years\` \`months\` \`weeks\` \`days\` \`hours\` \`minutes\` \`seconds\`.
- \`increment\`: By default set to \`0\`, which will result in UTC datetime of this exact moment. Increment is the value of key \`datetype\` (datetype: increment) and will substract or add it's value from UTC datetime.
- \`dateFormat\`: By default date format is set to \`dd-MM-yyyy\`. This can be changed using the date-fns format patterns, which can be found [https://date-fns.org/v2.28.0/docs/format | here].
- \`occurrence\`: If the combination \`label\` and \`input\` is not unique, within the current page, the occurrence can be used to select the needed element. By default occurrence is set to 1, but this can be changed to 2 or greater.
- \`clear\`: By default every text input will be cleared before filling in the text. If this is not desired clear can be set to _false_ and thus add the text as an addition to the already existing text.

= Examples =
== Basic usage ==
In below example the basic usage is illustrated where user wants to fill in username.
| =Keyword= | =label= | =input= | =occurrence= | =clear= |
| Mendix Date | Birthdate | _01/01/2022_ | _N/A_ | _N/A_ |
`;

async function mendixSelect(page, logger, label, input, occurrence = 1) {
    locator = `(//label[text() = "${label}"]/following::select[1])[${occurrence}]`
    await page.selectOption(locator, { label: input });
    logger(`Selects option '${input}' from element found by selector '${locator}'.`)
}

mendixSelect.rfdoc = `
Selects the given \`option\` in the corresponding select element which is found by \`label\`.

The keyword will wait for the option element, corresponding to \`label\`, to become visible and interactable before selecting the option.
If the element is not a select element this keyword will fail.

= Argument information =
- \`label\`: Label corresponding to the select element.
- \`input\`: The option to be selected.
- \`occurrence\`: If the combination \`label\` and \`input\` is not unique, within the current page, the occurrence can be used to select the needed element. By default occurrence is set to 1, but this can be changed to 2 or greater.

= Examples =
== Basic usage ==
In below example the basic usage is illustrated where user wants to fill in username.
| =Keyword= | =label= | =input= | =occurrence= |
| Mendix Select | Gender | male | _N/A_ |
| Mendix Select | Gender | female | _N/A_ |
`;

async function mendixCheck(page, logger, label, select = true, occurrence = 1) {
    locator = `(//label[text() = "${label}"]/following::input[1])[${occurrence}]`
    if (select === false) {
        await page.uncheck(locator);
        logger(`Uncheck the checkbox found by selector '${locator}'.`)
    }
    else {
        await page.check(locator);
        logger(`Check the checkbox found by selector '${locator}'.`)
    }
}

mendixCheck.rfdoc = `
Checks or unchecks the given _checkbox_ or _radio button_ in the corresponding input element which is found by \`label\`.

The keyword will wait for the input element, corresponding to \`label\`, to become visible and interactable before checking or unchecking it.
If the element is not an input element this keyword will fail.

= Argument information =
- \`label\`: Label corresponding to the element.
- \`select\`: The checkbox or radio button to be (un)selected. By default select will be set to _true_, thus ensuring the element will be checked. It can be set to false in order for the element to be unchecked.
- \`occurrence\`: If the combination \`label\` and \`select\` is not unique, within the current page, the occurrence can be used to select the needed element. By default occurrence is set to 1, but this can be changed to 2 or greater.

= Examples =
== Basic usage ==
In below example the basic usage is illustrated where user wants to fill in username.
| =Keyword= | =label= | =select= | =occurrence= |
| Mendix Check | Account active | _N/A_ | _N/A_ |
| Mendix Check | Account active | false | _N/A_ |
`;


exports.__esModule = true;
exports.mendixText = mendixText;
exports.mendixTextArea = mendixTextArea;
exports.mendixDate = mendixDate;
exports.mendixSelect = mendixSelect;
exports.mendixCheck = mendixCheck;