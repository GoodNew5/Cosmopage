import { merge } from 'webpack-merge'
import webpack from 'webpack'
import path from 'path'
import common from './webpack.common'

const config = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    hot: false,
    host: 'localhost',
    compress: true,
    static: {
      directory: path.join(__dirname, 'public')
    }
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
})

export default config
