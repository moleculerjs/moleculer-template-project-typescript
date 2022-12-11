/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	coverageDirectory: "./coverage",
	rootDir: "./",
	roots: [
		"./test"
	]
};
