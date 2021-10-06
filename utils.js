// utils.js

const { promisify } = require("util");
const fs = require('fs').promises;
//const readdir = promisify(require("fs").readdir);

const host = 'localhost';
const port = 3000;

module.exports = (client) => {
	client.host = host;
	client.port = port;

	client.loadAllPages = async () => {
		const pageFiles = await fs.readdir("./pages/");
		console.log(`Loading a total of ${pageFiles.length} pages.`);
		pageFiles.forEach(async (f) => {
			//if (!f.endsWith(".html")) return; //f += '.js'
			console.log(`file extension: ${f.split('.')[1]}`)
			const response = await client.loadPage(f);
			if (response) console.log(response);
		});
	};

	client.loadPage = async (pageName) => {
		try {
			console.log(`Loading page: ${pageName}`);

			const data = await fs.readFile(__dirname + `/pages/${pageName}`);

			//console.log(data.toString())
			client.pages.set(pageName, data);
			return `Loaded page ${pageName}!`;
		} catch (e) {
			return `Unable to load page ${pageName}: ${e}`;
		}
	};
};