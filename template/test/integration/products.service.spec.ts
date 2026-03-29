import { afterAll, beforeAll, describe, it, expect, vi } from "vitest";
import { ServiceBroker } from "moleculer";
import type { ProductEntity } from "../../services/products.service.js";
import TestService from "../../services/products.service.js";

describe("Test 'products' service", () => {
	describe("Test actions", () => {
		const broker = new ServiceBroker({ logger: false });
		const service = broker.createService(TestService);
		service.seedDB = undefined; // Disable seeding

		broker.sendToChannel = vi.fn();

		beforeAll(() => broker.start());
		afterAll(() => broker.stop());

		const record = {
			name: "Awesome item",
			price: 999
		};
		let newID: string;

		it("should contains the seeded items", async () => {
			const res = await broker.call("products.list");
			expect(res).toEqual({ page: 1, pageSize: 10, rows: [], total: 0, totalPages: 0 });
		});

		it("should add the new item", async () => {
			const res = await broker.call<ProductEntity, Partial<ProductEntity>>("products.create", record);
			expect(res).toEqual({
				id: expect.any(String),
				name: "Awesome item",
				price: 999,
				quantity: 0
			});
			newID = res.id;

			const res2 = await broker.call("products.count");
			expect(res2).toBe(1);
		});

		it("should get the saved item", async () => {
			const res = await broker.call("products.get", { id: newID });
			expect(res).toEqual({
				id: expect.any(String),
				name: "Awesome item",
				price: 999,
				quantity: 0
			});

			const res2 = await broker.call("products.list");
			expect(res2).toEqual({
				page: 1,
				pageSize: 10,
				rows: [{ id: newID, name: "Awesome item", price: 999, quantity: 0 }],
				total: 1,
				totalPages: 1
			});
		});

		it("should update an item", async () => {
			const res = await broker.call("products.update", { id: newID, price: 499 });
			expect(res).toEqual({
				id: expect.any(String),
				name: "Awesome item",
				price: 499,
				quantity: 0
			});
		});

		it("should get the updated item", async () => {
			const res = await broker.call("products.get", { id: newID });
			expect(res).toEqual({
				id: expect.any(String),
				name: "Awesome item",
				price: 499,
				quantity: 0
			});
		});

		it("should increase the quantity", async () => {
			const res = await broker.call("products.increaseQuantity", { id: newID, value: 5 });
			expect(res).toEqual({
				id: expect.any(String),
				name: "Awesome item",
				price: 499,
				quantity: 5
			});
		});

		it("should decrease the quantity", async () => {
			const res = await broker.call("products.decreaseQuantity", { id: newID, value: 2 });
			expect(res).toEqual({
				id: expect.any(String),
				name: "Awesome item",
				price: 499,
				quantity: 3
			});
			expect(broker.sendToChannel).toBeCalledTimes(0);
		});

		it("should decrease the quantity - and order more products ", async () => {
			const res = await broker.call("products.decreaseQuantity", { id: newID, value: 3 });
			expect(res).toEqual({
				id: expect.any(String),
				name: "Awesome item",
				price: 499,
				quantity: 0
			});
			expect(broker.sendToChannel).toBeCalledTimes(1);
			expect(broker.sendToChannel).toBeCalledWith("order.more", {
				id: expect.any(String),
				name: "Awesome item",
				price: 499,
				quantity: 0
			});
		});

		it("should decrease the quantity - should throw an error ", async () => {
			try {
				await broker.call("products.decreaseQuantity", { id: newID, value: 3 });
			} catch (error) {
				expect(error.message).toEqual("Quantity cannot be negative");
			}
		});

		it("should remove the updated item", async () => {
			const res = await broker.call("products.remove", { id: newID });
			expect(res).toBe(newID);

			const res2 = await broker.call("products.count");
			expect(res2).toBe(0);

			const res3 = await broker.call("products.list");
			expect(res3).toEqual({ page: 1, pageSize: 10, rows: [], total: 0, totalPages: 0 });
		});
	});
});
