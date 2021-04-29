const Server = require("../server");
var watch = require("node-watch");
var path = require("path");

class DevelopmentServer extends Server {

    constructor(backend){
		super(backend);
        var folder = path.join(process.cwd(), backend.options.development.folder);
        this.watcher = watch(folder, {
			recursive: true,
			filter: (f, skip) => this.filter(f, skip)});
        this.watcher.on('change', () => this.build(folder));
    }

	filter(f, skip) {
		const regexes = [/\/node_modules/, /\.git/, /\/dist/];

		for(const regex of regexes) {
			if(regex.test(f)) return skip;
		}

		return true;
	}

	close() {
		super.close();

		this.watcher.close();
	}

}

module.exports = DevelopmentServer;