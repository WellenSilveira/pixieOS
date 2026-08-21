import { useState } from "react"
import { mockTickets, type TicketStatus, type Priority } from "@/data/mockData"
import { StatusBadge, PriorityBadge } from "./Dashboard"

interface ChamadosListProps {
  onOpenTicket: (id: string) => void
  onNavigate: (screen: string) => void
}

const STATUS_OPTIONS: TicketStatus[] = ["Aberto", "Em Andamento", "Aguardando", "Resolvido", "Fechado"]
const PRIORITY_OPTIONS: Priority[] = ["Crítica", "Alta", "Média", "Baixa"]

export default function ChamadosList({ onOpenTicket, onNavigate }: ChamadosListProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "">("")
  const [priorityFilter, setPriorityFilter] = useState<Priority | "">("")

  const filtered = mockTickets.filter((t) => {
    const matchSearch =
      !search ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.titulo.toLowerCase().includes(search.toLowerCase()) ||
      t.solicitante.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !statusFilter || t.status === statusFilter
    const matchPriority = !priorityFilter || t.prioridade === priorityFilter
    return matchSearch && matchStatus && matchPriority
  })

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-divider flex-shrink-0 bg-panel">
        <div className="flex items-baseline gap-2 mr-auto">
          <h1 className="font-display text-[15px] font-bold text-deep">Chamados</h1>
          <span className="mono-label text-mid">{filtered.length} registro{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-mid" width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3" />
            <line x1="8.5" y1="8.5" x2="12" y2="12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar chamado..."
            className="pl-7 pr-3 py-1.5 text-[12px] bg-white border border-divider rounded w-48 text-deep placeholder-mid/50 focus:outline-none focus:border-brand transition-colors"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TicketStatus | "")}
          className="text-[11px] font-mono bg-white border border-divider rounded px-2 py-1.5 text-deep focus:outline-none focus:border-brand transition-colors"
        >
          <option value="">Todos os status</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as Priority | "")}
          className="text-[11px] font-mono bg-white border border-divider rounded px-2 py-1.5 text-deep focus:outline-none focus:border-brand transition-colors"
        >
          <option value="">Todas prioridades</option>
          {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>

        <button
          onClick={() => onNavigate("criar-chamado")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white text-[12px] font-semibold rounded hover:bg-brand/90 transition-colors"
        >
          <span className="text-[15px] leading-none">+</span>
          <span>Novo</span>
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-base z-10">
            <tr className="border-b border-divider">
              {["ID", "Título", "Solicitante", "Departamento", "Status", "Prioridade", "SLA", "Responsável", "Atualizado"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left mono-label text-mid font-medium whitespace-nowrap border-b border-divider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center">
                  <p className="text-[13px] text-mid">Nenhum chamado encontrado com os filtros aplicados.</p>
                </td>
              </tr>
            ) : (
              filtered.map((t, i) => (
                <tr
                  key={t.id}
                  onClick={() => onOpenTicket(t.id)}
                  className={`border-b border-divider/50 hover:bg-panel/80 cursor-pointer transition-colors group ${
                    t.slaStatus === "breach" ? "bg-danger/[0.03]" : ""
                  }`}
                >
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="mono-label text-brand">{t.id}</span>
                  </td>
                  <td className="px-4 py-2.5 min-w-[180px] max-w-[240px]">
                    <span className="text-[12px] text-deep group-hover:text-brand transition-colors truncate block">
                      {t.titulo}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="text-[12px] text-deep">{t.solicitante}</span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="mono-label text-mid">{t.departamento}</span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <StatusBadge status={t.status} />
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <PriorityBadge priority={t.prioridade} />
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span
                      className={`mono-label ${
                        t.slaStatus === "breach"
                          ? "text-danger"
                          : t.slaStatus === "warning"
                          ? "text-amber"
                          : "text-mid"
                      }`}
                    >
                      {t.slaLabel}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="text-[12px] text-mid">{t.responsavel ?? <span className="text-mid/40 italic">Não atribuído</span>}</span>
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    <span className="mono-label text-mid">{t.atualizado}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-divider flex-shrink-0 bg-base/60">
        <span className="mono-label text-mid">{filtered.length} de {mockTickets.length} chamados</span>
        <span className="mono-label text-mid">Dados locais · Última sync: 08:55</span>
      </div>
    </div>
  )
}
