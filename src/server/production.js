const Server = require("../server");
const clone = require('git-clone');
const path = require('path');
const createHandler = require('github-webhook-handler');

class ProductionServer extends Server {
	constructor(backend) {
		super(backend);

		this.handler = createHandler({ path: '/webhook', secret: this.backend.options.production.secret});

		handler.on('push', () => this.clone());
	}

	handle(req, res) {
		this.handler(req, res, () => res.statusCode = 404);

		super.handle(req, res)
	}

	clone() {
		const tempFolder = path.join(process.cwd(), this.backend.options.production.tempFolder);

		clone(this.backend.options.production.repo, tempFolder, () => {
			this.build(tempFolder);
		});
	}
}

module.exports = ProductionServer;