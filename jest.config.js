// https://stackoverflow.com/questions/55521787/filereader-file-and-textdecoder-in-jest-test-not-defined
const { TextDecoder, TextEncoder } = require("util");
module.exports = {
  verbose: true,
  testEnvironment: "jsdom",
  moduleFileExtensions: ["js", "json", "vue"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  transform: {
    "^.+\\.js$": "babel-jest", // test .js files with babel-jest
    "^.+\\.vue$": "@vue/vue2-jest", // test .vue files with vue2-jest
  },
  globals: {
    TextDecoder: TextDecoder,
    TextEncoder: TextEncoder,
  },
};
