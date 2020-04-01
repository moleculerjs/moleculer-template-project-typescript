"use strict";
import { Context, ServiceSchema } from "moleculer";

const GreeterService: ServiceSchema = {
	name: "greeter",

	/**
	 * Settings
	 */
	settings: {

	},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

		/**
		 * Say a 'Hello' action.
		 *
		 */
		hello: {
			rest: {
				method: "GET",
				path: "/hello",
			},
			async handler(): Promise<string> {
				return "Hello Moleculer";
			},
		},

		/**
		 * Welcome, a username
		 */
		welcome: {
			rest: "/welcome",
			params: {
				name: "string",
			},
			async handler(ctx: Context<{name: string}>): Promise<string> {
				return `Welcome, ${ctx.params.name}`;
			},
		},
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created(): void {},

	/**
	 * Service started lifecycle event handler
	 */
	async started(): Promise<void> {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped(): Promise<void> {},
};

export = GreeterService;
