const { CheckerPlugin } = require('awesome-typescript-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const path = require('path');

const mode =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = {
  mode,

  target: 'web',

  entry: {
    app: path.resolve(process.cwd(), 'app', 'index.tsx'),
  },

  output: {
    filename: '[name].[contenthash:12].js',
    path: path.resolve(process.cwd(), 'dist'),
    publicPath: '/',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.less'],
    alias: {
      app: path.resolve(process.cwd(), 'app'),
    },
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.less?$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'less-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.worker\.js?$/,
        use: ['worker-loader'],
      },
    ],
  },

  plugins: [
    new CheckerPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), 'app', 'template.html'),
      favicon: 'app/favicon.ico',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:12].css'
    }),
    // new BundleAnalyzerPlugin(),
    // new CompressionPlugin({
    //   algorithm: 'gzip',
    // })
  ],

  optimization: {
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        },
      }),
      new OptimizeCssAssetsWebpackPlugin({})
    ],
  },
  node: {
    Buffer: false
  },
  devServer: {
    historyApiFallback: true,
    hot: false,
    inline: false,
    open: true,
    compress: true
  },
};
