// @ts-check

const { defaults } = require('jest-config');

/** @type Partial<import('@jest/types').Config.InitialOptions> */
const config = {
  setupFiles: ['./jest.setup.ts'],
  coveragePathIgnorePatterns: [...defaults.coveragePathIgnorePatterns, './jest.setup.ts'],

  preset: 'ts-jest'
};

module.exports = config;
