import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { ProvidePlugin } from 'webpack'
import webpack from 'webpack'
import 'webpack-dev-server'

const config: webpack.Configuration = {
  entry: './src/index.ts',
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@assets': path.resolve(__dirname, './public/assets')
    }
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  plugins: [
    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body'
    })
  ],
  module: {
    rules: [
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset'
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
