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
