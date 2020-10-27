"use strict";

import { ServiceBroker } from "moleculer";
import TestService from "../../services/products.service";

describe("Test 'products' service", () => {

	describe("Test actions", () => {
		const broker = new ServiceBroker({ logger: false });
		const service = broker.createService(TestService);
		service.seedDB = null; // Disable seeding

		beforeAll(() => broker.start());
		afterAll(() => broker.stop());

		const record = {
			name: "Awesome item",
			price: 999,
		};
		let newID: string;

		it("should contains the seeded items", async () => {
			const res = await broker.call("products.list");
			expect(res).toEqual({ page: 1, pageSize: 10, rows: [], total: 0, totalPages: 0 });
		});

		it("should add the new item", async () => {
			const res: any = await broker.call("products.create", record);
			expect(res).toEqual({
				_id: expect.any(String),
				name: "Awesome item",
				price: 999,
				quantity: 0,
			});
			newID = res._id;

			const res2 = await broker.call("products.count");
			expect(res2).toBe(1);
		});

		it("should get the saved item", async () => {
			const res = await broker.call("products.get", { id: newID });
			expect(res).toEqual({
				_id: expect.any(String),
				name: "Awesome item",
				price: 999,
				quantity: 0,
			});

			const res2 = await broker.call("products.list");
			expect(res2).toEqual({
				page: 1,
				pageSize: 10,
				rows: [{ _id: newID, name: "Awesome item", price: 999, quantity: 0 }],
				total: 1,
				totalPages: 1,
			});
		});

		it("should update an item", async () => {
			const res = await broker.call("products.update", { id: newID, price: 499 });
			expect(res).toEqual({
				_id: expect.any(String),
				name: "Awesome item",
				price: 499,
				quantity: 0,
			});
		});

		it("should get the updated item", async () => {
			const res = await broker.call("products.get", { id: newID });
			expect(res).toEqual({
				_id: expect.any(String),
				name: "Awesome item",
				price: 499,
				quantity: 0,
			});
		});

		it("should increase the quantity", async () => {
			const res = await broker.call("products.increaseQuantity", { id: newID, value: 5 });
			expect(res).toEqual({
				_id: expect.any(String),
				name: "Awesome item",
				price: 499,
				quantity: 5,
			});
		});

		it("should decrease the quantity", async () => {
			const res = await broker.call("products.decreaseQuantity", { id: newID, value: 2 });
			expect(res).toEqual({
				_id: expect.any(String),
				name: "Awesome item",
				price: 499,
				quantity: 3,
			});
		});

		it("should remove the updated item", async () => {
			const res = await broker.call("products.remove", { id: newID });
			expect(res).toBe(1);

			const res2 = await broker.call("products.count");
			expect(res2).toBe(0);

			const res3 = await broker.call("products.list");
			expect(res3).toEqual({ page: 1, pageSize: 10, rows: [], total: 0, totalPages: 0 });
		});

	});

});
