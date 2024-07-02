const { defineConfig } = require('@vue/cli-service');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

console.log('Configuring CopyWebpackPlugin...');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: path.resolve(__dirname, 'src/assets/logo.png'), to: 'logo.png' }
        ]
      })
    ]
  }
});

console.log('CopyWebpackPlugin configured.');
