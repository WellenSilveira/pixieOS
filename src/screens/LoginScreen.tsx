import { useState } from "react"
import { mockUsers, type UserProfile } from "@/data/mockData"

export interface LoginResult {
  firstAccess: boolean
  profile: UserProfile
  nome: string
}

interface LoginScreenProps {
  onLogin: (result: LoginResult) => void
}

// Demo CPF → profile mapping for the preview
const DEMO_PROFILES: Record<string, { profile: UserProfile; nome: string; hint: string }> = {
  "12345678900": { profile: "Usuário Comum",  nome: "Carlos Eduardo Lima",  hint: "Usuário Comum — vê apenas os próprios chamados" },
  "23456789011": { profile: "Resolutor",      nome: "Ana Paula Ferreira",   hint: "Resolutor — responde e altera status" },
  "34567890122": { profile: "Supervisor",     nome: "Roberto Mendes",       hint: "Supervisor — histórico completo, relatórios" },
  "45678901233": { profile: "Administrador",  nome: "Juliana Costa",        hint: "Administrador — acesso total" },
  "00000000000": { profile: "Usuário Comum",  nome: "Novo Colaborador",     hint: "Primeiro acesso — troca de senha obrigatória" },
}

function formatCPF(value: string) {
  const d = value.replace(/\D/g, "").slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [cpf, setCpf] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [focusedHint, setFocusedHint] = useState<string | null>(null)

  const digits = cpf.replace(/\D/g, "")
  const matched = DEMO_PROFILES[digits]

  function handleCPF(e: React.ChangeEvent<HTMLInputElement>) {
    setCpf(formatCPF(e.target.value))
    setError("")
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (digits.length !== 11) {
      setError("Informe um CPF válido com 11 dígitos.")
      return
    }
    if (password.length < 4) {
      setError("Senha muito curta.")
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      const demo = DEMO_PROFILES[digits]
      const firstAccess = digits === "00000000000"
      onLogin({
        firstAccess,
        profile: demo?.profile ?? "Usuário Comum",
        nome: demo?.nome ?? "Usuário",
      })
    }, 850)
  }

  return (
    <div className="flex h-full bg-base">
      {/* Left — branding */}
      <div className="hidden md:flex w-[320px] flex-col justify-between p-8 bg-deep flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <PixieLogo size={26} />
          <span className="font-display text-sm font-bold text-white/90 tracking-wide">Pixie OS v2.1</span>
        </div>

        <div>
          <h2 className="font-display text-[22px] font-bold text-white leading-tight mb-3">
            Central de Controle Corporativa
          </h2>
          <p className="text-[12.5px] text-white/45 leading-relaxed mb-8">
            Gestão de chamados de TI, inventário e usuários. Todos os dados armazenados localmente com segurança total.
          </p>

          <div className="flex flex-col gap-2.5">
            <Feature text="100% offline — funciona sem internet" />
            <Feature text="Banco de dados local embarcado" />
            <Feature text="Backup automático em disco" />
            <Feature text="Controle de acesso por perfil" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {/* Demo CPF quick-fill cards */}
          <p className="mono-label text-white/25">Perfis de demonstração:</p>
          {Object.entries(DEMO_PROFILES).filter(([k]) => k !== "00000000000").map(([raw, info]) => {
            const formatted = `${raw.slice(0,3)}.${raw.slice(3,6)}.${raw.slice(6,9)}-${raw.slice(9)}`
            return (
              <button
                key={raw}
                onClick={() => { setCpf(formatted); setPassword("demo1234"); setError("") }}
                onMouseEnter={() => setFocusedHint(raw)}
                onMouseLeave={() => setFocusedHint(null)}
                className={`w-full text-left px-3 py-2 rounded border transition-colors ${
                  digits === raw
                    ? "bg-brand/20 border-brand/40 text-white"
                    : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20 hover:text-white/80"
                }`}
              >
                <p className="mono-label">{formatted}</p>
                <p className="text-[11px] text-white/40 mt-0.5 truncate">{info.nome} — {info.profile}</p>
              </button>
            )
          })}
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_5px_#10B981]" />
            <span className="mono-label text-white/25">Banco local íntegro · 1.248 reg.</span>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div className="w-full max-w-[340px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 md:hidden">
            <PixieLogo size={22} />
            <span className="font-display text-sm font-bold text-deep">Pixie OS v2.1</span>
          </div>

          <h1 className="font-display text-xl font-bold text-deep mb-1">Entrar no sistema</h1>
          <p className="text-[12.5px] text-mid mb-6 leading-relaxed">
            Autenticação local — sem necessidade de internet.
          </p>

          {/* Profile hint (when a demo CPF is typed) */}
          {matched && !error && (
            <div className={`mb-4 flex items-center gap-2.5 px-3 py-2.5 rounded border transition-all ${
              matched.profile === "Usuário Comum"
                ? "bg-brand/5 border-brand/20"
                : "bg-success/5 border-success/20"
            }`}>
              <ProfileIcon profile={matched.profile} />
              <div>
                <p className="text-[12px] font-semibold text-deep">{matched.nome}</p>
                <p className="mono-label text-mid">{matched.hint}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 px-3 py-2.5 bg-danger/10 border border-danger/30 rounded text-[12px] text-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* CPF */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-mid uppercase tracking-wide">CPF</label>
              <input
                type="text"
                value={cpf}
                onChange={handleCPF}
                placeholder="000.000.000-00"
                autoFocus
                className="w-full font-mono text-[13px] bg-white border border-divider rounded px-3 py-2.5 text-deep placeholder-mid/40 focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            {/* Senha */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-mid uppercase tracking-wide">Senha</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError("") }}
                  placeholder="••••••••"
                  className="w-full text-[13px] bg-white border border-divider rounded px-3 py-2.5 pr-10 text-deep placeholder-mid/40 focus:outline-none focus:border-brand transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-mid hover:text-brand transition-colors"
                >
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-2.5 bg-brand hover:bg-brand/90 text-white text-[13px] font-semibold rounded transition-all disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verificando credenciais...</span>
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-divider text-center">
            <p className="mono-label text-mid/60 leading-relaxed">
              Pixie OS v2.1 — Funciona sem internet
            </p>
            <p className="mono-label text-mid/35 mt-0.5">
              Use CPF 000.000.000-00 para simular primeiro acesso
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ── */

function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-[12px] text-white/45">
      <span className="text-success text-[10px]">✦</span>
      <span>{text}</span>
    </div>
  )
}

function ProfileIcon({ profile }: { profile: UserProfile }) {
  const colorMap: Record<UserProfile, string> = {
    "Usuário Comum": "bg-brand/10 text-brand",
    "Resolutor": "bg-success/10 text-success",
    "Supervisor": "bg-mid/10 text-mid",
    "Administrador": "bg-amber/10 text-amber",
  }
  const initials: Record<UserProfile, string> = {
    "Usuário Comum": "UC",
    "Resolutor": "RE",
    "Supervisor": "SU",
    "Administrador": "AD",
  }
  return (
    <div className={`w-7 h-7 rounded flex items-center justify-center flex-shrink-0 ${colorMap[profile]}`}>
      <span className="mono-label font-bold" style={{ fontSize: "9px" }}>{initials[profile]}</span>
    </div>
  )
}

function PixieLogo({ size }: { size: number }) {
  const s = size
  return (
    <div
      className="rounded bg-brand flex items-center justify-center flex-shrink-0"
      style={{ width: s, height: s }}
    >
      <svg width={s * 0.6} height={s * 0.6} viewBox="0 0 16 16" fill="none">
        <rect x="2" y="2" width="5" height="5" fill="#F0F2F5" opacity="0.9" rx="0.5" />
        <rect x="9" y="2" width="5" height="5" fill="#F0F2F5" opacity="0.45" rx="0.5" />
        <rect x="2" y="9" width="5" height="5" fill="#F0F2F5" opacity="0.45" rx="0.5" />
        <rect x="9" y="9" width="5" height="5" fill="#10B981" opacity="0.95" rx="0.5" />
      </svg>
    </div>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <ellipse cx="7" cy="7" rx="6" ry="4" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <ellipse cx="7" cy="7" rx="6" ry="4" stroke="currentColor" strokeWidth="1.2" />
      <line x1="2" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
