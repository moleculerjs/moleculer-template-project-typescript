import { afterAll, beforeAll, describe, it, expect, vi } from "vitest";

import { ServiceBroker } from "moleculer";
import DbMixin from "../../../mixins/db.mixin.js";

describe("Test DB mixin", () => {
	describe("Test schema generator", () => {
		const broker = new ServiceBroker({ logger: false, cacher: "Memory" });

		beforeAll(() => broker.start());
		afterAll(() => broker.stop());

		it("check schema properties", async () => {
			const schema = DbMixin({ collection: "my-collection" }) as any;

			expect(schema.started).toBeDefined();
			expect(schema.events["cache.clean.my-collection"]).toBeInstanceOf(Function);
		});

		it("check cache event handler", async () => {
			vi.spyOn(broker.cacher!, "clean");

			const schema = DbMixin({ collection: "my-collection" }) as any;

			await schema.events["cache.clean.my-collection"].call({
				broker,
				fullName: "my-service"
			});

			expect(broker.cacher!.clean).toBeCalledTimes(1);
			expect(broker.cacher!.clean).toBeCalledWith("my-service.*");
		});

		describe("Check service started handler", () => {
			it("should not call seedDB method", async () => {
				const schema = DbMixin({ collection: "my-collection" }) as any;

				const adapterMock = {
					count: vi.fn(async () => 10)
				};
				let getAdapterMock = vi.fn(() => {
					return Promise.resolve(adapterMock);
				});
				const seedDBFn = vi.fn();

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
				const schema = DbMixin({ collection: "my-collection" }) as any;

				const adapterMock = {
					count: vi.fn(async () => 0)
				};
				let getAdapterMock = vi.fn(() => {
					return Promise.resolve(adapterMock);
				});
				const seedDBFn = vi.fn();

				await schema.started!.call({
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
	});
});
