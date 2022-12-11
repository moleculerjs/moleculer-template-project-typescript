import { Errors, ServiceBroker } from "moleculer";
import TestService from "../../../services/greeter.service";

describe("Test 'greeter' service", () => {
	const broker = new ServiceBroker({ logger: false });
	broker.createService(TestService);

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe("Test 'greeter.hello' action", () => {
		test("should return with 'Hello Moleculer'", async () => {
			const res = await broker.call("greeter.hello");
			expect(res).toBe("Hello Moleculer");
		});
	});

	describe("Test 'greeter.welcome' action", () => {
		test("should return with 'Welcome'", async () => {
			const res = await broker.call("greeter.welcome", { name: "Adam" });
			expect(res).toBe("Welcome, Adam");
		});

		test("should reject an ValidationError", async () => {
			await expect(broker.call("greeter.welcome")).rejects.toThrow(Errors.ValidationError);
		});
	});
});
