// Webpack uses this to work with directories
const path = require('path');

// This is the main configuration object.
// Here, you write different options and tell Webpack what to do
module.exports = {

  // Path to your entry point. From this file Webpack will begin its work
  entry: './index.js',

  // Path and filename of your result bundle.
  // Webpack will bundle all JavaScript into this file
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'aframe-physics-system.js'
  },

  resolve: {
    fallback: {
        "fs": false,
        "path": false
    },
  },

  devServer: {
    static: {
      directory: path.join(__dirname, ''),
    },

    onListening: function (devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      const brightYellow = "\x1b[1m\x1b[33m"
      const underscoreCyan = "\x1b[4m\x1b[36m"
      const reset = "\x1b[0m"

      const port = devServer.server.address().port;
      console.log(brightYellow)
      console.log("***********************************************************************");
      console.log(`*   View examples at ${underscoreCyan}http://localhost:${port}/examples${reset}${brightYellow}                   *`);
      console.log("***********************************************************************");
      console.log(reset)
    },
  },

  // Default mode for Webpack is production.
  // Depending on mode Webpack will apply different things
  // on the final bundle. For now, we don't need production's JavaScript 
  // minifying and other things, so let's set mode to development
  mode: 'development'
};