"use strict";
import { BrokerOptions, Errors, MetricRegistry } from "moleculer";

/**
 * Moleculer ServiceBroker configuration file
 *
 * More info about options: https://moleculer.services/docs/0.14/broker.html#Broker-options
 *
 * Overwrite options in production:
 * ================================
 * 	You can overwrite any option with environment variables.
 * 	For example to overwrite the "logLevel", use `LOGLEVEL=warn` env var.
 * 	To overwrite a nested parameter, e.g. retryPolicy.retries, use `RETRYPOLICY_RETRIES=10` env var.
 *
 * 	To overwrite broker’s deeply nested default options, which are not presented in "moleculer.config.ts",
 * 	via environment variables, use the `MOL_` prefix and double underscore `__` for nested properties in .env file.
 * 	For example, to set the cacher prefix to `MYCACHE`, you should declare an env var as
 *  `MOL_CACHER__OPTIONS__PREFIX=MYCACHE`.
 */
const brokerConfig: BrokerOptions = {
	// Namespace of nodes to segment your nodes on the same network.
	namespace: "",
	// Unique node identifier. Must be unique in a namespace.
	nodeID: null,

	// Enable/disable logging or use custom logger. More info: https://moleculer.services/docs/0.14/logging.html
	logger: true,
	// Log level for built-in console logger. Available values: trace, debug, info, warn, error, fatal
	logLevel: "info",
	// Log formatter for built-in console logger. Available values: default, simple, short. It can be also a `Function`.
	logFormatter: "default",
	// Custom object & array printer for built-in console logger.
	logObjectPrinter: null,

	// Define transporter.
	// More info: https://moleculer.services/docs/0.14/networking.html
	transporter: "{{transporter}}",

	// Define a cacher.
	// More info: https://moleculer.services/docs/0.14/caching.html
	cacher: "{{cacher}}",
	// Define a serializer.
	// Available values: "JSON", "Avro", "ProtoBuf", "MsgPack", "Notepack", "Thrift".
	// More info: https://moleculer.services/docs/0.14/networking.html
	serializer: "JSON",

	// Number of milliseconds to wait before reject a request with a RequestTimeout error. Disabled: 0
	requestTimeout: 10 * 1000,

	// Retry policy settings. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Retry
	retryPolicy: {
		// Enable feature
		enabled: false,
		// Count of retries
		retries: 5,
		// First delay in milliseconds.
		delay: 100,
		// Maximum delay in milliseconds.
		maxDelay: 1000,
		// Backoff factor for delay. 2 means exponential backoff.
		factor: 2,
		// A function to check failed requests.
		check: (err: Errors.MoleculerRetryableError) => err && !!err.retryable,
	},

	// Limit of calling level. If it reaches the limit, broker will throw an MaxCallLevelError error.
	// (Infinite loop protection)
	maxCallLevel: 100,

	// Number of seconds to send heartbeat packet to other nodes.
	heartbeatInterval: 5,
	// Number of seconds to wait before setting node to unavailable status.
	heartbeatTimeout: 15,

	// Tracking requests and waiting for running requests before shutdowning.
	// More info: https://moleculer.services/docs/0.14/fault-tolerance.html
	tracking: {
		// Enable feature
		enabled: false,
		// Number of milliseconds to wait before shutdowning the process
		shutdownTimeout: 5000,
	},

	// Disable built-in request & emit balancer. (Transporter must support it, as well.)
	disableBalancer: false,

	// Settings of Service Registry. More info: https://moleculer.services/docs/0.14/registry.html
	registry: {
		// Define balancing strategy.
		// Available values: "RoundRobin", "Random", "CpuUsage", "Latency"
		strategy: "RoundRobin",
		// Enable local action call preferring.
		preferLocal: true,
	},

	// Settings of Circuit Breaker. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Circuit-Breaker
	circuitBreaker: {
		// Enable feature
		enabled: false,
		// Threshold value. 0.5 means that 50% should be failed for tripping.
		threshold: 0.5,
		// Minimum request count. Below it, CB does not trip.
		minRequestCount: 20,
		// Number of seconds for time window.
		windowTime: 60,
		// Number of milliseconds to switch from open to half-open state
		halfOpenTime: 10 * 1000,
		// A function to check failed requests.
		check: (err: Errors.MoleculerRetryableError) => err && err.code >= 500,
	},

	// Settings of bulkhead feature. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Bulkhead
	bulkhead: {
		// Enable feature.
		enabled: false,
		// Maximum concurrent executions.
		concurrency: 10,
		// Maximum size of queue
		maxQueueSize: 100,
	},

	// Custom Validator class for validation.
	validator: null,

	// Enable metrics function. More info: https://moleculer.services/docs/0.14/metrics.html
	metrics: {
		enabled: {{#if metrics}}true{{/if}}{{#unless metrics}}false{{/unless}},
		// Available built-in reporters: "Console", "CSV", "Event", "Prometheus", "Datadog", "StatsD"
		reporter: {
			type: "{{reporter}}",
			{{#if_eq reporter "Console"}}
			options: {
				// HTTP port
				port: 3030,
				// HTTP URL path
				path: "/metrics",
				// Default labels which are appended to all metrics labels
				// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
				defaultLabels(registry: MetricRegistry) {
					return {
						namespace: registry.broker.namespace,
						nodeID: registry.broker.nodeID,
					};
				},
			},
			{{/if_eq}}

			{{#if_eq reporter "CSV"}}
				options: {
					// Folder of CSV files.
					folder: "./reports/metrics",
						// CSV field delimiter
						delimiter: ",",
						// CSV row delimiter
						rowDelimiter: "\n",
						// Saving mode.
						//   - "metric" - save metrics to individual files
						//   - "label" - save metrics by labels to individual files
						mode: "metric",
						// Saved metrics types.
						types: null,
						// Saving interval in seconds
						interval: 5,
						// Custom filename formatter
						filenameFormatter: null,
						// Custom CSV row formatter.
						rowFormatter: null,
				}
			{{/if_eq}}
			{{#if_eq reporter "Event"}}
				options: {
					// Event name
					eventName: "$metrics.snapshot",
						// Broadcast or emit
						broadcast: false,
						// Event groups
						groups: null,
						// Send only changed metrics
						onlyChanges: false,
						// Sending interval in seconds
						interval: 5,
				}
			{{/if_eq}}
			{{#if_eq reporter "Datadog"}}
				options: {
					// Hostname
					host: "my-host",
						// Base URL
						baseUrl: "https://api.datadoghq.eu/api/", // Default is https://api.datadoghq.com/api/
						// API version
						apiVersion: "v1",
						// Server URL path
						path: "/series",
						// Datadog API Key
						apiKey: process.env.DATADOG_API_KEY,
						// Default labels which are appended to all metrics labels
						defaultLabels: (registry) => ({
						namespace: registry.broker.namespace,
						nodeID: registry.broker.nodeID
					}),
						// Sending interval in seconds
						interval: 10
				}
			{{/if_eq}}
			{{#if_eq reporter "Prometheus"}}
				options: {
					// HTTP port
					port: 3030,
						// HTTP URL path
						path: "/metrics",
						// Default labels which are appended to all metrics labels
						defaultLabels: registry => ({
						namespace: registry.broker.namespace,
						nodeID: registry.broker.nodeID
					})
				}
			{{/if_eq}}
			{{#if_eq reporter "StatsD"}}
				options: {
					// Server host
					host: "localhost",
						// Server port
						port: 8125,
						// Maximum payload size.
						maxPayloadSize: 1300
				}
			{{/if_eq}}
		},
	},

	// Enable built-in tracing function. More info: https://moleculer.services/docs/0.14/tracing.html
	tracing: {
		enabled: "{{tracing}}",
{{#if_eq exporter "NewRelic"}}events: true{{/if_eq}}
// Available built-in exporters: "Console", "Datadog", "Event", "EventLegacy", "Jaeger", "Zipkin"
		exporter: {
			type: "{{exporter}}", // Console exporter is only for development!
			{{#if_eq exporter "Console"}}
			options: {
				// Custom logger
				logger: null,
					// Using colors
					colors: true,
					// Width of row
					width: 100,
					// Gauge width in the row
					gaugeWidth: 40
			}
			{{/if_eq}}
			{{#if_eq exporter "Datadog"}}
			options: {
					// Datadog Agent URL
					agentUrl: process.env.DD_AGENT_URL || "http://localhost:8126",
						// Environment variable
						env: process.env.DD_ENVIRONMENT || null,
						// Sampling priority. More info: https://docs.datadoghq.com/tracing/guide/trace_sampling_and_storage/?tab=java#sampling-rules
						samplingPriority: "AUTO_KEEP",
						// Default tags. They will be added into all span tags.
						defaultTags: null,
						// Custom Datadog Tracer options. More info: https://datadog.github.io/dd-trace-js/#tracer-settings
						tracerOptions: null,
				}
			{{/if_eq}}
			{{#if_eq exporter "Event"}}
			options: {
					// Name of event
					eventName: "$tracing.spans",
						// Send event when a span started
						sendStartSpan: false,
						// Send event when a span finished
						sendFinishSpan: true,
						// Broadcast or emit event
						broadcast: false,
						// Event groups
						groups: null,
						// Sending time interval in seconds
						interval: 5,
						// Custom span object converter before sending
						spanConverter: null,
						// Default tags. They will be added into all span tags.
						defaultTags: null
				}
			{{/if_eq}}
			{{#if_eq exporter "Jaeger"}}
			options: {
					// HTTP Reporter endpoint. If set, HTTP Reporter will be used.
					endpoint: null,
						// UDP Sender host option.
						host: "127.0.0.1",
						// UDP Sender port option.
						port: 6832,
						// Jaeger Sampler configuration.
						sampler: {
						// Sampler type. More info: https://www.jaegertracing.io/docs/1.14/sampling/#client-sampling-configuration
						type: "Const",
							// Sampler specific options.
							options: {}
					},
					// Additional options for `Jaeger.Tracer`
					tracerOptions: {},
					// Default tags. They will be added into all span tags.
					defaultTags: null
				}
			{{/if_eq}}
			{{#if_eq exporter "Zipkin"}}
			options: {
					// Base URL for Zipkin server.
					baseURL: "http://localhost:9411",
						// Sending time interval in seconds.
						interval: 5,
						// Additional payload options.
						payloadOptions: {
						// Set `debug` property in payload.
						debug: false,
							// Set `shared` property in payload.
							shared: false
					},
					// Default tags. They will be added into all span tags.
					defaultTags: null
				}
			{{/if_eq}}
			{{#if_eq exporter "NewRelic"}}
			options: {
					// Base URL for NewRelic server
					baseURL: 'https://trace-api.newrelic.com',
						// NewRelic Insert Key
						insertKey: 'my-secret-key',
						// Sending time interval in seconds.
						interval: 5,
						// Additional payload options.
						payloadOptions: {
						// Set `debug` property in payload.
						debug: false,
							// Set `shared` property in payload.
							shared: false,
					},
					// Default tags. They will be added into all span tags.
					defaultTags: null,
				},
			{{/if_eq}}
		},
	},

	// Register internal services ("$node").
	// More info: https://moleculer.services/docs/0.14/services.html#Internal-services
	internalServices: true,
	// Register internal middlewares.
	// More info: https://moleculer.services/docs/0.14/middlewares.html#Internal-middlewares
	internalMiddlewares: true,

	// Watch the loaded services and hot reload if they changed.
	// You can also enable it in Moleculer Runner with `--hot` argument
	hotReload: false,

	// Register custom middlewares
	middlewares: [],


	// Register custom REPL commands.
	replCommands: null,
};

export = brokerConfig;
