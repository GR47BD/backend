const http = require('http');
const path = require('path');
const fs = require('fs');
const {exec} = require('child_process');
const mime = require('mime-types');

class Server {
	constructor(backend) {
		this.backend = backend;
		this.server = http.createServer((req, res) => this.handle(req, res));
		this.cache = new Map();
		this.built = false;
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
	async handle(req, res) {
		if(this.built === false) return this.sendPleaseWaitError(res);

		let url = req.url; 

		if(url === '/') url = '/index.html'

		const file = path.join(this.folder, "./dist/", url);

		if(!file.startsWith(this.folder)) return this.sendUnauthorizedError(res);

		if(!fs.existsSync(file)) return this.sendNotFoundError(res);

		const data = await this.loadFile(file)
			.catch(() => this.sendInternalServerError(res));

		if(res.destroyed) return;

		let type = mime.lookup(path.extname(url));
		if (!type) type = 'text/html';
		res.setHeader('Content-Type',type);
		res.writeHead(200);
		res.end(data);
	}

	async loadFile(file) {
		if(this.cache.has(file)) return this.cache.get(file);

		const data = await fs.promises.readFile(file)
			.catch(err => {console.log(err); throw err});
		this.cache.set(file, data);

		return data;
	}
	
	sendNotFoundError(res) {
		this.sendError(res, {code: 404, message: "The requested file was not found."});
	}

	sendInternalServerError(res) {
		this.sendError(res, {code: 500, message: "Something went wrong while loading the requested file."});
	}

	sendPleaseWaitError(res) {
		this.sendError(res, {code: 503, message: "Please wait for the first build to be generated."});
	}

	sendUnauthorizedError(res) {
		this.sendError(res, {code: 401, message: "You are not authorized to this file!"});
	}

	sendError(res, {code, message}) {
		res.statusCode = code;
		res.end(message);
	}

	executeAsync(command) {
		return new Promise(resolve => {
			exec(command, {cwd: this.folder}, (err, stdout, stderr) => {
				if(err) throw err;

				//if(stdout) console.log(stdout);
				//if(stderr) console.error(stderr);

				resolve();
			});
		});
	}

	installModules() {
		return this.executeAsync("npm install");
	}

	runBuild() {
		return this.executeAsync("node build/build");
	}

	async build() {
		this.built = true;

		if(this.backend.options.mode === "production") await this.installModules();
		await this.runBuild();
		console.log("The site has been updated.");
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