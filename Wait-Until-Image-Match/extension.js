// Compare images with pixelmatch, return number of mismatched pixels and percent of it from image size
// args[0] - input, args[1] - output, args[2] - diff, args[3] - threshold, args[4-7] - x, y, width, height
// if args[4-7] are provided, it will compare only the given region from images
async function compareWithPixelmatch(page, args)  {
	const fs = require('fs');
	const pixelmatch = require('pixelmatch');
	const sharp = require('sharp')

	// does not work directly, i.e. sharp(args[0] due to screenshot taken just before this call
	img1 = sharp(fs.readFileSync(args[0]));
	img2 = sharp(fs.readFileSync(args[1]));

	// compare full images, width and height are image size
	if	(args.length == 4) {
		const metadata = await sharp(args[0])
			.metadata();
		w = metadata.width;
		h = metadata.height;
	}
	// compare region from images, width and height are given as arguments
	else {
		w = parseInt(args[6]);
		h = parseInt(args[7]);	
	}
	// extract region from images
	if	(args.length == 8) {
		const x = parseInt(args[4]);
		const y = parseInt(args[5]);
		img1 = img1.extract({ left: x, top: y, width: w, height: h })
		img2 = img2.extract({ left: x, top: y, width: w, height: h })
	}

	// build images and difference output buffers
	img1 = await img1.raw().toBuffer();
	img2 = await img2.raw().toBuffer();
	const diff = Buffer.alloc(w*h*4);

	// compare with pixelmatch
	const result = pixelmatch(img1, img2, diff, w, h, {threshold: args[3]});

	// write difference to filename given as argument
	await sharp(diff, {raw: {width: w, height: h, channels: 4}})
		.toFile(args[2]);

	// return difference in pixels also as percentage from widht and height
	const mis_percent = (result * 100) / (w * h);
	return	[result, mis_percent.toFixed(2)];
}

exports.__esModule = true;
exports.compareWithPixelmatch = compareWithPixelmatch;
