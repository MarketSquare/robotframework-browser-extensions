function AxeAnalyzePage(page, outputDirPath, Reportfolder, filename, logger) {
	const AxeBuilder = require('@axe-core/playwright').default;
	const { createHtmlReport } = require('axe-html-reporter');
	const analysis = new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practise']).analyze().then(results => {
		createHtmlReport({ results, options: { outputDirPath: outputDirPath, outputDir: Reportfolder, reportFileName: filename } });
		return results
	});
	return analysis;

}

AxeAnalyzePage.rfdoc = `
example:\n
| &{results} | AxeAnalyzePage | OUTPUT_DIR | TEST_NAME_INDEX.html |\n
This function designed as an extention for Robot Framework® Browser and
requires two installed packages:\n
- [https://www.npmjs.com/package/@axe-core/playwright|@axe-core/playwright]\n
- [https://www.npmjs.com/package/axe-html-reporter|axe-html-reporter]\n

\`\`filename\`\` to create.Must have \`\`.html\`\` as extention\n
This will create a file in outputDirPath / AxeReport / yourfile.html\n
The function will return the results of AxeBuilder as a dictionary.
More on this can be found in [https://www.deque.com/axe/core-documentation/api-documentation/#results-object|Deque's Axe API Documentation]\n
`;

exports.__esModule = true;
exports.AxeAnalyzePage = AxeAnalyzePage;