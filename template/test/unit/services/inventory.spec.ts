import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";

const { ServiceBroker, Context } = require("moleculer");
const ChannelMiddleware = require("@moleculer/channels").Middleware;
const TestService = require("../../../services/inventory.service");

describe("Test 'inventory' service", () => {
	const broker = new ServiceBroker({
		logger: false,
		middlewares: [
			ChannelMiddleware({
				adapter: {
					type: "Fake"
				}
			})
		]
	});
	// Mock adapter methods
	broker.channelAdapter.init = jest.fn();
	broker.channelAdapter.connect = jest.fn();
	broker.channelAdapter.disconnect = jest.fn();
	broker.channelAdapter.subscribe = jest.fn();
	broker.channelAdapter.unsubscribe = jest.fn();
	broker.channelAdapter.publish = jest.fn();

	broker.emit = jest.fn();

	const service = broker.createService(TestService);

	// Store the reference to the original orderProduct method
	const ORIGINAL_ORDER_PRODUCT = service.orderProduct;
	service.orderProduct = jest.fn();

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	it("should emit reserved event", async () => {
		const payload = {
			productId: "123",
			quantity: 10
		};

		// Use helper method to trigger the handler
		const ctx = Context.create(broker, null, payload);
		await service.emitLocalChannelHandler("inventory.reserve", ctx);

		// Check if inventory's method was called
		expect(broker.emit).toBeCalledTimes(1);
		expect(broker.emit).toBeCalledWith("inventory.reserved", payload, expect.any(Object));
	});

	it("should send msg to 'inventory.reserve' channel", async () => {
		broker.sendToChannel = jest.fn();

		await broker.call("inventory.reserve", {
			productId: "123",
			quantity: 10
		});
		expect(broker.sendToChannel).toBeCalledTimes(1);
		expect(broker.sendToChannel).toBeCalledWith(
			"inventory.reserve",
			{ productId: "123", quantity: 10 },
			{ ctx: expect.any(Context) }
		);
	});
});
