"use strict";

import { ServiceBroker } from "moleculer";
import DbService from "moleculer-db";
import DbMixin from "../../../mixins/db.mixin";

describe("Test DB mixin", () => {

	describe("Test schema generator", () => {
		const broker = new ServiceBroker({ logger: false, cacher: "Memory" });

		beforeAll(() => broker.start());
		afterAll(() => broker.stop());

		it("check schema properties", async () => {
			const schema = new DbMixin("my-collection").start();

			expect(schema.mixins).toEqual([DbService]);
			// @ts-ignore
			expect(schema.adapter).toBeInstanceOf(DbService.MemoryAdapter);
			expect(schema.started).toBeDefined();
			expect(schema.events["cache.clean.my-collection"]).toBeInstanceOf(Function);
		});

		it("check cache event handler", async () => {
			jest.spyOn(broker.cacher, "clean");

			const schema = new DbMixin("my-collection").start();

			// @ts-ignore
			await schema.events["cache.clean.my-collection"].call({ broker, fullName: "my-service" });

			expect(broker.cacher.clean).toBeCalledTimes(1);
			expect(broker.cacher.clean).toBeCalledWith("my-service.*");
		});

		describe("Check service started handler", () => {

			it("should not call seedDB method", async () => {
				const schema = new DbMixin("my-collection").start();

				schema.adapter.count = jest.fn(async () => 10);
				const seedDBFn = jest.fn();

				// @ts-ignore
				await schema.started.call({ broker, logger: broker.logger, adapter: schema.adapter, seedDB: seedDBFn });

				expect(schema.adapter.count).toBeCalledTimes(1);
				expect(schema.adapter.count).toBeCalledWith();

				expect(seedDBFn).toBeCalledTimes(0);
			});

			it("should call seedDB method", async () => {
				const schema = new DbMixin("my-collection").start();

				schema.adapter.count = jest.fn(async () => 0);
				const seedDBFn = jest.fn();

				// @ts-ignore
				await schema.started.call({ broker, logger: broker.logger, adapter: schema.adapter, seedDB: seedDBFn });

				expect(schema.adapter.count).toBeCalledTimes(2);
				expect(schema.adapter.count).toBeCalledWith();

				expect(seedDBFn).toBeCalledTimes(1);
				expect(seedDBFn).toBeCalledWith();
			});
		});

		it("should broadcast a cache clear event", async () => {
			const schema = new DbMixin("my-collection").start();

			const ctx = {
				broadcast: jest.fn(),
			};

			await schema.methods.entityChanged(null, null, ctx);

			expect(ctx.broadcast).toBeCalledTimes(1);
			expect(ctx.broadcast).toBeCalledWith("cache.clean.my-collection");
		});
	});

});
