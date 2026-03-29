"use strict";

module.exports = function(values) {
  return {
        questions: [
            {
                type: "confirm",
                name: "apiGW",
                message: "Add HTTP API Gateway (moleculer-web) service?",
                default: true,
            },
            {
                type: "confirm",
                name: "apiGQL",
                message: "Add GraphQL Gateway?",
                default: false,
            },
            {
                type: "confirm",
                name: "apiIO",
                message: "Add Socket.Io Gateway?",
                default: false,
            },
            {
                type: "confirm",
                name: "needTransporter",
                message: "Would you like to communicate with other nodes?",
                default: true,
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
                    { name: "Kafka", value: "Kafka" },
                    { name: "AMQP 1.0", value: "AMQP10" },
                ],
                when(answers) {
                    return answers.needTransporter;
                },
                default: "NATS",
            },
            {
                type: "confirm",
                name: "needCacher",
                message: "Would you like to use cache?",
                default: false,
            },
            {
                type: "list",
                name: "cacher",
                message: "Select a cacher solution",
                choices: [
                    { name: "Memory", value: "Memory" },
                    { name: "Redis", value: "Redis" },
                ],
                when(answers) {
                    return answers.needCacher;
                },
                default: "Memory",
            },
            {
                type: "confirm",
                name: "dbService",
                message: "Add DB sample service?",
                default: true,
            },
            {
                type: "confirm",
                name: "needChannels",
                message: "Add Moleculer Channels middleware?",
                default: false,
            },
            {
                type: "list",
                name: "channels",
                message: "Select a Channels",
                choices: [
                    { name: "NATS", value: "NATS" },
                    { name: "Redis", value: "Redis" },
                    { name: "AMQP", value: "AMQP" },
                    { name: "Kafka", value: "Kafka" },
                ],
                when(answers) {
                    return answers.needChannels;
                },
                default: "NATS",
            },
            {
                type: "confirm",
                name: "needWorkflows",
                message: "Add Moleculer Workflows middleware?",
                default: false,
            },
            {
                type: "confirm",
                name: "metrics",
                message: "Would you like to enable metrics?",
                default: true,
            },
            {
                type: "confirm",
                name: "tracing",
                message: "Would you like to enable tracing?",
                default: true,
            },
            {
                type: "confirm",
                name: "docker",
                message: "Add Docker & Kubernetes sample files?",
                default: true,
            },
            {
                type: "confirm",
                name: "lint",
                message: "Use ESLint to lint your code?",
                default: true,
            },
        ],

        metalsmith: {
            before(metalsmith) {
                const data = metalsmith.metadata();

                data.redis = data.cacher == "Redis" || data.transporter == "Redis" || data.channels == "Redis" || data.needWorkflows;
                data.nats = data.transporter == "NATS" || data.channels == "NATS";
                data.rabbitmq = data.transporter == "AMQP" || data.channels == "AMQP";
                data.kafka = data.transporter == "Kafka" || data.channels == "Kafka";
                data.hasDepends =
                    (data.needCacher && data.cacher !== "Memory") ||
                    (data.needTransporter && data.transporter != "TCP") ||
                    data.needChannels || data.needWorkflows;

                data.monolith = data.transporter == "None" || !data.needTransporter;
            },

            async complete(metalsmith, helpers) {
                if (values.lint && values.wasNpmInstall && helpers.exec) {
                    try {
                        await helpers.exec([`cd ${values.projectPath}`, "npm run lint:fix"]);
                    } catch {}
                }
            }
        },

        skipInterpolation: [
            "public/favicon.ico"
        ],

        filters: {
            "services/api.service.ts": "apiGW",
            "public/**/*": "apiGW",

            "services/products.service.ts": "dbService",
            "mixins/db.mixin.ts": "dbService",
            "test/unit/mixins/db.mixin.spec.ts": "dbService",
            "test/integration/products.service.spec.ts": "dbService",
            "test/unit/services/products.spec.ts": "dbService",
            
            "services/inventory.service.ts": "needChannels",
            "test/unit/services/inventory.spec.ts": "needChannels",

            "services/orders.service.ts": "needWorkflows",

            "eslint.config.mjs": "lint",
            "tsconfig.eslint.json": "lint", // ???
            "prettier.config.js": "lint",

            ".dockerignore": "docker",
            "docker-compose.*": "docker",
            Dockerfile: "docker",
            "k8s.yaml": "docker",
        },

        completeMessage: `
To get started:

	cd {{projectName}}
	npm run dev

		`,
    };
};