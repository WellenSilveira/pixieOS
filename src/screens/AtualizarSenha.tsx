import { useState } from "react"

interface AtualizarSenhaProps {
  onComplete: () => void
}

function calcStrength(pass: string) {
  let score = 0
  if (pass.length >= 8) score++
  if (pass.length >= 12) score++
  if (/[A-Z]/.test(pass)) score++
  if (/[0-9]/.test(pass)) score++
  if (/[^A-Za-z0-9]/.test(pass)) score++
  return score
}

const STRENGTH_LABELS = ["", "Muito Fraca", "Fraca", "Razoável", "Forte", "Muito Forte"]
const STRENGTH_COLORS = ["", "bg-danger", "bg-amber", "bg-amber", "bg-success", "bg-success"]
const STRENGTH_TEXT = ["", "text-danger", "text-amber", "text-amber", "text-success", "text-success"]

export default function AtualizarSenha({ onComplete }: AtualizarSenhaProps) {
  const [newPass, setNewPass] = useState("")
  const [confirmPass, setConfirmPass] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const strength = calcStrength(newPass)

  const requirements = [
    { label: "Mínimo 8 caracteres", ok: newPass.length >= 8 },
    { label: "Letra maiúscula", ok: /[A-Z]/.test(newPass) },
    { label: "Número", ok: /[0-9]/.test(newPass) },
    { label: "Caractere especial", ok: /[^A-Za-z0-9]/.test(newPass) },
  ]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (newPass !== confirmPass) {
      setError("As senhas não coincidem.")
      return
    }
    if (strength < 3) {
      setError("Escolha uma senha mais forte.")
      return
    }
    setError("")
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onComplete()
    }, 900)
  }

  return (
    <div className="flex h-full bg-base items-center justify-center">
      <div className="w-full max-w-[400px] mx-8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 rounded bg-brand flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1.5" y="1.5" width="4.5" height="4.5" fill="#F0F2F5" opacity="0.9" rx="0.5" />
              <rect x="8" y="1.5" width="4.5" height="4.5" fill="#F0F2F5" opacity="0.45" rx="0.5" />
              <rect x="1.5" y="8" width="4.5" height="4.5" fill="#F0F2F5" opacity="0.45" rx="0.5" />
              <rect x="8" y="8" width="4.5" height="4.5" fill="#10B981" opacity="0.95" rx="0.5" />
            </svg>
          </div>
          <span className="font-display text-sm font-bold text-deep">Pixie OS v2.1</span>
        </div>

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded-full bg-amber/15 flex items-center justify-center flex-shrink-0">
              <span className="mono-label text-amber" style={{ fontSize: "9px" }}>!</span>
            </span>
            <span className="mono-label text-amber">Primeiro Acesso — Senha Temporária Detectada</span>
          </div>
          <h1 className="font-display text-xl font-bold text-deep mt-2">Criar Nova Senha</h1>
          <p className="text-[12.5px] text-mid mt-1 leading-relaxed">
            Sua senha temporária precisa ser substituída antes de acessar o sistema. A nova senha será armazenada localmente com criptografia.
          </p>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2.5 bg-danger/10 border border-danger/30 rounded text-[12px] text-danger">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-mid uppercase tracking-wide">Nova Senha</label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPass}
                onChange={(e) => { setNewPass(e.target.value); setError("") }}
                placeholder="Digite a nova senha"
                autoFocus
                className="w-full text-[13px] bg-white border border-divider rounded px-3 py-2.5 pr-10 text-deep placeholder-mid/40 focus:outline-none focus:border-brand transition-colors"
              />
              <button type="button" onClick={() => setShowNew((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-mid hover:text-brand">
                <EyeIcon open={showNew} />
              </button>
            </div>

            {/* Strength bar */}
            {newPass.length > 0 && (
              <div className="flex flex-col gap-1 mt-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
                        i <= strength ? STRENGTH_COLORS[strength] : "bg-divider"
                      }`}
                    />
                  ))}
                </div>
                <p className={`mono-label ${STRENGTH_TEXT[strength] || "text-mid"}`}>
                  Força: {STRENGTH_LABELS[strength] || "—"}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-medium text-mid uppercase tracking-wide">Confirmar Nova Senha</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPass}
                onChange={(e) => { setConfirmPass(e.target.value); setError("") }}
                placeholder="Repita a nova senha"
                className={`w-full text-[13px] bg-white border rounded px-3 py-2.5 pr-10 text-deep placeholder-mid/40 focus:outline-none transition-colors ${
                  confirmPass && confirmPass !== newPass ? "border-danger focus:border-danger" : "border-divider focus:border-brand"
                }`}
              />
              <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-mid hover:text-brand">
                <EyeIcon open={showConfirm} />
              </button>
            </div>
          </div>

          {/* Requirements */}
          <div className="flex flex-col gap-1.5 p-3 bg-panel rounded border border-divider">
            <p className="mono-label text-mid mb-1">Requisitos de segurança</p>
            {requirements.map((r) => (
              <div key={r.label} className="flex items-center gap-2">
                <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${r.ok ? "bg-success/15" : "bg-divider"}`}>
                  {r.ok && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <polyline points="1,4 3,6 7,2" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className={`text-[11.5px] transition-colors ${r.ok ? "text-success" : "text-mid"}`}>{r.label}</span>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || !newPass || !confirmPass}
            className="mt-1 w-full py-2.5 bg-brand hover:bg-brand/90 text-white text-[13px] font-semibold rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              "Definir Nova Senha e Entrar"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <ellipse cx="7" cy="7" rx="6" ry="4" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <ellipse cx="7" cy="7" rx="6" ry="4" stroke="currentColor" strokeWidth="1.2" />
      <line x1="2" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
