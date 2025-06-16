import { afterAll, beforeAll, describe, it, expect, vi } from "vitest";


process.env.PORT = 0; // Use random ports during tests

import HTTPrequest from "supertest";
{{#apiIO}}
import io from "socket.io-client";
{{/apiIO}}
{{#apiGQL}}
import { request, gql } from "graphql-request";
{{/apiGQL}}

import { Context, ServiceBroker } from "moleculer";
// Load service schemas
import APISchema from "../../../services/api.service";
import GreeterSchema from "../../../services/greeter.service";
{{#dbService}}
import ProductsSchema from "../../../services/products.service";
{{/dbService}}

describe("Test HTTP API gateway", () => {
	let broker = new ServiceBroker({ logger: false });
	broker.sendToChannel = vi.fn();

	let greeterService = broker.createService(GreeterSchema);
	let apiService = broker.createService(APISchema);
	{{#dbService}}
	let productsService = broker.createService(ProductsSchema);
	productsService.seedDB = null; // Disable seeding
	{{/dbService}}

	beforeAll(async () => {
		await broker.start();

		// Add small delay for API service to register product's custom endpoints
		await broker.Promise.delay(500);
	});
	afterAll(() => broker.stop());

	let PHONE_ID;

	describe('Test "greeter" endpoints', () => {
		it("test '/api/greeter/hello'", () => {
			return HTTPrequest(apiService.server)
				.get("/api/greeter/hello")
				.then(res => {
					expect(res.body).toEqual("Hello Moleculer");
				});
		});

		it("test '/api/unknown-route'", () => {
			return HTTPrequest(apiService.server)
				.get("/api/unknown-route")
				.then(res => {
					expect(res.statusCode).toBe(404);
				});
		});
	});

	{{#dbService}}
	describe('Test "products" endpoints', () => {
		it("test 'GET /api/products' - 'products.list' action", () => {
			return HTTPrequest(apiService.server)
				.get("/api/products/")
				.then(res => {
					expect(res.body).toEqual({
						page: 1,
						pageSize: 10,
						rows: [],
						total: 0,
						totalPages: 0
					});
				});
		});

		it("test 'GET /api/products/all' - 'products.find' action - before insertion", () => {
			return HTTPrequest(apiService.server)
				.get("/api/products/all")
				.then(res => {
					expect(res.body).toEqual([]);
				});
		});

		it("test 'GET /api/products/count' - 'products.count' action  - before insertion", () => {
			return HTTPrequest(apiService.server)
				.get("/api/products/count")
				.then(res => {
					expect(res.body).toEqual(0);
				});
		});

		it("test 'POST /api/products'- 'products.create' action", () => {
			return HTTPrequest(apiService.server)
				.post("/api/products")
				.send({ name: "Super Phone", price: 123 })
				.then(res => {
					PHONE_ID = res.body.id;
					expect(res.body).toEqual({
						id: expect.any(String),
						name: "Super Phone",
						price: 123,
						quantity: 0
					});
				});
		});

		it("test 'GET /api/products/all' - 'products.find' action - after insertion", () => {
			return HTTPrequest(apiService.server)
				.get("/api/products/all")
				.then(res => {
					expect(res.body).toEqual([
						{
							id: expect.any(String),
							name: "Super Phone",
							price: 123,
							quantity: 0
						},
					]);
				});
		});

		it("test 'GET /api/products/count' - 'products.count' action - after insertion", () => {
			return HTTPrequest(apiService.server)
				.get("/api/products/count")
				.then(res => {
					expect(res.body).toEqual(1);
				});
		});

		it("test 'PATCH /api/products/:id' - 'products.update' action", () => {
			return HTTPrequest(apiService.server)
				.patch(`/api/products/${PHONE_ID}`)
				.send({ price: 999 })
				.then(res => {
					expect(res.body).toEqual({
						id: expect.any(String),
						name: "Super Phone",
						price: 999,
						quantity: 0
					});
				});
		});

		it("test 'PUT /api/products/:id' - 'products.replace' action", () => {
			return HTTPrequest(apiService.server)
				.put(`/api/products/${PHONE_ID}`)
				.send({ name: "Mega Phone", price: 999, quantity: 10 })
				.then(res => {
					expect(res.body).toEqual({
						id: expect.any(String),
						name: "Mega Phone",
						price: 999,
						quantity: 10
					});
				});
		});

		it("test 'PUT /api/products/increaseQuantity' - 'products.increaseQuantity' action ", () => {
			return HTTPrequest(apiService.server)
				.post("/api/products/increaseQuantity")
				.send({ id: PHONE_ID, value: 10 })
				.then(res => {
					expect(res.body).toEqual({
						id: expect.any(String),
						name: "Mega Phone",
						price: 999,
						quantity: 20
					});
				});
		});

		it("test 'PUT /api/products/decreaseQuantity' - 'products.decreaseQuantity'", () => {
			return HTTPrequest(apiService.server)
				.post("/api/products/decreaseQuantity")
				.send({ id: PHONE_ID, value: 5 })
				.then(res => {
					expect(res.body).toEqual({
						id: expect.any(String),
						name: "Mega Phone",
						price: 999,
						quantity: 15
					});
				});
		});

		it("test 'DELETE /api/products/remove' - 'products.remove' action", () => {
			return HTTPrequest(apiService.server)
				.post("/api/products/remove")
				.send({ id: PHONE_ID })
				.then(res => {
					expect(res.body).toEqual(PHONE_ID);
				});
		});

		it("test 'GET /api/products/all' - 'products.find' action - after removal", () => {
			return HTTPrequest(apiService.server)
				.get("/api/products/all")
				.then(res => {
					expect(res.body).toEqual([]);
				});
		});

		it("test 'GET /api/products/count' - 'products.count' action  - after removal", () => {
			return HTTPrequest(apiService.server)
				.get("/api/products/count")
				.then(res => {
					expect(res.body).toEqual(0);
				});
		});
	});
	{{/dbService}}
});

{{#apiIO}}
describe("Test Socket.IO API gateway", () => {
	let broker = new ServiceBroker({ logger: false });
	broker.sendToChannel = vi.fn();

	let greeterService = broker.createService(GreeterSchema);
	let apiService = broker.createService(APISchema);
	{{#dbService}}
	let productsService = broker.createService(ProductsSchema);
	productsService.seedDB = null; // Disable seeding
	{{/dbService}}

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	/**
	 * Socket.IO client helper function
	 * @param {import('socket.io-client').Socket} client
	 * @param {String} action
	 * @param {Object} params
	 * @returns
	 */
	function callAwait(client, action, params) {
		return new Promise(function (resolve, reject) {
			client.emit("call", action, params, function (err, res) {
				if (err) return reject(err);
				resolve(res);
			});
		});
	}

	describe('Test "greeter" actions', () => {
		let client;
		let port;

		beforeAll(() => {
			port = apiService.io.httpServer.address().port;
			client = io.connect(`ws://localhost:${port}`, { forceNew: true });
		});
		afterAll(() => client.disconnect());

		it("test 'greeter.hello'", async () => {
			const res = await callAwait(client, "greeter.hello");
			expect(res).toBe("Hello Moleculer");
		});

		it("test 'greeter.welcome'", async () => {
			const res = await callAwait(client, "greeter.welcome", { name: "Socket.IO" });
			expect(res).toBe("Welcome, Socket.IO");
		});
	});

	{{#dbService}}
	describe('Test "products" actions', () => {
		let client;
		let port;
		let PHONE_ID;

		beforeAll(() => {
			port = apiService.io.httpServer.address().port;
			client = io.connect(`ws://localhost:${port}`, { forceNew: true });
		});
		afterAll(() => client.disconnect());

		it("test 'products.list'", async () => {
			const res = await callAwait(client, "products.list");
			expect(res).toEqual({ page: 1, pageSize: 10, rows: [], total: 0, totalPages: 0 });
		});

		it("test 'products.find' - before insertion", async () => {
			const res = await callAwait(client, "products.find");
			expect(res).toEqual([]);
		});

		it("test 'products.count' - before insertion", async () => {
			const res = await callAwait(client, "products.count");
			expect(res).toEqual(0);
		});

		it("test 'products.create'", async () => {
			const res = await callAwait(client, "products.create", {
				name: "Super Phone",
				price: 123
			});
			PHONE_ID = res.id;

			expect(res).toEqual({
				id: expect.any(String),
				name: "Super Phone",
				price: 123,
				quantity: 0
			});
		});

		it("test 'products.find' - after insertion", async () => {
			const res = await callAwait(client, "products.find");
			expect(res).toEqual([
				{
					id: expect.any(String),
					name: "Super Phone",
					price: 123,
					quantity: 0
				},
			]);
		});

		it("test 'products.count' - after insertion", async () => {
			const res = await callAwait(client, "products.count");
			expect(res).toEqual(1);
		});

		it("test 'products.update'", async () => {
			const res = await callAwait(client, "products.update", {
				id: PHONE_ID,
				price: 999
			});

			expect(res).toEqual({
				id: expect.any(String),
				name: "Super Phone",
				price: 999,
				quantity: 0
			});
		});

		it("test 'products.replace'", async () => {
			const res = await callAwait(client, "products.update", {
				id: PHONE_ID,
				name: "Mega Phone",
				price: 999,
				quantity: 10
			});

			expect(res).toEqual({
				id: expect.any(String),
				name: "Mega Phone",
				price: 999,
				quantity: 10
			});
		});

		it("test 'products.increaseQuantity'", async () => {
			const res = await callAwait(client, "products.increaseQuantity", {
				id: PHONE_ID,
				value: 10
			});

			expect(res).toEqual({
				id: expect.any(String),
				name: "Mega Phone",
				price: 999,
				quantity: 20
			});
		});

		it("test 'products.decreaseQuantity'", async () => {
			const res = await callAwait(client, "products.decreaseQuantity", {
				id: PHONE_ID,
				value: 5
			});

			expect(res).toEqual({
				id: expect.any(String),
				name: "Mega Phone",
				price: 999,
				quantity: 15
			});
		});

		it("test 'products.remove'", async () => {
			const res = await callAwait(client, "products.remove", {
				id: PHONE_ID,
			});

			expect(res).toEqual(PHONE_ID);
		});

		it("test 'products.find' - after removal", async () => {
			const res = await callAwait(client, "products.find");
			expect(res).toEqual([]);
		});

		it("test 'products.count' - after removal", async () => {
			const res = await callAwait(client, "products.count");
			expect(res).toEqual(0);
		});
	});
	{{/dbService}}
});
{{/apiIO}}

{{#apiGQL}}
describe("Test GraphQL API gateway", () => {
	let broker = new ServiceBroker({ logger: false });
	broker.sendToChannel = vi.fn();

	let greeterService = broker.createService(GreeterSchema);
	let apiService = broker.createService(APISchema);
	{{#dbService}}
	let productsService = broker.createService(ProductsSchema);
	productsService.seedDB = null; // Disable seeding
	{{/dbService}}

	beforeAll(() => broker.start());
	afterAll(() => broker.stop());

	describe('Test "greeter" actions', () => {
		let port;

		beforeAll(() => {
			port = apiService.server.address().port;
		});

		it("test 'greeter.hello'", async () => {
			const query = gql`
				query {
					hello
				}
			`;
			const res = await request(`http://localhost:${port}/graphql`, query);
			expect(res).toEqual({ hello: "Hello Moleculer" });
		});

		it("test 'greeter.welcome'", async () => {
			const query = gql`
				mutation {
					welcome(name: "GraphQL")
				}
			`;
			const res = await request(`http://localhost:${port}/graphql`, query);
			expect(res).toEqual({
				welcome: "Welcome, GraphQL",
			});
		});
	});

	{{#dbService}}
	describe('Test "product" actions', () => {
		let port;
		let PHONE_ID;

		beforeAll(() => {
			port = apiService.server.address().port;
		});

		it("test 'product.list'", async () => {
			const query = gql`
				query {
					listProducts {
						total
						page
						pageSize
						totalPages
						rows {
							id
							name
							quantity
							price
						}
					}
				}
			`;
			const res = await request(`http://localhost:${port}/graphql`, query);
			expect(res).toEqual({
				listProducts: {
					page: 1,
					pageSize: 10,
					rows: [],
					total: 0,
					totalPages: 0
				},
			});
		});

		it("test 'product.find' - before insertion", async () => {
			const query = gql`
				query {
					findProducts {
						id
						name
						quantity
						price
					}
				}
			`;
			const res = await request(`http://localhost:${port}/graphql`, query);
			expect(res).toEqual({
				findProducts: []
			});
		});

		it("test 'product.count' - before insertion", async () => {
			const query = gql`
				query {
					countProducts
				}
			`;
			const res = await request(`http://localhost:${port}/graphql`, query);
			expect(res).toEqual({
				countProducts: 0
			});
		});

		it("test 'product.create'", async () => {
			const query = gql`
				mutation {
					createProduct(name: "Super Phone", price: 123) {
						id
						name
						quantity
						price
					}
				}
			`;
			const res = await request(`http://localhost:${port}/graphql`, query);

			PHONE_ID = res.createProduct.id;

			expect(res).toEqual({
				createProduct: {
					id: expect.any(String),
					name: "Super Phone",
					quantity: 0,
					price: 123
				},
			});
		});

		it("test 'product.find' - after insertion", async () => {
			const query = gql`
				query {
					findProducts {
						id
						name
						quantity
						price
					}
				}
			`;
			const res = await request(`http://localhost:${port}/graphql`, query);
			expect(res).toEqual({
				findProducts: [
					{
						id: expect.any(String),
						name: "Super Phone",
						price: 123,
						quantity: 0
					},
				],
			});
		});

		it("test 'product.count' - after insertion", async () => {
			const query = gql`
				query {
					countProducts
				}
			`;
			const res = await request(`http://localhost:${port}/graphql`, query);
			expect(res).toEqual({
				countProducts: 1
			});
		});

		it("test 'product.update'", async () => {
			const query = gql`
				mutation {
					updateProduct(id: "${PHONE_ID}", price: 999) {
						id
						name
						quantity
						price
					}
				}
			`;
			const res = await request(`http://localhost:${port}/graphql`, query);

			expect(res).toEqual({
				updateProduct: {
					id: expect.any(String),
					name: "Super Phone",
					price: 999,
					quantity: 0
				},
			});
		});

		it("test 'product.replace'", async () => {
			const query = gql`
				mutation {
					replaceProduct(id: "${PHONE_ID}", name: "Mega Phone", price: 999, quantity: 10) {
						id
						name
						quantity
						price
					}
				}
			`;
			const res = await request(`http://localhost:${port}/graphql`, query);

			expect(res).toEqual({
				replaceProduct: {
					id: expect.any(String),
					name: "Mega Phone",
					price: 999,
					quantity: 10
				},
			});
		});

		it("test 'product.increaseQuantity'", async () => {
			const query = gql`
				mutation {
					increaseQuantity(id: "${PHONE_ID}", value: 10) {
						id
						name
						quantity
						price
					}
				}
			`;
			const res = await request(`http://localhost:${port}/graphql`, query);

			expect(res).toEqual({
				increaseQuantity: {
					id: expect.any(String),
					name: "Mega Phone",
					price: 999,
					quantity: 20
				},
			});
		});

		it("test 'product.decreaseQuantity'", async () => {
			const query = gql`
				mutation {
					decreaseQuantity(id: "${PHONE_ID}", value: 5) {
						id
						name
						quantity
						price
					}
				}
			`;
			const res = await request(`http://localhost:${port}/graphql`, query);

			expect(res).toEqual({
				decreaseQuantity: {
					id: expect.any(String),
					name: "Mega Phone",
					price: 999,
					quantity: 15
				},
			});
		});

		it("test 'product.remove'", async () => {
			const query = gql`
				mutation {
					removeProduct(id: "${PHONE_ID}")
				}
			`;
			const res = await request(`http://localhost:${port}/graphql`, query);

			expect(res).toEqual({
				removeProduct: PHONE_ID
			});
		});

		it("test 'product.find' - after removal", async () => {
			const query = gql`
				query {
					findProducts {
						id
						name
						quantity
						price
					}
				}
			`;
			const res = await request(`http://localhost:${port}/graphql`, query);
			expect(res).toEqual({
				findProducts: []
			});
		});

		it("test 'product.count' - after removal", async () => {
			const query = gql`
				query {
					countProducts
				}
			`;
			const res = await request(`http://localhost:${port}/graphql`, query);
			expect(res).toEqual({
				countProducts: 0
			});
		});
	});
	{{/dbService}}
});
{{/apiGQL}}
