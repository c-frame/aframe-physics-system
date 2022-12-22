var webpackConfiguration = require("../webpack.config.js");

module.exports = function (config) {
  config.set({
    basePath: '../',
    webpack: webpackConfiguration,
    browsers: ['Firefox', 'Chrome'],
    client: {
      captureConsole: true,
      mocha: {'ui': 'tdd'}
    },
    envPreprocessor: ['TEST_ENV'],
    files: [
      {pattern: 'tests/**/*.test.js'}
    ],
    frameworks: ['mocha', 'sinon-chai', 'chai-shallow-deep-equal', 'webpack'],
    preprocessors: {'tests/**/*.js': ['webpack', 'env']},
    reporters: ['mocha']
  });
};
