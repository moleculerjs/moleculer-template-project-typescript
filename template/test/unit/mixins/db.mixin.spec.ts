import { afterAll, beforeAll, describe, expect, test } from "@jest/globals";

const { ServiceBroker } = require("moleculer");
const DbMixin = require("../../../mixins/db.mixin");

describe("Test DB mixin", () => {
	describe("Test schema generator", () => {
		const broker = new ServiceBroker({ logger: false, cacher: "Memory" });

		beforeAll(() => broker.start());
		afterAll(() => broker.stop());

		it("check schema properties", async () => {
			const schema = DbMixin("my-collection");

			expect(schema.started).toBeDefined();
			expect(schema.events["cache.clean.my-collection"]).toBeInstanceOf(Function);
			expect(schema.methods.entityChanged).toBeInstanceOf(Function);
		});

		it("check cache event handler", async () => {
			jest.spyOn(broker.cacher, "clean");

			const schema = DbMixin("my-collection");

			await schema.events["cache.clean.my-collection"].call({
				broker,
				fullName: "my-service"
			});

			expect(broker.cacher.clean).toBeCalledTimes(1);
			expect(broker.cacher.clean).toBeCalledWith("my-service.*");
		});

		describe("Check service started handler", () => {
			it("should not call seedDB method", async () => {
				const schema = DbMixin("my-collection");

				const adapterMock = {
					count: jest.fn(async () => 10)
				};
				let getAdapterMock = jest.fn(() => {
					return Promise.resolve(adapterMock);
				});
				const seedDBFn = jest.fn();

				await schema.started.call({
					broker,
					logger: broker.logger,
					getAdapter: getAdapterMock,
					seedDB: seedDBFn
				});

				expect(adapterMock.count).toBeCalledTimes(1);
				expect(adapterMock.count).toBeCalledWith();

				expect(seedDBFn).toBeCalledTimes(0);
			});

			it("should call seedDB method", async () => {
				const schema = DbMixin("my-collection");

				const adapterMock = {
					count: jest.fn(async () => 0)
				};
				let getAdapterMock = jest.fn(() => {
					return Promise.resolve(adapterMock);
				});
				const seedDBFn = jest.fn();

				await schema.started.call({
					broker,
					logger: broker.logger,
					getAdapter: getAdapterMock,
					seedDB: seedDBFn
				});

				expect(adapterMock.count).toBeCalledTimes(2);
				expect(adapterMock.count).toBeCalledWith();

				expect(seedDBFn).toBeCalledTimes(1);
				expect(seedDBFn).toBeCalledWith();
			});
		});

		it("should broadcast a cache clear event", async () => {
			const schema = DbMixin("my-collection");

			const ctx = {
				broadcast: jest.fn()
			};

			await schema.methods.entityChanged(null, null, null, ctx);

			expect(ctx.broadcast).toBeCalledTimes(1);
			expect(ctx.broadcast).toBeCalledWith("cache.clean.my-collection");
		});
	});
});
