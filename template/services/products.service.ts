import type { Context, ServiceSchema, ServiceSettingSchema } from "moleculer";
import type { DatabaseSettings, ApolloServiceSettings } from "../moleculer-types.js";
import DbMixin from "../mixins/db.mixin.js";
import type { DbServiceMethods } from "../mixins/db.mixin.js";

export interface ProductEntity {
	id: string;
	name: string;
	price: number;
	quantity: number;
}

export type ActionCreateParams = Partial<ProductEntity>;

export interface ActionQuantityParams {
	id: string;
	value: number;
}

interface ProductSettings extends DatabaseSettings, ApolloServiceSettings {}

const ProductsService: ServiceSchema<ProductSettings, DbServiceMethods, ServiceSettingSchema> = {
	name: "products",
	// version: 1

	/**
	 * Mixins. More info: https://moleculer.services/docs/0.15/services.html#Mixins
	 */
	mixins: [DbMixin("products") as ServiceSchema],

	/**
	 * Settings. More info: https://moleculer.services/docs/0.15/services.html#Settings
	 */
	settings: {
		// Available fields in the responses
		// More info: https://github.com/moleculerjs/database/tree/master/docs#fields
		fields: {
			id: { type: "string", primaryKey: true, columnName: "_id" },
			name: { type: "string", required: true, min: 5 },
			quantity: { type: "number", required: false },
			price: { type: "number", required: false }
		}{{#apiGQL}},

		// GraphQL Schema definition of a Product
		graphql: {
			type: `
				"""
				This type describes a Product entity.
				"""
				type Product {
					id: String!
					name: String!
					quantity: Int!
					price: Int!
				}

				"""
				This type describes response to list action
				"""
				type ProductListResponse {
					rows: [Product]!
					total: Int!
					page: Int!
					pageSize: Int!
					totalPages: Int!
				}
			`
		}{{/apiGQL}}
	},

	/**
	 * Action Hooks. More info: https://moleculer.services/docs/0.15/actions.html#Action-hooks
	 */
	hooks: {
		before: {
			/**
			 * Register a before hook for the `create` action.
			 * It sets a default value for the quantity field.
			 */
			create(ctx: Context<ActionCreateParams>) {
				if (!ctx.params.quantity) ctx.params.quantity = 0;
			}
		}
	},

	/**
	 * Actions. More info: https://moleculer.services/docs/0.15/actions.html
	 */
	actions: {
		/**
		 * @moleculer/database mixin registers the following actions:
		 * - count
		 * - create
		 * - find
		 * - get
		 * - list
		 * - remove
		 * - update
		 *
		 * More info: https://github.com/moleculerjs/database
		 */
		{{#apiGQL}}

		//  Add GraphQL schema to default actions
		count: {
			graphql: {
				query: "countProducts(search: String, searchFields: [String], scope: [String], query: JSON): Int!"
			}
		},
		create: {
			graphql: {
				mutation: "createProduct(name: String!, quantity: Int, price: Int): Product!"
			}
		},
		find: {
			graphql: {
				query: "findProducts(limit: Int, offset: Int, fields: [String], sort: [String], search: String, searchFields: [String], scope: [String], query: JSON): [Product]!"
			}
		},
		get: {
			graphql: {
				query: "productById(id: String!, fields: [String], scopes: [String]): Product"
			}
		},
		list: {
			graphql: {
				query: "listProducts(page: Int, pageSize: Int, fields: [String], sort: [String], search: String, searchFields: [String], scope: [String], query: JSON): ProductListResponse"
			}
		},
		remove: {
			graphql: {
				mutation: "removeProduct(id: String!): String!"
			}
		},
		update: {
			graphql: {
				mutation:
					"updateProduct(id: String!, name: String, quantity: Int, price: Int): Product!"
			}
		},
		replace: {
			graphql: {
				mutation:
					"replaceProduct(id: String!, name: String, quantity: Int, price: Int): Product!"
			}
		},
		{{/apiGQL}}

		// --- ADDITIONAL ACTIONS ---

		/**
		 * Increase the quantity of the product item.
		 */
		increaseQuantity: {
			rest: "PUT /:id/quantity/increase",
			params: {
				id: "string",
				value: "number|integer|positive"
			},
			{{#apiGQL}}graphql: {
				mutation: "increaseQuantity(id: String!, value: Int!): Product"
			},{{/apiGQL}}
			async handler(ctx: Context<ActionQuantityParams>): Promise<ProductEntity> {
				// Get current quantity
				const adapter = await this.getAdapter(ctx);
				const dbEntry = await adapter.findById<ProductEntity>(ctx.params.id);

				// Compute new quantity
				const newQuantity = dbEntry.quantity + ctx.params.value;

				// Update DB entry. Will emit an event to clear the cache
				const doc = await this.updateEntity<ProductEntity>(ctx, {
					id: ctx.params.id,
					quantity: newQuantity
				});

				return doc;
			}
		},

		/**
		 * Decrease the quantity of the product item.
		 */
		decreaseQuantity: {
			rest: "PUT /:id/quantity/decrease",
			params: {
				id: "string",
				value: "number|integer|positive"
			},
			{{#apiGQL}}graphql: {
				mutation: "decreaseQuantity(id: String!, value: Int!): Product"
			},{{/apiGQL}}
			async handler(ctx: Context<ActionQuantityParams>): Promise<ProductEntity> {
				// Get current quantity
				const adapter = await this.getAdapter(ctx);
				const dbEntry = await adapter.findById<ProductEntity>(ctx.params.id);

				// Compute new quantity
				const newQuantity = dbEntry.quantity - ctx.params.value;

				if (newQuantity < 0) throw new Error("Quantity cannot be negative");

				// Update DB entry. Will emit an event to clear the cache
				const doc = await this.updateEntity<ProductEntity>(ctx, {
					id: ctx.params.id,
					quantity: newQuantity
				});

				{{#needChannels}}
				if (doc.quantity === 0) {
					this.logger.info(`Stock of ${doc.name} depleted... Ordering more`);
					// Emit a persistent event to order more products
					// inventory.service will handle this event
					this.broker.sendToChannel("order.more", doc);
				}{{/needChannels}}

				return doc;
			}
		}
	},

	/**
	 * Methods. More info: https://moleculer.services/docs/0.15/services.html#Methods
	 */
	methods: {
		/**
		 * Loading sample data to the collection.
		 * It is called in the DB.mixin after the database
		 * connection establishing & the collection is empty.
		 */
		async seedDB() {
			const adapter = await this.getAdapter();
			await adapter.insertMany([
				{ name: "Samsung Galaxy S10 Plus", quantity: 10, price: 704 },
				{ name: "iPhone 11 Pro", quantity: 25, price: 999 },
				{ name: "Huawei P30 Pro", quantity: 15, price: 679 }
			]);
		}
	}
};

export default ProductsService;
