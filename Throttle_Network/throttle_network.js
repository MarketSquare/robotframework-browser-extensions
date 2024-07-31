async function setNetworkSpeed(downloadSpeedMbps,uploadSPeedMbps, latencyInMilliseconds, page, logger) {
    // create a new CDP session (only supports Chrominum based browsers)
    const client = await page.context().newCDPSession(page);

    // enable network emulation
    await client.send("Network.enable");

    // change network conditions with specific params
    await client.send("Network.emulateNetworkConditions", {
        offline: false,
        downloadThroughput: downloadSpeedMbps * 125000, //Mbps to bytes per second
        uploadThroughput: uploadSPeedMbps * 125000, //Mbps to bytes per second
        latency: latencyInMilliseconds,
    });
}

async function throttleNetworkSpeedToSlow3G(page, logger) {
    logger("Setting network speed to Slow 3G: 500 kbps down/up")
    setNetworkSpeed(0.5, 0.5, 2000, page, logger);
}

async function throttleNetworkSpeedToFast3G(page, logger) {
    logger("Setting network speed to Fast 3G: 1,6 mbps down / 750 kbps up")
    setNetworkSpeed(1.6, 0.75, 562, page, logger);
}

async function throttleNetworkSpeedTo(downloadSpeedMbps,uploadSPeedMbps, latencyInMilliseconds,page, logger) {
    logger("Setting network speed to: " + downloadSpeedMbps + " Mbps Down, " + uploadSPeedMbps + " Mbps Up, " + latencyInMilliseconds + " milliseconds latency")
    setNetworkSpeed(Number(downloadSpeedMbps), Number(uploadSPeedMbps), Number(latencyInMilliseconds), page, logger);
}

async function disableNetworkThrottle(page, logger) {
    // create a new CDP session (only support Chrominum browser)
    const client = await page.context().newCDPSession(page);

    // disable network emulation
    await client.send("Network.disable");
}

throttleNetworkSpeedToSlow3G.rfdoc = `
This keyword throttles the network speed to Slow 3G: 500 kbps down/up.`

throttleNetworkSpeedToFast3G.rfdoc = `
This keyword throttles the network speed to Fast 3G: 1,6 mbps down / 750 kbps up.`

throttleNetworkSpeedTo.rfdoc = `
This keyword set the network speed to the given downloadSpeedMbps,uploadSPeedMbps and latencyInMilliseconds parameters.
Example:
| Throttle Network Speed To    1    1    10
 `

disableNetworkThrottle.rfdoc = `
Disables the network throttle
.`

exports.__esModule = true;
exports.throttleNetworkSpeedToSlow3G = throttleNetworkSpeedToSlow3G;
exports.throttleNetworkSpeedToFast3G = throttleNetworkSpeedToFast3G;
exports.throttleNetworkSpeedTo = throttleNetworkSpeedTo;
exports.disableNetworkThrottle = disableNetworkThrottle;
