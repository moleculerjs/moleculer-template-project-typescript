import { Context, Errors, ServiceBroker } from "moleculer";
import type { ServiceSchema } from "moleculer";
import TestService from "../../../services/products.service";

describe("Test 'products' service", () => {
	describe("Test actions", () => {
		const broker = new ServiceBroker({ logger: false });
		const service = broker.createService(TestService as unknown as ServiceSchema);

		jest.spyOn(service.adapter, "updateById");
		jest.spyOn(service, "transformDocuments");
		jest.spyOn(service, "entityChanged");

		beforeAll(() => broker.start());
		afterAll(() => broker.stop());

		const record = {
			_id: "123",
			name: "Awesome thing",
			price: 999,
			quantity: 25,
			createdAt: Date.now(),
		};

		describe("Test 'products.increaseQuantity'", () => {
			test("should call the adapter updateById method & transform result", async () => {
				service.adapter.updateById.mockImplementation(() => Promise.resolve(record));
				service.transformDocuments.mockClear();
				service.entityChanged.mockClear();

				const res = await broker.call("products.increaseQuantity", {
					id: "123",
					value: 10,
				});
				expect(res).toEqual({
					_id: "123",
					name: "Awesome thing",
					price: 999,
					quantity: 25,
				});

				expect(service.adapter.updateById).toHaveBeenCalledTimes(1);
				expect(service.adapter.updateById).toHaveBeenCalledWith("123", {
					$inc: { quantity: 10 },
				});

				expect(service.transformDocuments).toHaveBeenCalledTimes(1);
				expect(service.transformDocuments).toHaveBeenCalledWith(
					expect.any(Context),
					{ id: "123", value: 10 },
					record,
				);

				expect(service.entityChanged).toHaveBeenCalledTimes(1);
				expect(service.entityChanged).toHaveBeenCalledWith(
					"updated",
					{ _id: "123", name: "Awesome thing", price: 999, quantity: 25 },
					expect.any(Context),
				);
			});
		});

		describe("Test 'products.decreaseQuantity'", () => {
			test("should call the adapter updateById method & transform result", async () => {
				service.adapter.updateById.mockClear();
				service.transformDocuments.mockClear();
				service.entityChanged.mockClear();

				const res = await broker.call("products.decreaseQuantity", {
					id: "123",
					value: 10,
				});
				expect(res).toEqual({
					_id: "123",
					name: "Awesome thing",
					price: 999,
					quantity: 25,
				});

				expect(service.adapter.updateById).toHaveBeenCalledTimes(1);
				expect(service.adapter.updateById).toHaveBeenCalledWith("123", {
					$inc: { quantity: -10 },
				});

				expect(service.transformDocuments).toHaveBeenCalledTimes(1);
				expect(service.transformDocuments).toHaveBeenCalledWith(
					expect.any(Context),
					{ id: "123", value: 10 },
					record,
				);

				expect(service.entityChanged).toHaveBeenCalledTimes(1);
				expect(service.entityChanged).toHaveBeenCalledWith(
					"updated",
					{ _id: "123", name: "Awesome thing", price: 999, quantity: 25 },
					expect.any(Context),
				);
			});

			test("should throw error if params is not valid", async () => {
				service.adapter.updateById.mockClear();
				service.transformDocuments.mockClear();
				service.entityChanged.mockClear();

				expect.assertions(2);
				try {
					await broker.call("products.decreaseQuantity", {
						id: "123",
						value: -5,
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
							type: "numberPositive",
						},
					]);
				}
			});
		});
	});

	describe("Test methods", () => {
		const broker = new ServiceBroker({ logger: false });
		const service = broker.createService(TestService as unknown as ServiceSchema);

		jest.spyOn(service.adapter, "insertMany");
		jest.spyOn(service, "seedDB");

		beforeAll(() => broker.start());
		afterAll(() => broker.stop());

		describe("Test 'seedDB'", () => {
			test("should be called after service started & DB connected", () => {
				expect(service.seedDB).toHaveBeenCalledTimes(1);
				expect(service.seedDB).toHaveBeenCalledWith();
			});

			test("should insert 3 documents", () => {
				expect(service.adapter.insertMany).toHaveBeenCalledTimes(1);
				expect(service.adapter.insertMany).toHaveBeenCalledWith([
					{ name: "Samsung Galaxy S10 Plus", quantity: 10, price: 704 },
					{ name: "iPhone 11 Pro", quantity: 25, price: 999 },
					{ name: "Huawei P30 Pro", quantity: 15, price: 679 },
				]);
			});
		});
	});

	describe("Test hooks", () => {
		const broker = new ServiceBroker({ logger: false });
		const createActionFn = jest.fn();
		broker.createService({
			name: "products",
			mixins: [TestService as unknown as ServiceSchema],
			actions: {
				create: {
					handler: createActionFn,
				},
			},
		});

		beforeAll(() => broker.start());
		afterAll(() => broker.stop());

		describe("Test before 'create' hook", () => {
			test("should add quantity with zero", async () => {
				await broker.call("products.create", {
					id: "111",
					name: "Test product",
					price: 100,
				});

				expect(createActionFn).toHaveBeenCalledTimes(1);
				expect(createActionFn.mock.calls[0][0].params).toEqual({
					id: "111",
					name: "Test product",
					price: 100,
					quantity: 0,
				});
			});
		});
	});
});
