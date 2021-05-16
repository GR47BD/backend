const Server = require("../server");
const path = require('path');
const fs = require('fs');
const createHandler = require('github-webhook-handler');

class ProductionServer extends Server {

	constructor(backend) {
		super(backend);

		this.folder = path.join(process.cwd(), this.backend.options.production.tempFolder);
		this.handler = createHandler({ path: '/webhook', secret: this.backend.options.production.secret});

		this.handler.on('push', () => this.build());
	}

	handle(req, res) {
		this.handler(req, res, err => {
			if(err) {
				res.statusCode = 500;
				res.end("Error!");

				return;
			}

			super.handle(req, res);
		});
	}

	async build() {
		const startTime = new Date().getTime();

		console.log(`Found change to ${this.backend.options.production.repo}`);

		if(fs.existsSync(this.folder)) await fs.promises.rm(this.folder, {recursive: true});
		await fs.promises.mkdir(this.folder);
		await this.clone();

		console.log(`The site has been cloned in ${((new Date().getTime()-startTime)/1000).toFixed(2)}s`);

		await super.build(this.folder);
	}

	clone() {
		return this.executeAsync(`git clone ${this.backend.options.production.repo} .`);
	}
}

module.exports = ProductionServer;