const http = require('http')
const path = require('path');
const {execSync, exec} = require('child_process');

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
		exec("node build/build", {cwd: folder}, (err, stdout, stderr) => {
			if(err) throw err;

			if(stdout) console.log(stdout);
			if(stderr) console.error(stderr);
		});
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