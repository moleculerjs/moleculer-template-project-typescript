import type { Context, Service, ServiceSchema, ServiceSettingSchema } from "moleculer";

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

type GreeterThis = Service<GreeterSettings> & GreeterMethods & GreeterLocalVars;

const GreeterService: ServiceSchema<GreeterSettings> = {
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
			async handler(this: GreeterThis /* , ctx: Context */): Promise<string> {
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
			async handler(this: GreeterThis, ctx: Context<ActionHelloParams>): Promise<string> {
				return `Welcome, ${ctx.params.name}`;
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
	methods: {},

	/**
	 * Service created lifecycle event handler
	 * More info: https://moleculer.services/docs/0.15/lifecycle.html#created-event-handler
	 * @this {import('moleculer').Service}
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 * More info: https://moleculer.services/docs/0.15/lifecycle.html#started-event-handler
	 * @this {import('moleculer').Service}
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 * More info: https://moleculer.services/docs/0.15/lifecycle.html#stopped-event-handler
	 * @this {import('moleculer').Service}
	 */
	async stopped() {}
};

export default GreeterService;
