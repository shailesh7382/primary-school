const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

const isDevelopment = process.env.NODE_ENV !== 'production';

// Get remote URLs from environment variables or use defaults
const mathsScienceUrl = process.env.MATHS_SCIENCE_URL || 'http://localhost:3001/remoteEntry.js';
const examUrl = process.env.EXAM_URL || 'http://localhost:3002/remoteEntry.js';
const studentRecordsUrl = process.env.STUDENT_RECORDS_URL || 'http://localhost:3003/remoteEntry.js';

module.exports = {
  entry: './src/index.js',
  mode: isDevelopment ? 'development' : 'production',
  devServer: {
    port: 3000,
    historyApiFallback: true,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: isDevelopment ? 'auto' : 'auto',
    clean: true,
    filename: isDevelopment ? '[name].js' : '[name].[contenthash:8].js',
    chunkFilename: isDevelopment ? '[name].js' : '[name].[contenthash:8].js',
  },
  optimization: isDevelopment ? {} : {
    minimize: true,
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'container',
      remotes: {
        mathsScience: `mathsScience@${mathsScienceUrl}`,
        exam: `exam@${examUrl}`,
        studentRecords: `studentRecords@${studentRecordsUrl}`,
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.2.4', strictVersion: false },
        'react-dom': { singleton: true, requiredVersion: '^19.2.4', strictVersion: false },
        'react-router-dom': { singleton: true, requiredVersion: '^6.20.0', strictVersion: false },
      }
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
