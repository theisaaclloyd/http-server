const http = require('http');
const Enmap = require("enmap");

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

	try {
		const p = client.pages.get(url);
		
		if (p) {
			res.setHeader("Content-Type", "text/html");
			res.writeHead(200);
			res.end(p);
		}

		else {
			res.setHeader("Content-Type", "text/json");
			res.writeHead(404);
			res.end(JSON.stringify({ error: `Unable to find resource at '${url}'` }));
			console.log(`Unable to find resource url ${url}`);
		}

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