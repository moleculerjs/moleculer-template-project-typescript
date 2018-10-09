module.exports = {
  coverageDirectory: '<rootDir>/coverage',
  testEnvironment: 'node',
  moduleFileExtensions: [
    'js',
    'ts',
    'tsx',
  ],
  testMatch: [
    '**/*.spec.(ts|js)',
  ],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
    },
  },
  preset: 'ts-jest',
}

