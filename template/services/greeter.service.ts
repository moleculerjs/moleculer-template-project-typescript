"use strict";

import {Service, ServiceBroker} from "moleculer";

export default class GreeterService extends Service {

	constructor(broker: ServiceBroker) {
		super(broker);
		this.parseServiceSchema({
			name:"greeter",
			actions:{
				hello: this.hello
			}
		})

	}

	// action
	hello() {
		return "Hello Moleculer";
	}

}

