import type { Context, Service, ServiceSchema, ServiceSettingSchema } from "moleculer";

interface WorkflowPayload {
	card?: string;
	amount?: number;
	productId?: string;
	quantity?: number;
	address?: string;
}

interface PaymentResult {
	status: "wait" | "success" | "failed";
	transactionId: string;
}

const OrdersService: ServiceSchema = {
	name: "orders",

	/**
	 * Workflows. More info: https://github.com/moleculerjs/workflows
	 */
	workflows: {
		process: {
			async handler(this: Service, ctx: Context<WorkflowPayload>) {
				this.logger.info("Start processing order. Job ID:", ctx.wf.jobId, ctx.params);

				const paymentResult = await ctx.call<PaymentResult, Partial<WorkflowPayload>>("orders.payment", {
					card: ctx.params.card,
					amount: ctx.params.amount
				});

				if (paymentResult.status !== "wait") {
					this.logger.error("Payment failed", paymentResult);
					throw new Error("Payment processing failed");
				}

				// Wait for the payment to be finished. It's blocked until the paymentFinished signal is triggered.
				await ctx.wf.waitForSignal("paymentFinished", paymentResult.transactionId, {
					timeout: "10m"
				});

				const inventoryResult = await ctx.call("orders.inventory", {
					productId: ctx.params.productId,
					quantity: ctx.params.quantity
				});

				const deliveryResult = await ctx.call("orders.delivery", {
					address: ctx.params.address,
					productId: ctx.params.productId
				});

				this.logger.info("Order processed successfully.", {
					payment: paymentResult,
					inventory: inventoryResult,
					delivery: deliveryResult
				});
			}
		}
	},

	/**
	 * Actions. More info: https://moleculer.services/docs/0.15/actions.html
	 */
	actions: {
		create: {
			rest: "POST /create",
			{{#apiGQL}}graphql: {
				mutation: "createOrder(card: String, amount: Int, productId: String, quantity: Float, address: String): String!"
			},{{/apiGQL}}
			params: {
				card: { type: "string", default: "4111111111111111" },
				amount: { type: "number", default: 100 },
				productId: { type: "string", default: "1001" },
				quantity: { type: "number", default: 1 },
				address: { type: "string", default: "New York" }
			},
			async handler(ctx: Context) {
				const job = await this.broker.wf.run("orders.process", ctx.params);
				this.logger.info("Order created. Job ID:", job.id);
				return job.id;
			}
		},

		/**
		 * Simulate payment processing
		 */
		payment: {
			params: {
				card: { type: "string" },
				amount: { type: "number" }
			},
			async handler(ctx: Context<{ card: string; amount: number }>) {
				this.logger.info("Waiting for payment finishing...", ctx.params);
				// Simulate payment processing
				return { status: "wait", transactionId: "12345" };
			}
		},

		/**
		 * Simulate payment finished callback by the payment gateway.
		 * It triggers the workflow signal to continue the process.
		 */
		paymentFinished: {
			rest: "POST /payment/finished",
			{{#apiGQL}}graphql: {
				mutation: "orderPaymentFinished(transactionId: String): String!"
			},{{/apiGQL}}
			params: {
				transactionId: { type: "string", default: "12345" }
			},
			async handler(ctx: Context<{ transactionId: string }>) {
				this.logger.info("Payment finished for transaction", ctx.params.transactionId);

				// Simulate payment completion
				await this.broker.wf.triggerSignal("paymentFinished", ctx.params.transactionId);

				return "OK";
			}
		},

		/**
		 *  Simulate inventory reservation
		 */
		inventory: {
			params: {
				productId: "string",
				quantity: "number"
			},
			async handler(ctx: Context<{ productId: string; quantity: number }>) {
				this.logger.info("Reserving inventory for product", ctx.params.productId);
				// Simulate inventory update
				return {
					status: "success",
					productId: ctx.params.productId,
					quantity: ctx.params.quantity
				};
			}
		},

		/**
		 * Simulate delivery scheduling
		 */
		delivery: {
			params: {
				address: "string"
			},
			async handler(ctx: Context<{ productId: string; address: string }>) {
				this.logger.info("Scheduling delivery for product", ctx.params.productId);
				// Simulate delivery scheduling
				return {
					status: "success",
					productId: ctx.params.productId,
					address: ctx.params.address
				};
			}
		}
	}
};

export default OrdersService;
