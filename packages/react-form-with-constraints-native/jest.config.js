// @ts-check

/** @type Partial<import('@jest/types').Config.InitialOptions> */
const config = {
  preset: 'react-native',

  setupFiles: ['../react-form-with-constraints/jest.setup.ts'],

  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.jsx?$': 'babel-jest'
  }
};

module.exports = config;
