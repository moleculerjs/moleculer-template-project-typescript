import { afterAll, beforeAll, describe, it, expect, vi } from "vitest";

import { Context, Errors, ServiceBroker } from "moleculer";
import type { ServiceSchema } from "moleculer";
import TestService from "../../../services/inventory.service.js";
import { Middleware as ChannelMiddleware } from "@moleculer/channels";

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
	broker.channelAdapter.init = vi.fn();
	broker.channelAdapter.connect = vi.fn();
	broker.channelAdapter.disconnect = vi.fn();
	broker.channelAdapter.subscribe = vi.fn();
	broker.channelAdapter.unsubscribe = vi.fn();
	broker.channelAdapter.publish = vi.fn();

	broker.emit = vi.fn();

	const service = broker.createService(TestService);

	// Store the reference to the original orderProduct method
	const ORIGINAL_ORDER_PRODUCT = service.orderProduct;
	service.orderProduct = vi.fn();

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
		broker.sendToChannel = vi.fn();

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
