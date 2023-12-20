exports.__esModule = true;
exports.HighlightElement = HighlightElement;
exports.RemoveHighlight = RemoveHighlight;

HighlightElement.rfdoc = `
This keyword overlays an element with a highlight. This highlight is created on z-layer
50000 to prevent issue present in built-in highlight function where borders will change
the layout of dynamically arranged pages.
Parameters:
locator  : (string) Locator string (xpath, css, id)
bgColor  : (string) Background color of highligter. Part that actually covers the element.
                    CSS style color.
brdrColor: (string) Border color of highlight. Wraps highlighter element to help draw
                    attention. CSS style color.
opacity  : (string|float) The opacity of the background color. We tend towards lighter
                    opacity levels so element could still be seen through the overlay. 
                    Value is between 0 and 1.
`
async function HighlightElement (logger, page, locator, bgColor, brdrColor, opacity) {
    // logger("Highlight Parameters:")
    // logger(`Locator: ${locator}`)
    // logger(`Background Color: ${bgColor}`)
    // logger(`Border Color: ${brdrColor}`)
    // logger(`Opacity: ${opacity}`)
    
    const ele = await page.locator(locator)
    await createHighlighter(page);

    await ele.evaluate (
        (ele, {bgColor, brdrColor, opacity}) => 
            { window.highlight_overlay.ShowOverlay(ele, bgColor, brdrColor, opacity) }
        , { bgColor, brdrColor, opacity }    
    )
}

RemoveHighlight.rfdoc = `
This keyword removes the highlight from an element.
Parameters:
locator  : (string) Locator string (xpath, css, id)
`
async function RemoveHighlight(logger, page, locator) {
    // logger("Remove Highlight Parameters:")
    // logger(`Locator: ${locator}`)

    const ele = await page.locator(locator);
    await createHighlighter(page);
    await ele.evaluate(
        (ele) => {window.highlight_overlay.DeleteOverlay(ele)}
    )
}


async function createHighlighter(page) {
    page.evaluate(() => {

        if (typeof window.highlight_overlay === 'undefined') {
            window.highlight_overlay = (() => {

                // Attributes
                const target  = 'data-overlay-id'
                const wrapper = 'data-overlay'

                /**
                *   @function _generateOverlayWrapper
                *   @param {Object} targetElement       : Element to be highlighted.
                *   @param {String} backgroundColor     : Background color
                *   @param {String} borderColor         : Border color
                *   @param {float}  opacity             : Overlay opacity
                *
                *   @description  Creates the actual overlay. Uses nested divs to create
                *                 an outline and an internal element that provides the colored
                *                 highlight of the DOM element. Overlay is at a higher z-index
                *                 than targetElement                 
                *
                *   @returns {Object}                   : Returns new DOM element 
                */
                _generateOverlay = function (targetElement, backgroundColor, borderColor, opacity) {
                    const targetBox = targetElement.getBoundingClientRect();

                    // Create overlay body
                    const wrapper = document.createElement('div');
                    // Offset the overlay's top-left corner position. Setting the overlay larger allows us to boldy
                    // outline the element for easier location
                    wrapper.style.top = (targetBox.top - 10) + 'px';
                    wrapper.style.left = (targetBox.left - 10) + 'px';

                    // Set the size of the overlay, size is large than orignal element to account for offset position.
                    wrapper.style.width = (targetBox.width + 10) + 'px';
                    wrapper.style.height = (targetBox.height + 10) + 'px';

                    // Fix overlay position over the element and elevate it to a large z-index to guarantee visibility
                    wrapper.style.position = 'fixed';
                    wrapper.style.zIndex = 50000;
                    wrapper.style.pointerEvents = 'none';

                    // Style div to have solid border.
                    wrapper.style.borderWidth = '5px';
                    wrapper.style.borderStyle = 'solid';
                    wrapper.style.borderColor = borderColor;

                    // Flex styles element and aligns it's child to it's center.
                    wrapper.style.display = 'flex'
                    wrapper.style.alignItems = 'center'
                    wrapper.style.justifyContent = 'center'

                    //Create overlay inner child
                    const background = document.createElement('div')

                    // Sizes highlight box same as target element. This is the portion that actually highlights and overlays
                    // the target element.
                    background.style.width = targetBox.width + 'px'
                    background.style.height = targetBox.height + 'px'

                    // Set highlight color and transparency (opacity)
                    background.style.backgroundColor = backgroundColor;
                    background.style.opacity = opacity;

                    // Attaches highlighter to overlay.
                    wrapper.appendChild(background);

                    return wrapper;
                };

                /**  
                *   @function _generateUUID
                *
                *   @description Generates a UUID. Used to identify individual elements.
                *   More information here: https://stackoverflow.com/a/8809472
                * 
                *   @returns {string}               : Unique ID number
                */
                _generateUUID = function () {
                    let d = new Date().getTime()
                    let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
                        let r = Math.random() * 16;
                        if (d > 0) {
                            r = (d + r) % 16 | 0;
                            d = Math.floor(d / 16);
                        }
                        else {
                            r = (d2 + r) % 16 | 0;
                            d2 = Math.floor(d2 / 16);
                        }
                        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
                    });
                }


                /**
                *   @function ShowOverlay
                *   @param {Object} element           : A js locator to an element in the current window.
                *                                       'css:.classValue div' or HTMLDom element to the 
                *                                       target
                *   @param {string} backgroundColor   : Background color
                *   @param {string} borderColor       : Border color
                *   @param {float}  opacity           : Overlay opacity, value between 0 and 1.
                *
                *   @description                      Creates an overlay on a DOM element.
                */
                ShowOverlay = function (element, backgroundColor, borderColor, opacity) {
                    if (element) // Null check.
                    {
                        console.log(backgroundColor, borderColor, opacity)
                        if (element.hasAttribute(target))     // If target already has an overlay
                        {
                            DeleteOverlay(element)            // Delete the old one (ex. color change)
                        }

                        const UUID = _generateUUID();         // Generate unique ID for overlay
                        element.setAttribute(target, UUID);   // Flag that element has an overlay

                        const overlayWrapper = _generateOverlay(element, backgroundColor, borderColor, opacity);
                        overlayWrapper.setAttribute(wrapper, UUID)  // Set overlay attribute with unique id

                        document.body.appendChild(overlayWrapper)   // Attach to page.
                    }
                    else {
                        console.log(`No element provided.`);
                    }

                }
               

                /**
                *   @function DeleteOverlay
                *   @param {Object} element
                *
                *   @description Deletes the overlay on top of the target element.
                */
                DeleteOverlay = function (element) {
                    if (element)
                    {
                        const overlay_id = element.getAttribute(target);        // Gets the UUID from element with
                                                                                // data-overlay-id attribute

                        const querySelector = `[${wrapper}='${overlay_id}']`    // Finds the corresponding UUID
                        const overlay = document.querySelector(querySelector);
                        if (overlay != null) overlay.remove();                  // Removes the overlay
                        element.removeAttribute(target);                        // Remove the data-overlay-id attribute
                    }
                    else {
                        console.log(`No element provided.`);
                    }
                }

                return {
                    ShowOverlay,
                    DeleteOverlay
                }
            })()
        }
    })
}