import { afterAll, beforeAll, describe, it, expect, vi } from "vitest";

import { Context, Errors, ServiceBroker } from "moleculer";
import type { ServiceSchema } from "moleculer";
import type { BaseAdapter } from "@moleculer/database";
import TestService from "../../../services/products.service.js";

describe("Test 'products' service", () => {
	describe("Test actions", () => {
		const broker = new ServiceBroker({ logger: false });
		const service = broker.createService(TestService);

		service.seedDB = vi.fn();
		const mockedUpdateEntity = vi.spyOn(service, "updateEntity");
		const mockedEntityChanged = vi.spyOn(service, "entityChanged");

		const record = {
			_id: "123",
			name: "Awesome thing",
			price: 999,
			quantity: 25,
			createdAt: Date.now()
		};

		let adapter;
		beforeAll(async () => {
			await broker.start();

			adapter = await service.getAdapter();

			await adapter.insert(record);
		});
		afterAll(() => broker.stop());

		describe("Test 'products.increaseQuantity'", () => {
			it("should call the adapter updateById method & transform result", async () => {
				const res = await broker.call("products.increaseQuantity", {
					id: "123",
					value: 10
				});
				expect(res).toEqual({
					id: "123",
					name: "Awesome thing",
					price: 999,
					quantity: 35
				});

				expect(service.updateEntity).toBeCalledTimes(1);
				expect(service.updateEntity).toBeCalledWith(expect.any(Context), {
					id: "123",
					quantity: 35
				});

				expect(service.entityChanged).toBeCalledTimes(1);
				expect(service.entityChanged).toBeCalledWith(
					"update",
					{ id: "123", name: "Awesome thing", price: 999, quantity: 35 },
					{ id: "123", name: "Awesome thing", price: 999, quantity: 25 },
					expect.any(Context),
					{}
				);
			});
		});

		describe("Test 'products.decreaseQuantity'", () => {
			it("should call the adapter updateById method & transform result", async () => {
				mockedUpdateEntity.mockClear();
				mockedEntityChanged.mockClear();

				const res = await broker.call("products.decreaseQuantity", {
					id: "123",
					value: 10
				});
				expect(res).toEqual({
					id: "123",
					name: "Awesome thing",
					price: 999,
					quantity: 25
				});

				expect(service.updateEntity).toBeCalledTimes(1);
				expect(service.updateEntity).toBeCalledWith(expect.any(Context), {
					id: "123",
					quantity: 25
				});

				expect(service.entityChanged).toBeCalledTimes(1);
				expect(service.entityChanged).toBeCalledWith(
					"update",
					{ id: "123", name: "Awesome thing", price: 999, quantity: 25 },
					{ id: "123", name: "Awesome thing", price: 999, quantity: 35 },
					expect.any(Context),
					{}
				);
			});

			it("should throw error if params is not valid", async () => {
				mockedUpdateEntity.mockClear();
				mockedEntityChanged.mockClear();

				expect.assertions(2);
				try {
					await broker.call("products.decreaseQuantity", {
						id: "123",
						value: -5
					});
				} catch (err) {
					expect(err).toBeInstanceOf(Errors.ValidationError);
					expect(err.data).toEqual([
						{
							action: "products.decreaseQuantity",
							actual: -5,
							field: "value",
							message: "The 'value' field must be a positive number.",
							nodeID: broker.nodeID,
							type: "numberPositive"
						}
					]);
				}
			});
		});
	});

	describe("Test methods", () => {
		const broker = new ServiceBroker({ logger: false });
		const service = broker.createService(TestService);

		vi.spyOn(service, "seedDB");

		// Mock the adapter
		let adapter = {
			count: vi.fn(async () => 0),
			insertMany: vi.fn()
		};
		service.getAdapter = async () => adapter as any as BaseAdapter;

		beforeAll(() => broker.start());
		afterAll(() => broker.stop());

		describe("Test 'seedDB'", () => {
			it("should be called after service started & DB connected", async () => {
				expect(service.seedDB).toBeCalledTimes(1);
				expect(service.seedDB).toBeCalledWith();
			});

			it("should insert 3 documents", async () => {
				expect(adapter.insertMany).toBeCalledTimes(1);
				expect(adapter.insertMany).toBeCalledWith([
					{ name: "Samsung Galaxy S10 Plus", quantity: 10, price: 704 },
					{ name: "iPhone 11 Pro", quantity: 25, price: 999 },
					{ name: "Huawei P30 Pro", quantity: 15, price: 679 }
				]);
			});
		});
	});

	describe("Test hooks", () => {
		const broker = new ServiceBroker({ logger: false });
		const createActionFn = vi.fn();
		broker.createService({
			name: "products",
			mixins: [TestService],
			actions: {
				create: {
					handler: createActionFn
				}
			}
		} as unknown as ServiceSchema);

		beforeAll(() => broker.start());
		afterAll(() => broker.stop());

		describe("Test before 'create' hook", () => {
			it("should add quantity with zero", async () => {
				await broker.call("products.create", {
					id: "111",
					name: "Test product",
					price: 100
				});

				expect(createActionFn).toBeCalledTimes(1);
				expect(createActionFn.mock.calls[0][0].params).toEqual({
					id: "111",
					name: "Test product",
					price: 100,
					quantity: 0
				});
			});
		});
	});
});
