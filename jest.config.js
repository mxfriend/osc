/** @type {import('ts-jest').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  maxWorkers: 1, // until jest supports bigint, see https://github.com/facebook/jest/issues/11617
  rootDir: 'tests',
};
