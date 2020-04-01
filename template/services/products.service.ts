"use strict";
import { ServiceSchema, Context } from "moleculer";

import DbMixin from "../mixins/db.mixin"

const ProductSchema: ServiceSchema = {
	name: "products",
	// version: 1

	/**
	 * Mixins
	 */
	// @ts-ignore
	mixins: [DbMixin("products")],

	/**
	 * Settings
	 */
	settings: {
		// Available fields in the responses
		fields: [
			"_id",
			"name",
			"quantity",
			"price"
		],

		// Validator for the `create` & `insert` actions.
		entityValidator: {
			name: "string|min:3",
			price: "number|positive"
		}
	},

	/**
	 * Action Hooks
	 */
	hooks: {
		before: {
			/**
			 * Register a before hook for the `create` action.
			 * It sets a default value for the quantity field.
			 *
			 * @param {Context} ctx
			 */
			create(ctx: Context<{quantity: number}>) {
				ctx.params.quantity = 0;
			}
		}
	},

	/**
	 * Actions
	 */
	actions: {
		/**
		 * The "moleculer-db" mixin registers the following actions:
		 *  - list
		 *  - find
		 *  - count
		 *  - create
		 *  - insert
		 *  - update
		 *  - remove
		 */

		// --- ADDITIONAL ACTIONS ---

		/**
		 * Increase the quantity of the product item.
		 */
		increaseQuantity: {
			rest: "PUT /:id/quantity/increase",
			params: {
				id: "string",
				// @ts-ignore
				value: "number|integer|positive"
			},
			async handler(ctx: Context<{id: string, value: number}>) {
				const doc = await this.adapter.updateById(ctx.params.id, { $inc: { quantity: ctx.params.value } });
				const json = await this.transformDocuments(ctx, ctx.params, doc);
				await this.entityChanged("updated", json, ctx);

				return json;
			}
		},

		/**
		 * Decrease the quantity of the product item.
		 */
		decreaseQuantity: {
			rest: "PUT /:id/quantity/decrease",
			params: {
				id: "string",
				// @ts-ignore
				value: "number|integer|positive"
			},
			/** @param {Context} ctx  */
			async handler(ctx: Context<{id: string, value: number}>) {
				const doc = await this.adapter.updateById(ctx.params.id, { $inc: { quantity: -ctx.params.value } });
				const json = await this.transformDocuments(ctx, ctx.params, doc);
				await this.entityChanged("updated", json, ctx);

				return json;
			}
		}
	},

	/**
	 * Methods
	 */
	methods: {
		/**
		 * Loading sample data to the collection.
		 * It is called in the DB.mixin after the database
		 * connection establishing & the collection is empty.
		 */
		async seedDB() {
			await this.adapter.insertMany([
				{ name: "Samsung Galaxy S10 Plus", quantity: 10, price: 704 },
				{ name: "iPhone 11 Pro", quantity: 25, price: 999 },
				{ name: "Huawei P30 Pro", quantity: 15, price: 679 },
			]);
		}
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	}
};

export = ProductSchema;