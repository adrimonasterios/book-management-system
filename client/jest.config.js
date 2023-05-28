module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/test/jest/__mocks__/styleMock.js",
  },
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  moduleDirectories: ["node_modules", "src"],
};
