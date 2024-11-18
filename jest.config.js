export default {
    transform: {
      '^.+\\.js$': 'babel-jest',
    },
    testEnvironment: 'node',
    testTimeout: 10000,
    setupFilesAfterEnv: ['./tests/setupTests.js'],
    verbose: true,
  };