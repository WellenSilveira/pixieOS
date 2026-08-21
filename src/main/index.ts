import { app, BrowserWindow, ipcMain, shell } from "electron"
import path from "node:path"

// Disable hardware acceleration when there's no GPU (common in CI / VMs)
app.disableHardwareAcceleration()

// Prevent multiple instances
const gotLock = app.requestSingleInstanceLock()
if (!gotLock) {
  app.quit()
}

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 940,
    minHeight: 600,
    // Frameless so our custom TitleBar takes over chrome
    frame: false,
    titleBarStyle: "hidden",
    backgroundColor: "#F0F2F5",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      contextIsolation: true,
      nodeIntegration: false,
      // Offline-first: disable remote content from being loaded unexpectedly
      webSecurity: true,
    },
  })

  // Gracefully show after DOM is ready — avoids white flash
  mainWindow.once("ready-to-show", () => {
    mainWindow?.show()
  })

  // Open external links in the system browser, never inside Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: "deny" }
  })

  if (process.env["ELECTRON_RENDERER_URL"]) {
    // Dev: load from the Vite dev server
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"])
  } else {
    // Prod: load the built renderer bundle
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"))
  }
}

// ── Window control IPC ────────────────────────────────────────────────────────

ipcMain.on("window:minimize", () => {
  mainWindow?.minimize()
})

ipcMain.on("window:maximize", () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize()
  } else {
    mainWindow?.maximize()
  }
})

ipcMain.on("window:close", () => {
  mainWindow?.close()
})

ipcMain.handle("window:isMaximized", () => {
  return mainWindow?.isMaximized() ?? false
})

// ── App lifecycle ─────────────────────────────────────────────────────────────

app.on("second-instance", () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

app.whenReady().then(() => {
  createWindow()

  app.on("activate", () => {
    // macOS: re-create window when dock icon is clicked and no windows are open
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
    mainWindow = null
  }
})
