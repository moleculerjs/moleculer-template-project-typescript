import {Service, ServiceBroker} from "moleculer";
import ApiGateway = require("moleculer-web");

class ApiService extends Service {
	constructor(broker:ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name: "api",
			mixins: [ApiGateway],
			// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
			settings: {
				port: process.env.PORT || 3000,

				routes: [{
					path: "/api",
					whitelist: [
						// Access to any actions in all services under "/api" URL
						"**",
					]{{#dbService}},
					aliases: {
						"REST products": "products"
					}
					{{/#dbService}}
				}],

				// Serve assets from "public" folder
				assets: {
					folder: "public",
				},
			},
		})
	}
}


export = ApiService;
