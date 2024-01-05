import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { ProvidePlugin } from 'webpack'
import webpack from 'webpack'
import 'webpack-dev-server'

const config: webpack.Configuration = {
  context: path.resolve(__dirname, './src'),
  entry: './index.ts',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@assets': path.resolve(__dirname, 'src/assets')
    },
    roots: [path.resolve(__dirname, 'src/assets')]
  },
  plugins: [
    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
      publicPath: './'
    })
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {}
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|webp|gif)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.([cm]?ts|tsx)$/,
        loader: 'ts-loader'
      }
    ]
  }
}

export default config
