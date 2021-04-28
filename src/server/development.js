const Server = require("../server");
var watch = require("node-watch");
var path = require("path");

class DevelopmentServer extends Server {

    constructor(backend){
		super(backend);
        var folder = path.join(process.cwd(), backend.options.folder);
        this.watcher = watch(folder, { recursive: true });
        this.watcher.on('change', () => this.build(folder));
    }

	close() {
		super.close();

		this.watcher.close();
	}

}

module.exports = DevelopmentServer;