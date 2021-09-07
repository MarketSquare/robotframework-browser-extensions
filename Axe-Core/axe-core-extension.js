function AxeAnalyzePage(page, args, logger)  {
	// DUTCH:
	// Deze function heeft twee packages nodig:
	// npm i @axe-core/playwright
	// npm i axe-html-reporter
	//
	// De functie verwacht twee argumenten:
	// Als eerste de outputdirectory, en als tweede de bestandsnaam.
	// De bestandsnaam dient te eindigen op '.html'
	// 
	// De functie geeft een object terug met de resultaten van AxeBuilder
	// De functie krijgt het 'page' object mee via de Browser Library.
	// 
	// ENGLISH:
	// This function designed as an extention for Robot Framework® Browser and
	// requires two installed packages:
	// - @axe-core/playwright
	// - axe-html-reporter
	// 
	// This function expects two arguments:
	// arg[0] = outputDirPath
	// arg[1] = filename to create. Must have '.html' as extention
	// This will create a file in ${outputdir}/AxeReport/yourfile.html
	//
	// The function will return the results of AxeBuilder
	// The 'page' object is inherited from the Robot Framework® Browser Library
   const AxeBuilder = require('@axe-core/playwright').default;
   const { createHtmlReport } = require('axe-html-reporter');
   const analysis = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practise']).analyze().then(results => {
	   createHtmlReport( {results, options: {outputDirPath: args[0], outputDir: 'AxeReport', reportFileName: args[1]}});
	   return results
	});
	return analysis
	
}

exports.__esModule = true;
exports.AxeAnalyzePage = AxeAnalyzePage;