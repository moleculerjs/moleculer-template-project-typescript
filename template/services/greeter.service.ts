import type { Context, ServiceSchema, ServiceSettingSchema } from "moleculer";

export interface ActionHelloParams {
	name: string;
}

interface GreeterSettings extends ServiceSettingSchema {
	defaultName: string;
}

interface GreeterMethods {
	uppercase(str: string): string;
}

interface GreeterLocalVars {
	myVar: string;
}

const GreeterService: ServiceSchema<GreeterSettings, GreeterMethods, GreeterLocalVars> = {
	name: "greeter",

	/**
	 * Settings. More info: https://moleculer.services/docs/0.15/services.html#Settings
	 */
	settings: {
		defaultName: "Moleculer"
	},

	/**
	 * Dependencies. More info: https://moleculer.services/docs/0.15/services.html#Dependencies
	 */
	dependencies: [],

	/**
	 * Actions. More info: https://moleculer.services/docs/0.15/actions.html
	 */
	actions: {
		/**
		 * Say a 'Hello' action.
		 *
		 * @returns
		 */
		hello: {
			rest: {
				method: "GET",
				path: "/hello"
			},
			{{#apiGQL}}graphql: {
				query: "hello: String"
			},{{/apiGQL}}
			async handler(/* , ctx: Context */): Promise<string> {
				return "Hello Moleculer";
			}
		},

		/**
		 * Welcome, a username
		 *
		 * @param {String} name - User name
		 */
		welcome: {
			rest: "/welcome",
			params: {
				name: "string"
			},
			{{#apiGQL}}graphql: {
				mutation: "welcome(name: String!): String"
			},{{/apiGQL}}
			async handler(ctx: Context<ActionHelloParams>): Promise<string> {
				return `Welcome, ${this.uppercase(ctx.params.name)}`;
			}
		}
	},

	/**
	 * Events. More info: https://moleculer.services/docs/0.15/events.html
	 */
	events: {},

	/**
	 * Methods. More info: https://moleculer.services/docs/0.15/services.html#Methods
	 */
	methods: {
		uppercase(str: string): string {
			return str.toUpperCase();
		}
	},

	/**
	 * Service created lifecycle event handler
	 * More info: https://moleculer.services/docs/0.15/lifecycle.html#created-event-handler
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 * More info: https://moleculer.services/docs/0.15/lifecycle.html#started-event-handler
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 * More info: https://moleculer.services/docs/0.15/lifecycle.html#stopped-event-handler
	 */
	async stopped() {}
};

export default GreeterService;
