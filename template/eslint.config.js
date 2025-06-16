const js = require("@eslint/js");
const globals = require("globals");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
	js.configs.recommended,
	eslintPluginPrettierRecommended,
	{
		files: ["**/*.js", "**/*.mjs"],
		languageOptions: {
			parserOptions: {
				sourceType: "module",
				ecmaVersion: 2023
			},
			globals: {
				...globals.node,
				...globals.es2020,
				...globals.commonjs,
				...globals.es6,
				...globals.jquery,
				...globals.jest,
				...globals.jasmine,
				process: "readonly",
				fetch: "readonly"
			}
		},
		rules: {
			"no-var": ["error"],
			"no-unused-vars": ["warn"],
			"no-trailing-spaces": ["error"],
			"no-process-exit": ["off"],
			"node/no-unpublished-require": 0
		}
	},
	{
		files: ["test/**/*.js"],
		rules: {
			"no-unused-vars": ["off"]
		}
	}
];
