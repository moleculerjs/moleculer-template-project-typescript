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
        type: "confirm",
        name: "tracing",
        message: "Would you like to enable tracing?",
        default: true
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
      "services/api.service.js": "apiGW",
      "public/**/*": "apiGW",

      "services/products.service.js": "dbService",
      "mixins/db.mixin.js": "dbService",
      "test/mixins/db.mixin.spec.js": "dbService",
      "test/integration/products.service.spec.js": "dbService",
      "test/unit/services/products.spec.js": "dbService",

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
