const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].[chunkhash:8].js',
    publicPath: '/',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react'],
          },
        },
      },
    ],
  },
  plugins: [
    // new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'My lovely title',
    }),
  ],
};

//
//
// import webpack from 'webpack';
// import yargs from 'yargs';
//
// const { optimizeMinimize } = yargs.alias('p', 'optimize-minimize').argv;
// const nodeEnv = optimizeMinimize ? 'production' : 'development';
//
// export default {
//     entry: {
//         ReactRouterBootstrap: './src/index.js',
//     },
//
//     output: {
//         path: './lib',
//         filename: optimizeMinimize ? '[name].min.js' : '[name].js',
//         library: 'ReactRouterBootstrap',
//         libraryTarget: 'umd',
//     },
//
//     module: {
//         loaders: [
//             { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
//         ],
//     },
//
//     externals: [
//         {
//             react: {
//                 root: 'React',
//                 commonjs2: 'react',
//                 commonjs: 'react',
//                 amd: 'react',
//             },
//         },
//         {
//             'react-router-dom': {
//                 root: 'ReactRouterDOM',
//                 commonjs2: 'react-router-dom',
//                 commonjs: 'react-router-dom',
//                 amd: 'react-router-dom',
//             },
//         },
//     ],
//
//     plugins: [
//         new webpack.DefinePlugin({
//             'process.env': { NODE_ENV: JSON.stringify(nodeEnv) },
//         }),
//     ],
//
//     devtool: optimizeMinimize ? 'source-map' : null,
// };
