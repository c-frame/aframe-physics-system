var path = require('path');
var merge = require('webpack-merge').merge;
var commonConfiguration = require('./webpack.config.js');

module.exports = merge(commonConfiguration, {
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'aframe-physics-system.min.js'
  },
  mode: 'production'
});