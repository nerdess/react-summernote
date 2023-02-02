const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const path = require('path');

const src = path.join(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');

module.exports = {
  context: __dirname,
  entry: {
    'react-summernote': path.join(src, 'Summernote.jsx')
  },
  output: {
    path: dist,
    filename: '[name].js',
    library: 'ReactSummernote',
    libraryTarget: 'umd'
  },
  externals: [{
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom'
    },
    jquery: {
      root: '$',
      commonjs2: 'jquery',
      commonjs: 'jquery',
      amd: 'jquery'
    }
  }],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)(\?.+)?$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new MiniCssExtractPlugin(),
    /*new CopyWebpackPlugin({
      patterns: [
        { from: 'node_modules/summernote/dist/lang', to: '../lang' },
      ],
    })*/
  ],
  resolve: {
    extensions: ['*', '.js', '.jsx']
  }
};
