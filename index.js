
const DevelopmentServer = require('./src/server/development');
const ProductionServer = require('./src/server/production');

class Backend {
	constructor() {
		this.options = require('./options.json');

		if(this.options.mode === "development") {
			this.server = new DevelopmentServer(this);
		} else {
            this.server = new ProductionServer(this);
        }
	}

	async start() {
		await this.server.start();
	}

	async stop() {
		await this.server.stop();
	}
}

const backend = new Backend();
backend.start();

/*
const handler = createHandler({ path: '/webhook', secret: 'myhashsecret' })
 
http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404
    res.end('no such location')
  })
}).listen(8080)
 
handler.on('error', function (err) {
  console.error('Error:', err.message)
})
 
handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref)
})*/