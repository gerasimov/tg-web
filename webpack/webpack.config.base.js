const { CheckerPlugin } = require("awesome-typescript-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");

const mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

module.exports = {
  mode,

  entry: {
    app: path.resolve(process.cwd(), "app", "index.tsx")
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".less"],
    alias: {
      app: path.resolve(process.cwd(), "app")
    }
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      },
      {
        test: /\.less?$/,
        use: ["style-loader", "css-loader", "less-loader"]
      },
      {
        test: /\.png?$/,
        use: ["file-loader"]
      }
    ]
  },

  plugins: [
    new CheckerPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), "app", "ui", "template.html")
    })
  ]
};
