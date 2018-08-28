import { ServiceSchema } from "moleculer";
import ApiGateway = require("moleculer-web");

const ApiService: ServiceSchema = {
	name: "api",

	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
	settings: {
		port: process.env.PORT || 3000,

		routes: [{
			path: "/api",
			whitelist: [
				// Access to any actions in all services under "/api" URL
				"**",
			],
		}],

		// Serve assets from "public" folder
		assets: {
			folder: "public",
		},
	},
};

export = ApiService;
