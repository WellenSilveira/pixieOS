import { useState, useEffect } from "react"

interface CriarChamadoProps {
  onSave: () => void
  onCancel: () => void
}

export default function CriarChamado({ onSave, onCancel }: CriarChamadoProps) {
  const [titulo, setTitulo] = useState("")
  const [categoria, setCategoria] = useState("")
  const [prioridade, setPrioridade] = useState("")
  const [departamento, setDepartamento] = useState("")
  const [descricao, setDescricao] = useState("")
  const [ativo, setAtivo] = useState("")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saving, setSaving] = useState(false)

  // Autosave on change
  useEffect(() => {
    if (!titulo && !descricao) return
    setSaving(true)
    const timer = setTimeout(() => {
      setSaving(false)
      setLastSaved(new Date())
    }, 800)
    return () => clearTimeout(timer)
  }, [titulo, categoria, prioridade, departamento, descricao, ativo])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave()
  }

  const savedLabel = lastSaved
    ? `Rascunho salvo localmente às ${lastSaved.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
    : "Rascunho não salvo"

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-divider bg-panel flex-shrink-0">
        <div>
          <h1 className="font-display text-[15px] font-bold text-deep">Abrir Chamado</h1>
          <p className="mono-label text-mid mt-0.5">Preencha os dados do chamado</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Autosave indicator */}
          <div className="flex items-center gap-1.5">
            {saving ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber animate-blink" />
                <span className="mono-label text-amber">Salvando rascunho...</span>
              </>
            ) : lastSaved ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                <span className="mono-label text-success">{savedLabel}</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-divider" />
                <span className="mono-label text-mid/60">Nenhuma alteração</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-5">
        <form id="chamado-form" onSubmit={handleSubmit}>
          <div className="max-w-2xl flex flex-col gap-5">
            {/* Titulo */}
            <FormField label="Título do Chamado" required>
              <input
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Descreva o problema resumidamente..."
                className="w-full text-[13px] bg-white border border-divider rounded px-3 py-2.5 text-deep placeholder-mid/40 focus:outline-none focus:border-brand transition-colors"
                required
              />
            </FormField>

            {/* Categoria + Prioridade */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Categoria" required>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full text-[12px] font-mono bg-white border border-divider rounded px-3 py-2.5 text-deep focus:outline-none focus:border-brand transition-colors"
                  required
                >
                  <option value="">Selecionar...</option>
                  {["Hardware", "Software", "Rede", "Acesso", "Provisionamento", "Energia", "Outro"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Prioridade" required>
                <select
                  value={prioridade}
                  onChange={(e) => setPrioridade(e.target.value)}
                  className="w-full text-[12px] font-mono bg-white border border-divider rounded px-3 py-2.5 text-deep focus:outline-none focus:border-brand transition-colors"
                  required
                >
                  <option value="">Selecionar...</option>
                  {["Crítica", "Alta", "Média", "Baixa"].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </FormField>
            </div>

            {/* Departamento + Ativo vinculado */}
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Departamento">
                <select
                  value={departamento}
                  onChange={(e) => setDepartamento(e.target.value)}
                  className="w-full text-[12px] font-mono bg-white border border-divider rounded px-3 py-2.5 text-deep focus:outline-none focus:border-brand transition-colors"
                >
                  <option value="">Selecionar...</option>
                  {["TI", "Recursos Humanos", "Financeiro", "Comercial", "Operações", "Jurídico", "Administrativo"].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="Ativo Vinculado (opcional)">
                <input
                  value={ativo}
                  onChange={(e) => setAtivo(e.target.value)}
                  placeholder="Ex: ATI-0891"
                  className="w-full font-mono text-[12px] bg-white border border-divider rounded px-3 py-2.5 text-deep placeholder-mid/40 focus:outline-none focus:border-brand transition-colors"
                />
              </FormField>
            </div>

            {/* Descrição */}
            <FormField label="Descrição Detalhada" required>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o problema com detalhes: quando começou, o que foi tentado, mensagens de erro recebidas..."
                rows={6}
                className="w-full text-[13px] bg-white border border-divider rounded px-3 py-2.5 text-deep placeholder-mid/40 focus:outline-none focus:border-brand transition-colors resize-none leading-relaxed"
                required
              />
            </FormField>

            {/* SLA info box */}
            <div className="flex items-start gap-2.5 p-3 bg-brand/5 border border-brand/15 rounded">
              <svg className="text-brand flex-shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.3" />
                <line x1="7" y1="6" x2="7" y2="10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <circle cx="7" cy="4" r="0.75" fill="currentColor" />
              </svg>
              <div>
                <p className="mono-label text-brand mb-0.5">SLA ativo após abertura do chamado</p>
                <p className="text-[11px] text-mid leading-relaxed">
                  Prioridade Crítica: 2h &nbsp;·&nbsp; Alta: 4h &nbsp;·&nbsp; Média: 8h &nbsp;·&nbsp; Baixa: 24h
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-divider bg-panel flex-shrink-0">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-[12px] font-medium text-mid hover:text-deep border border-divider rounded hover:border-mid transition-colors"
        >
          Cancelar
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-4 py-2 text-[12px] font-medium text-brand border border-brand/30 rounded hover:bg-brand/5 transition-colors"
          >
            Salvar Rascunho
          </button>
          <button
            type="submit"
            form="chamado-form"
            className="px-4 py-2 bg-brand text-white text-[12px] font-semibold rounded hover:bg-brand/90 transition-colors"
          >
            Abrir Chamado
          </button>
        </div>
      </div>
    </div>
  )
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-medium text-mid uppercase tracking-wide flex items-center gap-1">
        {label}
        {required && <span className="text-danger">*</span>}
      </label>
      {children}
    </div>
  )
}
