module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: './src/test-setup/call-setup.js'
};