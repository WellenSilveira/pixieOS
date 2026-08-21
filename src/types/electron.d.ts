// Type declarations for the preload bridge exposed on window.pixieOS
export {}

declare global {
  interface Window {
    pixieOS?: {
      minimize: () => void
      maximize: () => void
      close: () => void
      isMaximized: () => Promise<boolean>
      version: string
      platform: NodeJS.Platform
    }
  }
}
