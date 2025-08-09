import "moleculer"

declare module "moleculer" {
	interface ActionSchema {
		auth?: "required" | null | undefined;
	}

	interface ServiceBroker {
		sendToChannel(channelName: string, payload: unknown, opts?: { ctx?: Context });
	}

	interface ServiceSchema {
		channels?: {
			[key: string]: {
				context?: boolean;
				handler: (this: Service, ctx: Context<P, M, L, H>) => Promise<void>;
			};
		};
	}
}
