import debug from 'debug'

import Koa from 'koa'
import convert from 'koa-convert'
import webpack from 'webpack'

import { PORT } from '../../core/config'

export default () => {
  const webpackServer = new Koa()
  const compiler = webpack(require('../../webpack.config.babel'))

  const config = {
    port: PORT + 1,
    options: {
      publicPath: `http://localhost:${PORT + 1}/assets/`,
      hot: true,
      stats: {
        assets: true,
        colors: true,
        version: false,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false
      }
    }
  }

  webpackServer.use(convert(require('koa-webpack-dev-middleware')(compiler, config.options)))
  webpackServer.use(convert(require('koa-webpack-hot-middleware')(compiler)))

  webpackServer.listen(config.port, '0.0.0.0', () =>
    debug('dev')('`webpack-dev-server` listening on port %s', config.port))
}
