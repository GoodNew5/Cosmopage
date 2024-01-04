import { merge } from 'webpack-merge'
import path from 'path'
import common from './webpack.common'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import process from 'process'
import glob from 'glob'
import 'webpack-dev-server'
import { PurgeCSSPlugin } from 'purgecss-webpack-plugin'

const PATHS = {
  src: path.join(__dirname, 'src')
}

const config = merge(common, {
  mode: 'production',
  devtool: false,
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public')
  },
  optimization: {
    nodeEnv: process.env.NODE_ENV,
    minimize: true,
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),

    // @ts-ignore: Unreachable code error
    new PurgeCSSPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true })
    })
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  }
})

export default config
