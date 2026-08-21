import { useState } from "react"
import { mockTickets } from "@/data/mockData"
import { StatusBadge, PriorityBadge } from "./Dashboard"

interface DetalhesChamadoProps {
  ticketId: string
  onBack: () => void
}

export default function DetalhesChamado({ ticketId, onBack }: DetalhesChamadoProps) {
  const ticket = mockTickets.find((t) => t.id === ticketId) ?? mockTickets[0]
  const [reply, setReply] = useState("")
  const [isInternal, setIsInternal] = useState(false)
  const [sending, setSending] = useState(false)

  function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!reply.trim()) return
    setSending(true)
    setTimeout(() => {
      setSending(false)
      setReply("")
    }, 700)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start gap-3 px-5 py-3 border-b border-divider bg-panel flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-mid hover:text-brand transition-colors mt-0.5 flex-shrink-0"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="mono-label">Voltar</span>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="mono-label text-brand">{ticket.id}</span>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.prioridade} />
            <span
              className={`mono-label ${
                ticket.slaStatus === "breach" ? "text-danger" : ticket.slaStatus === "warning" ? "text-amber" : "text-mid"
              }`}
            >
              SLA: {ticket.slaLabel}
            </span>
          </div>
          <h1 className="font-display text-[15px] font-bold text-deep mt-1 leading-tight">{ticket.titulo}</h1>
          <div className="flex items-center gap-3 mt-1">
            <MetaTag label="Solicitante" value={ticket.solicitante} />
            <MetaTag label="Depto." value={ticket.departamento} />
            <MetaTag label="Categoria" value={ticket.categoria} />
            <MetaTag label="Responsável" value={ticket.responsavel ?? "Não atribuído"} />
            <MetaTag label="Aberto em" value={ticket.criado} mono />
          </div>
        </div>

        {/* Status change */}
        <select className="text-[11px] font-mono bg-white border border-divider rounded px-2 py-1.5 text-deep focus:outline-none focus:border-brand transition-colors flex-shrink-0">
          {["Aberto", "Em Andamento", "Aguardando", "Resolvido", "Fechado"].map((s) => (
            <option key={s} selected={s === ticket.status}>{s}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="px-5 py-3 border-b border-divider bg-base/50 flex-shrink-0">
        <p className="mono-label text-mid mb-1">Descrição do chamado</p>
        <p className="text-[13px] text-deep leading-relaxed">{ticket.descricao}</p>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
        {ticket.interacoes.length === 0 ? (
          <p className="text-[12px] text-mid/60 text-center py-8">Nenhuma interação ainda.</p>
        ) : (
          ticket.interacoes.map((int) => (
            <div
              key={int.id}
              className={`flex gap-3 animate-fade-in ${
                int.tipo === "nota-interna" ? "bg-amber/5 border border-amber/15 rounded px-3 py-3" : ""
              }`}
            >
              {/* Avatar */}
              <div className="w-7 h-7 rounded bg-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px] font-display font-bold text-white">{int.initials}</span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] font-semibold text-deep">{int.autor}</span>
                  <span className="mono-label text-mid">{int.cargo}</span>
                  {int.tipo === "nota-interna" && (
                    <span className="mono-label text-amber border border-amber/30 px-1 py-0.5 rounded">
                      Nota Interna
                    </span>
                  )}
                  {int.tipo === "status-change" && (
                    <span className="mono-label text-brand border border-brand/20 px-1 py-0.5 rounded">
                      Alteração de Status
                    </span>
                  )}
                  <span className="mono-label text-mid/60 ml-auto">{int.timestamp}</span>
                </div>
                <p className="text-[12.5px] text-deep/90 leading-relaxed">{int.mensagem}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply area */}
      <div className="border-t border-divider px-5 py-3 bg-panel flex-shrink-0">
        <form onSubmit={handleSend}>
          <div className="flex items-center gap-2 mb-2">
            <span className="mono-label text-mid">Responder como</span>
            <button
              type="button"
              onClick={() => setIsInternal(false)}
              className={`mono-label px-2 py-0.5 rounded border transition-colors ${
                !isInternal ? "bg-brand text-white border-brand" : "text-mid border-divider hover:border-mid"
              }`}
            >
              Resposta Pública
            </button>
            <button
              type="button"
              onClick={() => setIsInternal(true)}
              className={`mono-label px-2 py-0.5 rounded border transition-colors ${
                isInternal ? "bg-amber/10 text-amber border-amber/30" : "text-mid border-divider hover:border-mid"
              }`}
            >
              Nota Interna
            </button>
          </div>
          <div className="flex gap-2">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder={isInternal ? "Nota interna — visível apenas para a equipe de TI..." : "Escreva uma resposta para o solicitante..."}
              rows={3}
              className={`flex-1 text-[12.5px] bg-white border rounded px-3 py-2 text-deep placeholder-mid/40 focus:outline-none transition-colors resize-none leading-relaxed ${
                isInternal ? "border-amber/30 focus:border-amber" : "border-divider focus:border-brand"
              }`}
            />
            <button
              type="submit"
              disabled={!reply.trim() || sending}
              className="self-end px-4 py-2 bg-brand text-white text-[12px] font-semibold rounded hover:bg-brand/90 disabled:opacity-50 transition-colors flex items-center gap-1.5"
            >
              {sending ? (
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              <span>Enviar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function MetaTag({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span className="mono-label text-mid/70">{label}:</span>
      <span className={mono ? "mono-label text-mid" : "text-[12px] text-deep"}>{value}</span>
    </div>
  )
}
