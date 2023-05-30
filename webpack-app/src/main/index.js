const electron = require('electron')
console.log('electron', electron)
const app = electron.app
const { BrowserWindow } = electron

let win = null

app.on('ready', function() {
    // 创建渲染窗口
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            //  Electron 12 以来，默认启用上下文隔离 contextIsolation ，将预加载脚本与 Electron 内部环境隔离确保安全性（不能使用 require 等 node 方法）
            contextIsolation: false, 
        }
    })

    // 通过 process.env.NODE_ENV 来判断当前代码是在生产环境中运行还是在开发环境中运行。
    // 如果是在生产环境，则通过 File 协议加载本地 HTML 文件；如果是在开发环境，则通过 HTTP 协议加载本地 localhost 的 Web 服务.
    let path = require('path');
    let URL = require('url');
    let url = '';
    if (process.env.NODE_ENV !== 'production') {
        url = 'http://localhost:' + process.env.ELECTRON_WEBPACK_WDS_PORT;
    } else {
        url = URL.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file'
        });
    }
    win.loadURL(url);
})

app.on('window-all-closed', function() {
    app.quit()
})
