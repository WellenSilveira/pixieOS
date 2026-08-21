import { useState, useEffect } from "react"
import type {} from "@/types/electron"

interface TitleBarProps {
  isOnline: boolean
  onToggleOnline: () => void
}

export default function TitleBar({ isOnline, onToggleOnline }: TitleBarProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const timeStr = time.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  const dateStr = time.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" })

  return (
    <div className="flex items-center h-9 bg-deep border-b border-brand/60 flex-shrink-0 select-none">
      {/* Left: identity */}
      <div className="flex items-center gap-2 px-3 min-w-[200px]">
        <PixieIcon />
        <span className="font-display text-[13px] font-semibold text-white/90 tracking-wide">Pixie OS</span>
        <span className="mono-label text-white/35">v2.1</span>
      </div>

      {/* Center: connectivity + time */}
      <div className="flex-1 flex items-center justify-center gap-5">
        <button
          onClick={onToggleOnline}
          className="flex items-center gap-1.5 cursor-pointer group"
          title="Simular troca de conexão"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              isOnline ? "bg-success shadow-[0_0_6px_#10B981]" : "bg-amber shadow-[0_0_6px_#D97706] animate-blink"
            }`}
          />
          <span className={`mono-label ${isOnline ? "text-success" : "text-amber"}`}>
            {isOnline ? "Online · Sincronizado" : "Offline · Banco Local"}
          </span>
        </button>
        <div className="w-px h-3 bg-white/15" />
        <span className="mono-label text-white/40">{timeStr}</span>
        <span className="mono-label text-white/25">{dateStr}</span>
      </div>

      {/* Right: window controls */}
      <div className="flex items-center ml-auto">
        <WinBtn title="Minimizar" onClick={() => window.pixieOS?.minimize()}>
          <svg width="10" height="1.5" viewBox="0 0 10 1.5" fill="currentColor">
            <rect width="10" height="1.5" rx="0.75" />
          </svg>
        </WinBtn>
        <WinBtn title="Maximizar" onClick={() => window.pixieOS?.maximize()}>
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="0.75" y="0.75" width="7.5" height="7.5" rx="0.5" />
          </svg>
        </WinBtn>
        <WinBtn title="Fechar" danger onClick={() => window.pixieOS?.close()}>
          <svg width="9" height="9" viewBox="0 0 9 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="1" y1="1" x2="8" y2="8" />
            <line x1="8" y1="1" x2="1" y2="8" />
          </svg>
        </WinBtn>
      </div>
    </div>
  )
}

function WinBtn({
  children,
  title,
  danger,
  onClick,
}: {
  children: React.ReactNode
  title: string
  danger?: boolean
  onClick?: () => void
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`w-11 h-9 flex items-center justify-center text-white/40 hover:text-white transition-colors ${
        danger ? "hover:bg-danger" : "hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  )
}

function PixieIcon() {
  return (
    <div className="w-5 h-5 rounded bg-brand flex items-center justify-center flex-shrink-0">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <rect x="1.5" y="1.5" width="3.5" height="3.5" fill="#F0F2F5" opacity="0.9" rx="0.5" />
        <rect x="7" y="1.5" width="3.5" height="3.5" fill="#F0F2F5" opacity="0.5" rx="0.5" />
        <rect x="1.5" y="7" width="3.5" height="3.5" fill="#F0F2F5" opacity="0.5" rx="0.5" />
        <rect x="7" y="7" width="3.5" height="3.5" fill="#10B981" opacity="0.9" rx="0.5" />
      </svg>
    </div>
  )
}
