# backend
Contains all the backend code for our project. The backend runs the actual http server and handles client requests..
# How to use
Before starting the backend, you will have to configure an options.json file. To this end, you can copy the included CHANGEME.options.json, rename it and then, add the options you like. Here is an overview of what all the options do:
```bash
	"mode": "development",  # Choose which mode to run server in by changing "development" to "production" or keeping as "development"
	"development": {        # This mode should be used if you would like to use your local copy of the frontend
		"folder": "../frontend"   # specify the folder where your frontend is located (Default: same parent folder as backend)
	},
	"production": {      # This mode pulls the current frontend from github and runs that (only properly works if port 80 of your local machine is forwarded)
   		"secret": "test",
		"tempFolder": "./temp",
		"repo": "https://github.com/GR47BD/frontend.git"
	},
	"port": 8080       # specifies the port on which the webserver should run
```
After having configured the json, you continue by ensuring that the node dependencies are installed. So, in the backend folder, simply run: 
```bash
# Installs the dependencies
$ npm update
$ npm install
```
If your running in development mode make sure you have done the same in your frontend folder. After that, in the backend folder run:
```bash
# Starts the server
$ npm start
```
Then, the server starts on the port specified in options.json, so, you can connect at: localhost:$port   