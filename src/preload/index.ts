import { contextBridge, ipcRenderer } from "electron"

// Expose a minimal, typed API surface to the renderer.
// The renderer never touches Node or Electron APIs directly — everything
// goes through this bridge so contextIsolation stays effective.
contextBridge.exposeInMainWorld("pixieOS", {
  // Window chrome
  minimize: () => ipcRenderer.send("window:minimize"),
  maximize: () => ipcRenderer.send("window:maximize"),
  close: () => ipcRenderer.send("window:close"),
  isMaximized: () => ipcRenderer.invoke("window:isMaximized") as Promise<boolean>,

  // App metadata
  version: process.env["npm_package_version"] ?? "2.1.0",
  platform: process.platform,
})
