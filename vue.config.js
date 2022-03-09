const port = process.env.port || process.env.npm_config_port || 9527 // dev port

module.exports = {
	productionSourceMap: false,
	publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
	lintOnSave: false,
	devServer: {
		open: true, // 自动打开浏览器
		host: '0.0.0.0', // 真机模拟，使用
		port: port, // 前台代理端口号
		https: false, // https： {type: Booleam}
		hotOnly: false, // 热更新
		proxy: {
			[process.env.VUE_APP_BASE_API]: {
				target: 'http://merchant-server-test.c29dd69ffd4404f389adfa283b540267b.cn-hangzhou.alicontainer.com',
				changeOrigin: true,
				pathRewrite: {
					['^' + process.env.VUE_APP_BASE_API]: ''
				}
			}
		}
	},
	chainWebpack(config) {
		// 移除打包后 index.html 所有打包好的文件都预加载行为
		config.plugins.delete('preload');
		config.plugins.delete('prefetch');
	},
	configureWebpack: {
		output: {
			filename: `js/[name].${new Date().getTime()}.js`,
			chunkFilename: `js/[name].${new Date().getTime()}.js`,
		},
	},
	css: {
		extract: {
			filename: `css/[name].${new Date().getTime()}.css`,
			chunkFilename: `css/[name].${new Date().getTime()}.css`,
		},
	},
};
