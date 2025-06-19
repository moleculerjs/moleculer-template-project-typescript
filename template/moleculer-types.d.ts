import "moleculer";

declare module "moleculer" {
	interface ActionSchema {
		graphql?: {
			query?: string;
			mutation?: string;
		};

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

interface ApolloServiceSettings {
	graphql?: {
		type?: string;
	};
}

interface DatabaseSettings {
	fields: {
		[key: string]: {
			type: string;
			primaryKey?: boolean;
			columnName?: string;
			required?: boolean;
			min?: number;
			max?: number;
		}
	}
}

interface DatabaseAdapter {
	findById<TEntity>(id: string): Promise<TEntity>;
	count(): Promise<number>;
	insertMany<TEntity>(entities: TEntity[]): Promise<TEntity[]>;
}

interface DatabaseMethods {
	getAdapter(ctx?: Context): Promise<DatabaseAdapter>;
	updateEntity<TEntity>(ctx: Context, entity: Partial<TEntity>): Promise<TEntity>;
}


declare module '@moleculer/database' {
	export function Service(options?: object): ServiceSchema;
}
