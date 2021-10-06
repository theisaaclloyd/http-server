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
			if (!f.endsWith(".html")) return; //f += '.js'
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

	client.unloadCommand = async (commandName) => {
		let command;
		if (client.commands.has(commandName)) {
			command = client.commands.get(commandName);
		} else if (client.aliases.has(commandName)) {
			command = client.commands.get(client.aliases.get(commandName));
		}
		if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;

		if (command.shutdown) {
			await command.shutdown(client);
		}
		const mod = require.cache[require.resolve(`./commands/${command.info.name}`)];
		delete require.cache[require.resolve(`./commands/${command.info.name}.js`)];
		for (let i = 0; i < mod.parent.children.length; i++) {
			if (mod.parent.children[i] === mod) {
				mod.parent.children.splice(i, 1);
				break;
			}
		}
		return false;
	};
};