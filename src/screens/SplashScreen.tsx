import { useEffect, useState } from "react"

const STEPS = [
  "Inicializando motor de banco de dados local...",
  "Verificando integridade dos registros...",
  "Carregando índices de chamados...",
  "Validando cache de usuários e permissões...",
  "Sincronizando metadados de inventário...",
  "Pronto.",
]

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const totalDuration = 2800
    const stepDuration = totalDuration / STEPS.length

    const stepTimer = setInterval(() => {
      setStep((s) => {
        const next = s + 1
        if (next >= STEPS.length) {
          clearInterval(stepTimer)
          return s
        }
        return next
      })
    }, stepDuration)

    const progressTimer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressTimer)
          setTimeout(onComplete, 400)
          return 100
        }
        return Math.min(100, p + 100 / (totalDuration / 40))
      })
    }, 40)

    return () => {
      clearInterval(stepTimer)
      clearInterval(progressTimer)
    }
  }, [onComplete])

  return (
    <div className="flex flex-col items-center justify-center h-full bg-deep">
      {/* Logo */}
      <div className="flex flex-col items-center gap-4 mb-12 animate-fade-in">
        <div className="w-16 h-16 rounded-xl bg-brand flex items-center justify-center shadow-lg">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <rect x="4" y="4" width="12" height="12" fill="#F0F2F5" opacity="0.9" rx="2" />
            <rect x="20" y="4" width="12" height="12" fill="#F0F2F5" opacity="0.45" rx="2" />
            <rect x="4" y="20" width="12" height="12" fill="#F0F2F5" opacity="0.45" rx="2" />
            <rect x="20" y="20" width="12" height="12" fill="#10B981" opacity="0.95" rx="2" />
          </svg>
        </div>
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold text-white tracking-tight">Pixie OS</h1>
          <p className="mono-label text-white/35 mt-1">Plataforma de Gestão de TI — v2.1</p>
        </div>
      </div>

      {/* Progress */}
      <div className="w-72 flex flex-col gap-3">
        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="min-h-[16px]">
          <p className="mono-label text-white/40 truncate text-center">{STEPS[step]}</p>
        </div>
      </div>

      {/* Offline badge */}
      <div className="absolute bottom-6 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_6px_#10B981]" />
        <span className="mono-label text-white/30">Operação 100% offline</span>
      </div>
    </div>
  )
}
