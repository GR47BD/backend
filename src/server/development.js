const Server = require("../server");
var watch = require("node-watch");
var path = require("path");

class DevelopmentServer extends Server {

    constructor(backend){
		super(backend);

        this.folder = path.join(process.cwd(), backend.options.development.folder);
        this.watcher = watch(this.folder, {
			recursive: true,
			filter: (f, skip) => this.filter(f, skip)});
        this.watcher.on('change', () => this.build());
    }

	filter(f, skip) {
		const regexes = [/node_modules\//, /\.git\//, /dist\//];
		const file = path.relative(this.folder, f).split("\\").join("/");

		if(file === "") return skip;

		for(const regex of regexes) {
			if(regex.test(file)) return skip;
		}

		console.log(`Found change to ${file}`);

		return true;
	}

	close() {
		super.close();

		this.watcher.close();
	}

}

module.exports = DevelopmentServer;