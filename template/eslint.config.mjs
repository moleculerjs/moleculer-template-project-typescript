// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	eslintPluginPrettierRecommended,
	{
		languageOptions: {
			globals: {
				...globals.node
			}
		},
		rules: {
			"no-var": ["error"],
			"no-console": ["warn"],
			"@typescript-eslint/no-unused-vars": ["warn"],
		}
	},
	{
		files: ["test/**/*.ts"],
		rules: {
			"no-unused-vars": ["off"],
			"@typescript-eslint/no-explicit-any": ["off"]
		}
	}
);
