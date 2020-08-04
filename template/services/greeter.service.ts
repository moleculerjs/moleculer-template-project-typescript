"use strict";

import {Service, ServiceBroker,Context} from "moleculer";

export default class GreeterService extends Service {

	constructor(broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name:"greeter",
			actions:{
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
						return this._hello();
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
						return this._welcome(ctx.params.name);
					},
				},
			}
		})

	}

	// action
	_hello():string {
		return "Hello Moleculer";
	}
	_welcome(name:string):string {
		return `Welcome, ${name}`;
	}

}

