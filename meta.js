"use strict";

module.exports = function(values) {
	return {
		questions: [
			{
				type: "confirm",
				name: "apiGW",
				message: "Add API Gateway (moleculer-web) service?",
				default: true
			},
			{
				type: "confirm",
				name: "needTransporter",
				message: "Would you like to communicate with other nodes?",
				default: true
			},
			{
				type: "list",
				name: "transporter",
				message: "Select a transporter",
				choices: [
					{ name: "NATS (recommended)", value: "NATS" },
					{ name: "Redis", value: "Redis" },
					{ name: "MQTT", value: "MQTT" },
					{ name: "AMQP", value: "AMQP" },
					{ name: "TCP", value: "TCP" },
					{ name: "NATS Streaming", value: "STAN" },
					{ name: "Kafka", value: "Kafka" },
					{ name: "AMQP 1.0 (experimental)", value: "AMQP10" }
				],
				when(answers) { return answers.needTransporter; },
				default: "NATS"
			},
			{
				type: "confirm",
				name: "needCacher",
				message: "Would you like to use cache?",
				default: false
			},
			{
				type: "list",
				name: "cacher",
				message: "Select a cacher solution",
				choices: [
					{ name: "Memory", value: "Memory" },
					{ name: "Redis", value: "Redis" }
				],
				when(answers) { return answers.needCacher; },
				default: "Memory"
			},
			{
				type: "confirm",
				name: "dbService",
				message: "Add DB sample service?",
				default: true
			},
			{
				type: "confirm",
				name: "metrics",
				message: "Would you like to enable metrics?",
				default: true
			},
			{
				type: "list",
				name: "reporter",
				message: "Select a reporter solution",
				choices: [
					{ name: "Console", value: "Console" },
					{ name: "CSV", value: "Redis" },
					{ name: "Event", value: "CSV" },
					{ name: "Prometheus", value: "Prometheus" },
					{ name: "Datadog", value: "Datadog" },
					{ name: "StatsD", value: "StatsD" }
				],
				when(answers) { return answers.metrics; },
				default: "Prometheus"
			},
			{
				type: "confirm",
				name: "tracing",
				message: "Would you like to enable tracing?",
				default: true
			},
			{
				type: "list",
				name: "exporter",
				message: "Select a exporter solution",
				choices: [
					{ name: "Console", value: "Console" },
					{ name: "EventLegacy", value: "EventLegacy" },
					{ name: "Event", value: "CSV" },
					{ name: "Jaeger", value: "Jaeger" },
					{ name: "Datadog", value: "Datadog" },
					{ name: "Zipkin", value: "Zipkin" },
					{ name: "NewRelic", value: "NewRelic" }
				],
				when(answers) { return answers.metrics; },
				default: "Console"
			},
			{
				type: "confirm",
				name: "docker",
				message: "Add Docker & Kubernetes sample files?",
				default: true
			},
			{
				type: "confirm",
				name: "lint",
				message: "Use ESLint to lint your code?",
				default: true
			}
		],

		metalsmith: {
			before(metalsmith) {
				const data = metalsmith.metadata();
				data.redis = data.cacher == "Redis" || data.transporter == "Redis";
				data.hasDepends = (data.needCacher && data.cacher !== 'Memory') || (data.needTransporter && data.transporter != "TCP");
			}
		},

		skipInterpolation: [
			//"public/index.html"
		],

		filters: {
			"services/api.service.ts": "apiGW",
			"public/**/*": "apiGW",

			"services/products.service.ts": "dbService",
			"mixins/db.mixin.ts": "dbService",
			"test/mixins/db.mixin.spec.ts": "dbService",
			"test/integration/products.service.spec.ts": "dbService",
			"test/unit/services/products.spec.ts": "dbService",

			".eslintrc.js": "lint",

			".dockerignore": "docker",
			"docker-compose.*": "docker",
			"Dockerfile": "docker",
			"k8s.yaml": "docker"
		},

		completeMessage: `
    To get started:

	cd {{projectName}}
	npm run dev

		`
	};
};
