const http = require('http')
const path = require('path');

class Server {
	constructor(backend) {
		this.backend = backend;
		this.server = http.createServer((req, res) => this.handle(req, res));
	}

	start() {
		return new Promise(resolve => {
			this.server.listen(this.backend.options.port, () => {
				resolve();
			});
		});
	}

	/**
	 * @param {http.IncomingMessage} req 
	 * @param {http.ServerResponse} res 
	 */
	handle(req, res) {
		// Handle requests and server files.
	}

	build(folder) {
		require(path.join(folder, "./build/build.js"));
	}

	stop() {
		return new Promise(resolve => {
			this.server.close(() => {
				resolve();
			});
		});
	}
}

module.exports = Server;