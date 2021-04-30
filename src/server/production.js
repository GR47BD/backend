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
		this.handler(req, res, () => res.statusCode = 404);

		super.handle(req, res);
	}

	async build() {
		if(fs.existsSync(this.folder)) await fs.promises.rm(this.folder, {recursive: true});
		await fs.promises.mkdir(this.folder);
		await this.clone();
		await super.build();
	}

	clone() {
		return this.executeAsync(`git clone ${this.backend.options.production.repo} .`);
	}
}

module.exports = ProductionServer;