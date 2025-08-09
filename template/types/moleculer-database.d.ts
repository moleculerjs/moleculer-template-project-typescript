declare module '@moleculer/database' {
	import type { ServiceSchema } from 'moleculer';
	export function Service(options?: object): ServiceSchema;

	export interface DatabaseSettings {
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

	export interface DatabaseAdapter {
		findById<TEntity>(id: string): Promise<TEntity>;
		count(): Promise<number>;
		insertMany<TEntity>(entities: TEntity[]): Promise<TEntity[]>;
	}

	export interface DatabaseMethods {
		getAdapter(ctx?: Context): Promise<DatabaseAdapter>;
		updateEntity<TEntity>(ctx: Context, entity: Partial<TEntity>): Promise<TEntity>;
	}

}
