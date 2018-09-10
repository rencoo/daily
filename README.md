##知乎日报web版
####第一步
下载文件，在该文件目录下执行npm install 命令自动安装所有的依赖
####第二步
npm run dev启动webpaxk服务
####第三步
知乎日报的接口地址开启了跨域限制，因此我们需要使用代理。执行node proxy.js启动服务器，项目成功运行
##Dependencies
  	
	"dependencies": {
	    "axios": "^0.18.0",
	    "from": "^0.1.7",
	    "moment": "^2.22.2",
	    "vue": "^2.5.2",
	    "vue-router": "^3.0.1"
  	}
 
## Build Setup


	# install dependencies
	npm install
	
	# serve with hot reload at localhost:8080
	npm run dev
	
	# build for production with minification
	npm run build
	
	# build for production and view the bundle analyzer report
	npm run build --report
	
	# run unit tests
	npm run unit
	
	# run e2e tests
	npm run e2e
	
	# run all tests
	npm test

## 代理proxy.js

	const http = require('http')
	const request = require('request')
	
	const hostname = '127.0.0.1'
	const port = 8010
	const imgPort = 8011
	
	// 创建一个 API 代理服务
	const apiServer = http.createServer((req, res) => {
	  const url = 'http://news-at.zhihu.com/api/4' + req.url
	  const options = {
	    url: url
	  }
	  function callback (error, response, body) {
	    if (!error && response.statusCode === 200) {
	      // 设置编码类型，否则中文会显示为乱码
	      res.setHeader('Content-Type', 'text/plain;charset=UTF-8')
	      // 设置所有域允许跨域
	      res.setHeader('Access-Control-Allow-Origin', '*')
	      // 返回代理后的内容
	      res.end(body)
	    }
	  }
	  request.get(options, callback)
	})

	// 监听 8010 端口
	apiServer.listen(port, hostname, () => {
	  console.log(`接口代理运行在 http://${hostname}:${port}/`)
	})

	// 创建一个图片代理服务
	const imgServer = http.createServer((req, res) => {
	  const url = req.url.split('/img/')[1]
	  const options = {
	    url: url,
	    encoding: null
	  }
	  function callback (error, response, body) {
	    if (!error && response.statusCode === 200) {
	      const contentType = response.headers['content-type']
	      res.setHeader('Content-Type', contentType)
	      res.setHeader('Access-Control-Allow-Origin', '*')
	      res.end(body)
	    }
	  }
	  request.get(options, callback)
	})

	// 监听 8011 端口
	imgServer.listen(imgPort, hostname, () => {
	  console.log(`图片代理运行在 http://${hostname}:${imgPort}/`)
	})

