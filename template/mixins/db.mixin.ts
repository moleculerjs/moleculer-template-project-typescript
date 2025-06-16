import type { Context, Service, ServiceSchema } from "moleculer";

import { Service as DbService } from "@moleculer/database";

export type DbServiceMethods = {
	seedDb?(): Promise<void>;
};

type DbServiceSchema = Partial<ServiceSchema>;

export type DbServiceThis = Service & DbServiceMethods;

export default function (collection: string): DbServiceSchema {
	const cacheCleanEventName = `cache.clean.${collection}`;

	const schema: DbServiceSchema = {
		/**
		 * Mixins. More info: https://moleculer.services/docs/0.15/services.html#Mixins
		 */
		mixins: [
			// @moleculer/database config: More info: https://github.com/moleculerjs/database
			DbService({
				adapter:
					// In production use MongoDB
					process.env.DB_URI?.startsWith("mongodb://")
						? {
								type: "MongoDB",
								options: {
									uri: process.env.DB_URI
								}
							}
						: {
								type: "NeDB",
								options:
									// In unit/integration tests use in-memory DB. Jest sets the NODE_ENV automatically
									// During dev use file storage
									process.env.NODE_ENV === "test"
										? {
												neDB: {
													inMemoryOnly: true
												}
											}
										: `./data/${collection}.db`
							},
				strict: false
			})
		],

		/**
		 * Events. More info: https://moleculer.services/docs/0.15/events.html
		 */
		events: {
			/**
			 * Subscribe to the cache clean event. If it's triggered
			 * clean the cache entries for this service.
			 */
			async [cacheCleanEventName]() {
				if (this.broker.cacher) {
					await this.broker.cacher.clean(`${this.fullName}.*`);
				}
			}
		},

		/**
		 * Methods. More info: https://moleculer.services/docs/0.15/services.html#Methods
		 */
		methods: {
			/**
			 * Send a cache clearing event when an entity changed.
			 *
			 * @param {String} type
			 * @param {object} data
			 * @param {object} oldData
			 * @param {Context} ctx
			 * @param {object} opts
			 */
			async entityChanged(
				type: string,
				data: object,
				oldData: object,
				ctx: Context,
				opts: object
			) {
				ctx.broadcast(cacheCleanEventName);
			}
		},

		/**
		 * Service started lifecycle event handler
		 * More info: https://moleculer.services/docs/0.15/lifecycle.html#started-event-handler
		 */
		async started(this: DbServiceThis) {
			// Check the count of items in the DB. If it's empty,
			// call the `seedDB` method of the service.
			if (this.seedDB) {
				const adapter = await this.getAdapter();
				const count = await adapter.count();
				if (count == 0) {
					this.logger.info(
						`The '${collection}' collection is empty. Seeding the collection...`
					);
					await this.seedDB();
					this.logger.info("Seeding is done. Number of records:", await adapter.count());
				}
			}
		}
	};

	return schema;
};
