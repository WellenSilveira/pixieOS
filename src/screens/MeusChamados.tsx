import { useState } from "react"
import { mockTickets } from "@/data/mockData"
import { StatusBadge, PriorityBadge } from "./Dashboard"

interface MeusChamadosProps {
  userName: string
  onOpenTicket: (id: string) => void
  onAbrirChamado: () => void
}

// Common users only see their own tickets
const MEU_NOME = "Carlos Eduardo Lima"

export default function MeusChamados({ userName, onOpenTicket, onAbrirChamado }: MeusChamadosProps) {
  const [tab, setTab] = useState<"ativos" | "resolvidos">("ativos")

  const meusChamados = mockTickets.filter((t) => t.solicitante === MEU_NOME)
  const ativos = meusChamados.filter((t) => t.status !== "Resolvido" && t.status !== "Fechado")
  const resolvidos = meusChamados.filter((t) => t.status === "Resolvido" || t.status === "Fechado")
  const lista = tab === "ativos" ? ativos : resolvidos

  const temCritico = ativos.some((t) => t.slaStatus === "breach" || t.prioridade === "Crítica")

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-5 pb-4 flex-shrink-0">
        <div>
          <p className="mono-label text-mid mb-0.5">Bem-vindo de volta</p>
          <h1 className="font-display text-xl font-bold text-deep leading-tight">
            {userName.split(" ")[0]} {userName.split(" ")[1]}
          </h1>
          <p className="mono-label text-mid mt-1">
            Seg, 12 Ago 2026 &nbsp;·&nbsp; Banco local &nbsp;·&nbsp; 1.248 registros
          </p>
        </div>

        <button
          onClick={onAbrirChamado}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand text-white text-[13px] font-semibold rounded hover:bg-brand/90 active:scale-[0.98] transition-all"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="6.5" cy="6.5" r="5.75" stroke="currentColor" strokeWidth="1.4" />
            <line x1="6.5" y1="3.5" x2="6.5" y2="9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="3.5" y1="6.5" x2="9.5" y2="6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Abrir Chamado
        </button>
      </div>

      {/* SLA alert banner */}
      {temCritico && (
        <div className="mx-6 mb-3 flex items-center gap-2.5 px-3.5 py-2.5 bg-amber/10 border border-amber/30 rounded flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-amber animate-blink flex-shrink-0" />
          <p className="text-[12px] text-amber font-medium">
            Você tem chamados com SLA em risco ou prioridade crítica. Aguarde contato da equipe de TI.
          </p>
        </div>
      )}

      {/* Summary strip */}
      <div className="mx-6 mb-4 grid grid-cols-3 gap-2 flex-shrink-0">
        <SummaryCard
          label="Em aberto"
          value={ativos.filter((t) => t.status === "Aberto").length}
          color="text-brand"
        />
        <SummaryCard
          label="Em andamento"
          value={ativos.filter((t) => t.status === "Em Andamento" || t.status === "Aguardando").length}
          color="text-amber"
        />
        <SummaryCard
          label="Resolvidos"
          value={resolvidos.length}
          color="text-success"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0 px-6 border-b border-divider flex-shrink-0">
        <Tab active={tab === "ativos"} onClick={() => setTab("ativos")}>
          Chamados Ativos
          {ativos.length > 0 && (
            <span className={`ml-1.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded leading-none ${
              tab === "ativos" ? "bg-brand text-white" : "bg-divider text-mid"
            }`}>
              {ativos.length}
            </span>
          )}
        </Tab>
        <Tab active={tab === "resolvidos"} onClick={() => setTab("resolvidos")}>
          Resolvidos / Fechados
          {resolvidos.length > 0 && (
            <span className={`ml-1.5 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded leading-none ${
              tab === "resolvidos" ? "bg-brand text-white" : "bg-divider text-mid"
            }`}>
              {resolvidos.length}
            </span>
          )}
        </Tab>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
        {lista.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-16 gap-3">
            <div className="w-10 h-10 rounded-lg bg-panel border border-divider flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="4" width="14" height="11" rx="1.5" stroke="#627D98" strokeWidth="1.3" />
                <line x1="5" y1="8" x2="13" y2="8" stroke="#627D98" strokeWidth="1.3" strokeLinecap="round" />
                <line x1="5" y1="11" x2="9" y2="11" stroke="#627D98" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[13px] text-mid text-center">
              {tab === "ativos" ? "Nenhum chamado ativo no momento." : "Nenhum chamado resolvido ainda."}
            </p>
            {tab === "ativos" && (
              <button
                onClick={onAbrirChamado}
                className="text-[12px] text-brand hover:underline font-medium"
              >
                Abrir um novo chamado →
              </button>
            )}
          </div>
        ) : (
          lista.map((t) => (
            <button
              key={t.id}
              onClick={() => onOpenTicket(t.id)}
              className="w-full text-left bg-panel border border-divider rounded hover:border-brand/40 hover:bg-base/80 transition-all group p-4 flex flex-col gap-2.5"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="mono-label text-brand">{t.id}</span>
                    <span className="mono-label text-mid">{t.categoria}</span>
                  </div>
                  <p className="text-[13px] font-medium text-deep group-hover:text-brand transition-colors leading-snug">
                    {t.titulo}
                  </p>
                </div>
                <svg
                  className="text-divider group-hover:text-brand/50 transition-colors flex-shrink-0 mt-1"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Bottom row */}
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge status={t.status} />
                <PriorityBadge priority={t.prioridade} />
                <span className="mono-label text-mid/60">·</span>
                {t.responsavel ? (
                  <span className="mono-label text-mid">Responsável: {t.responsavel.split(" ")[0]}</span>
                ) : (
                  <span className="mono-label text-mid/50 italic">Aguardando atribuição</span>
                )}
                <span className="ml-auto mono-label text-mid">{t.atualizado}</span>
              </div>

              {/* SLA warning */}
              {t.slaStatus !== "ok" && (
                <div className={`flex items-center gap-1.5 pt-2 border-t border-divider`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${t.slaStatus === "breach" ? "bg-danger" : "bg-amber animate-blink"}`} />
                  <span className={`mono-label ${t.slaStatus === "breach" ? "text-danger" : "text-amber"}`}>
                    SLA: {t.slaLabel}
                  </span>
                </div>
              )}
            </button>
          ))
        )}
      </div>

      {/* Footer hint */}
      <div className="flex items-center justify-between px-6 py-2 border-t border-divider flex-shrink-0 bg-base/60">
        <span className="mono-label text-mid">
          {meusChamados.length} chamado{meusChamados.length !== 1 ? "s" : ""} registrado{meusChamados.length !== 1 ? "s" : ""} no total
        </span>
        <span className="mono-label text-mid/50">Dados locais · Pixie OS v2.1</span>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-panel border border-divider rounded p-3 flex flex-col gap-0.5">
      <span className={`font-display text-2xl font-bold ${color}`}>{value}</span>
      <span className="mono-label text-mid">{label}</span>
    </div>
  )
}

function Tab({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center px-1 pb-2.5 pt-1 mr-5 text-[12.5px] font-medium border-b-2 transition-colors ${
        active
          ? "border-brand text-brand"
          : "border-transparent text-mid hover:text-deep"
      }`}
    >
      {children}
    </button>
  )
}
