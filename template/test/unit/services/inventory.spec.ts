import { afterAll, beforeAll, describe, it, expect, vi } from "vitest";

import { Context, ServiceBroker } from "moleculer";
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
	(broker as any).channelAdapter.init = vi.fn();
	(broker as any).channelAdapter.connect = vi.fn();
	(broker as any).channelAdapter.disconnect = vi.fn();
	(broker as any).channelAdapter.subscribe = vi.fn();
	(broker as any).channelAdapter.unsubscribe = vi.fn();
	(broker as any).channelAdapter.publish = vi.fn();

	broker.emit = vi.fn();

	const service = broker.createService(TestService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	it("should emit reserved event", async () => {
		const payload = {
			productId: "123",
			quantity: 10
		};

		// Use helper method to trigger the handler
		const ctx = Context.create(broker, null as any, payload);
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
