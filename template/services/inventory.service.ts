import type { Context, Service, ServiceSchema, ServiceSettingSchema } from "moleculer";

const InventoryService: ServiceSchema = {
	name: "inventory",

	/**
	 * More info: https://github.com/moleculerjs/moleculer-channels
	 */
	channels: {
		/**
		 * Reserve a product in the inventory.
		 *
		 * @this {import('moleculer').Service}
		 */
		"inventory.reserve": {
			context: true,
			async handler(this: Service, ctx: Context<{ productId: string; quantity: number }>) {
				// Simulate external API call to reserve the quantity...
				await new Promise(resolve => setTimeout(resolve, 1000));

				this.logger.info(
					`Reserve ${ctx.params.quantity} pieces of the ${ctx.params.productId} product in the inventory.`
				);

				await ctx.emit("inventory.reserved", {
					productId: ctx.params.productId,
					quantity: ctx.params.quantity
				});
			}
		}
	},

	/**
	 * Actions. More info: https://moleculer.services/docs/0.15/actions.html
	 */
	actions: {
		/**
		 * REST API to reserve a product in the inventory via Moleculer Channels.
		 */
		reserve: {
			rest: "POST /reserve",
			{{#apiGQL}}graphql: {
				mutation: "inventoryReserve(productId: String!, quantity: Int!): Boolean!"
			},{{/apiGQL}}
			params: {
				productId: { type: "string" },
				quantity: { type: "number" }
			},
			async handler(ctx: Context<{ productId: string; quantity: number }>) {
				await this.broker.sendToChannel(
					"inventory.reserve",
					{
						productId: ctx.params.productId,
						quantity: ctx.params.quantity
					},
					{ ctx }
				);

				return true;
			}
		}
	}
};

export default InventoryService;
