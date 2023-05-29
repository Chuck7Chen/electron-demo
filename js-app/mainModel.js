const { BrowserWindow } = require('electron')
exports.makeWindow = function() {
    const newWindow = new BrowserWindow({
        webPreferences: true,
        contextIsolation: false,
    })
    return newWindow
}