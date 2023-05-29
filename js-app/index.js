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

    // 初始化 remote 模块，electron.remote 在 electron 14 后已弃用，需单独安装 @electron/remote
    require('@electron/remote/main').initialize()
    // electron >= 14.0.0 必须使用新的启用 API 分别为每个所需的 WebContents 启用远程模块
    require("@electron/remote/main").enable(win.webContents)

    win.loadFile('index.html')

    // win.webContents.openDevTools()

    win.on('closed', function() {
        win = null
    })

    // 主进程通过 ipcMain 接收消息
    const { ipcMain } = require('electron')
    ipcMain.on('msg_render2main', (event, param1, param2) => {
        console.log({sender: event.sender, param1, param2})
        // 向特定渲染进程发送消息
        win.webContents.send('msg_main2render', param1, param2)
        
        // 像消息来源窗口发送回复消息
        event.sender.send('msg_main2render', param1, param2)
        // 回复消息的另一种实现
        event.reply('msg_main2render', param1, param2)
    })
})

app.on('window-all-closed', function() {
    app.quit()
})
