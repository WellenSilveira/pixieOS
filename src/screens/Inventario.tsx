import { useState } from "react"
import { mockAssets } from "@/data/mockData"

const STATUS_MAP: Record<string, string> = {
  "Ativo": "text-success",
  "Manutenção": "text-amber",
  "Inativo": "text-mid",
  "Descartado": "text-danger",
}

const STATUS_DOT: Record<string, string> = {
  "Ativo": "bg-success",
  "Manutenção": "bg-amber animate-blink",
  "Inativo": "bg-mid",
  "Descartado": "bg-danger",
}

export default function Inventario() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const types = Array.from(new Set(mockAssets.map((a) => a.tipo)))
  const statuses = ["Ativo", "Manutenção", "Inativo", "Descartado"]

  const filtered = mockAssets.filter((a) => {
    const matchSearch =
      !search ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.nome.toLowerCase().includes(search.toLowerCase()) ||
      a.numeroSerie.toLowerCase().includes(search.toLowerCase()) ||
      a.responsavel.toLowerCase().includes(search.toLowerCase())
    const matchType = !typeFilter || a.tipo === typeFilter
    const matchStatus = !statusFilter || a.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  const countByStatus = statuses.reduce((acc, s) => {
    acc[s] = mockAssets.filter((a) => a.status === s).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-divider bg-panel flex-shrink-0 flex-wrap">
        <div className="flex items-baseline gap-2 mr-auto">
          <h1 className="font-display text-[15px] font-bold text-deep">Inventário de Ativos</h1>
          <span className="mono-label text-mid">{filtered.length} ativo{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-mid" width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3" />
            <line x1="8.5" y1="8.5" x2="12" y2="12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar ativo ou N/S..."
            className="pl-7 pr-3 py-1.5 text-[12px] bg-white border border-divider rounded w-44 text-deep placeholder-mid/50 focus:outline-none focus:border-brand transition-colors"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="text-[11px] font-mono bg-white border border-divider rounded px-2 py-1.5 text-deep focus:outline-none focus:border-brand"
        >
          <option value="">Todos os tipos</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-[11px] font-mono bg-white border border-divider rounded px-2 py-1.5 text-deep focus:outline-none focus:border-brand"
        >
          <option value="">Todos os status</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white text-[12px] font-semibold rounded hover:bg-brand/90 transition-colors">
          <span className="text-[15px] leading-none">+</span>
          <span>Novo Ativo</span>
        </button>
      </div>

      {/* Summary strip */}
      <div className="flex gap-0 border-b border-divider flex-shrink-0">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? "" : s)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] border-r border-divider last:border-r-0 transition-colors ${
              statusFilter === s ? "bg-panel" : "hover:bg-base/80"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[s]}`} />
            <span className="font-mono text-mid uppercase tracking-wide">{s}</span>
            <span className={`mono-label font-bold ${STATUS_MAP[s]}`}>{countByStatus[s]}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-base z-10">
            <tr className="border-b border-divider">
              {["ID", "Nome do Ativo", "Tipo", "Marca / Modelo", "N/S", "Status", "Responsável", "Departamento", "Aquisição", "Chamados"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left mono-label text-mid font-medium border-b border-divider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-b border-divider/50 hover:bg-panel/60 transition-colors cursor-pointer group">
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className="mono-label text-brand">{a.id}</span>
                </td>
                <td className="px-4 py-2.5 min-w-[160px]">
                  <span className="text-[12.5px] font-medium text-deep group-hover:text-brand transition-colors">{a.nome}</span>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className="mono-label text-mid">{a.tipo}</span>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className="text-[12px] text-deep">{a.marca}</span>
                  <span className="text-[11px] text-mid ml-1">/ {a.modelo}</span>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className="mono-label text-mid">{a.numeroSerie}</span>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[a.status]}`} />
                    <span className={`mono-label ${STATUS_MAP[a.status]}`}>{a.status}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className="text-[12px] text-deep">{a.responsavel}</span>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className="mono-label text-mid">{a.departamento}</span>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className="mono-label text-mid">{a.dataAquisicao}</span>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap text-center">
                  {a.chamadosVinculados > 0 ? (
                    <span className="mono-label text-brand font-bold">{a.chamadosVinculados}</span>
                  ) : (
                    <span className="mono-label text-mid/40">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-t border-divider flex-shrink-0 bg-base/60">
        <span className="mono-label text-mid">{filtered.length} de {mockAssets.length} ativos · Total cadastrado: 248</span>
        <span className="mono-label text-mid">Dados locais · Inventário v2026-08-12</span>
      </div>
    </div>
  )
}
