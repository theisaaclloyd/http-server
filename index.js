const http = require('http');
const Enmap = require("enmap");
const filetypes = require('./filetypes.json');

var client = {};

client.pages = new Enmap();

require("./utils.js")(client);

const init = async () => {
	client.loadAllPages();

	server.listen(client.port, client.host, () => {
		console.log(`Server is running on http://${client.host}:${client.port}`);
	});
};

const requestListener = function (req, res) {
	const url = req.url.toLowerCase().trim().slice(1).toString();
	console.log(`request: |${url}|`);

	var statusCode, contentType, content;

	try {
		const p = client.pages.get(url);
		//console.log(`requested file type: ${filetypes[url.split('.')[1]]}`)

		if (p) {
			statusCode = 200;
			contentType = filetypes[url.split('.')[1]];
			content = p;
		}

		else {
			statusCode = 404;
			contentType = 'text/json';
			content = JSON.stringify({ error: `Unable to find resource at '${url}'` });

			console.log(`Unable to find resource url ${url}`);
		}

		res.setHeader("Content-Type", contentType);
		res.writeHead(statusCode);
		res.end(content);

	} catch (e) {
		//res.setHeader("Content-Type", "text/json");
		//res.writeHead(400);
		res.end(JSON.stringify({ error: `Error at url ${url}: ${e}` }));
		console.log(`Error at url ${url}: ${e}`);
		return;
	}
};


const server = http.createServer(requestListener);

server.on('clientError', (err, socket) => {
	socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

init();