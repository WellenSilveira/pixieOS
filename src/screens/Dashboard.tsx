import { dashboardStats, mockTickets, weeklyChart } from "@/data/mockData"

interface DashboardProps {
  onNavigate: (screen: string) => void
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const recentTickets = mockTickets.slice(0, 5)

  return (
    <div className="flex flex-col gap-5 p-5 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-baseline justify-between flex-shrink-0">
        <div>
          <h1 className="font-display text-xl font-bold text-deep">Dashboard</h1>
          <p className="mono-label text-mid mt-0.5">Atualizado em: 2026-08-12 09:14:32 — dados locais</p>
        </div>
        <button
          onClick={() => onNavigate("criar-chamado")}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-brand text-white text-[12px] font-semibold rounded hover:bg-brand/90 transition-colors"
        >
          <span>+</span>
          <span>Abrir Chamado</span>
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-shrink-0">
        <KpiCard
          label="Chamados Abertos"
          value={dashboardStats.abertos}
          sub={`${dashboardStats.emAndamento} em andamento`}
          accent="brand"
          onClick={() => onNavigate("chamados")}
        />
        <KpiCard
          label="SLA Crítico"
          value={dashboardStats.slaBreached}
          sub={`${dashboardStats.slaWarning} em atenção`}
          accent="danger"
          onClick={() => onNavigate("chamados")}
        />
        <KpiCard
          label="Ativos Cadastrados"
          value={dashboardStats.totalAtivos}
          sub={`${dashboardStats.ativosEmManutencao} em manutenção`}
          accent="mid"
          onClick={() => onNavigate("inventario")}
        />
        <KpiCard
          label="Taxa de Resolução"
          value={`${dashboardStats.taxaResolucao}%`}
          sub="últimos 30 dias"
          accent="success"
        />
      </div>

      {/* Chart + SLA summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 flex-shrink-0">
        {/* Bar chart */}
        <div className="lg:col-span-2 bg-panel rounded border border-divider p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display text-[13px] font-semibold text-deep">Chamados — Últimos 7 dias</h3>
              <p className="mono-label text-mid mt-0.5">Abertos vs. Resolvidos</p>
            </div>
            <div className="flex items-center gap-3">
              <Legend color="bg-brand" label="Resolvidos" />
              <Legend color="bg-divider border border-mid/30" label="Abertos" />
            </div>
          </div>
          <WeeklyBarChart data={weeklyChart} />
        </div>

        {/* SLA breakdown */}
        <div className="bg-panel rounded border border-divider p-4 flex flex-col gap-3">
          <h3 className="font-display text-[13px] font-semibold text-deep">Status SLA</h3>
          <SlaBar label="Dentro do Prazo" count={dashboardStats.resolvidos - dashboardStats.slaBreached} total={dashboardStats.totalChamados} color="bg-success" />
          <SlaBar label="Em Atenção" count={dashboardStats.slaWarning} total={dashboardStats.totalChamados} color="bg-amber" />
          <SlaBar label="Vencidos" count={dashboardStats.slaBreached} total={dashboardStats.totalChamados} color="bg-danger" />
          <div className="mt-auto pt-3 border-t border-divider">
            <div className="flex justify-between items-baseline">
              <span className="mono-label text-mid">Total acumulado</span>
              <span className="font-display font-bold text-lg text-deep">{dashboardStats.totalChamados}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent tickets */}
      <div className="bg-panel rounded border border-divider flex-shrink-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-divider">
          <h3 className="font-display text-[13px] font-semibold text-deep">Chamados Recentes</h3>
          <button
            onClick={() => onNavigate("chamados")}
            className="mono-label text-brand hover:underline"
          >
            Ver todos →
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-divider">
              {["ID", "Título", "Status", "Prioridade", "SLA", "Responsável"].map((h) => (
                <Th key={h}>{h}</Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentTickets.map((t, i) => (
              <tr
                key={t.id}
                onClick={() => onNavigate("detalhes-chamado")}
                className={`border-b border-divider/50 hover:bg-base/70 cursor-pointer transition-colors ${
                  i === recentTickets.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="px-4 py-2.5">
                  <span className="mono-label text-brand">{t.id}</span>
                </td>
                <td className="px-4 py-2.5 max-w-[200px]">
                  <span className="text-[12px] text-deep truncate block">{t.titulo}</span>
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={t.status} />
                </td>
                <td className="px-4 py-2.5">
                  <PriorityBadge priority={t.prioridade} />
                </td>
                <td className="px-4 py-2.5">
                  <span className={`mono-label ${t.slaStatus === "breach" ? "text-danger" : t.slaStatus === "warning" ? "text-amber" : "text-mid"}`}>
                    {t.slaLabel}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-[12px] text-mid">{t.responsavel ?? "—"}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Offline notice */}
      <div className="flex items-center gap-2 px-3 py-2 bg-amber/10 border border-amber/25 rounded flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-amber flex-shrink-0 animate-blink" />
        <p className="mono-label text-amber">Sincronização pendente — dados salvos localmente. Última tentativa: 2026-08-12 08:55:00</p>
      </div>
    </div>
  )
}

/* ── Sub-components ── */

function KpiCard({
  label,
  value,
  sub,
  accent,
  onClick,
}: {
  label: string
  value: string | number
  sub: string
  accent: "brand" | "danger" | "success" | "mid"
  onClick?: () => void
}) {
  const accentMap = {
    brand: "text-brand",
    danger: "text-danger",
    success: "text-success",
    mid: "text-mid",
  }

  return (
    <div
      onClick={onClick}
      className={`bg-panel rounded border border-divider p-4 flex flex-col gap-1 ${onClick ? "cursor-pointer hover:bg-base/80 transition-colors" : ""}`}
    >
      <p className="mono-label text-mid">{label}</p>
      <p className={`font-display text-3xl font-bold ${accentMap[accent]}`}>{value}</p>
      <p className="mono-label text-mid/70">{sub}</p>
    </div>
  )
}

function WeeklyBarChart({ data }: { data: typeof weeklyChart }) {
  const maxVal = Math.max(...data.flatMap((d) => [d.abertos, d.resolvidos]))
  const h = 90

  return (
    <div className="w-full overflow-hidden">
      <svg
        viewBox={`0 0 ${data.length * 52} ${h + 28}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Horizontal grid lines */}
        {[0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1={0}
            y1={h - ratio * h}
            x2={data.length * 52}
            y2={h - ratio * h}
            stroke="#CBD2D9"
            strokeWidth="0.5"
            strokeDasharray="3 3"
          />
        ))}
        {data.map((d, i) => {
          const x = i * 52 + 6
          const rH = (d.resolvidos / maxVal) * h
          const aH = (d.abertos / maxVal) * h
          return (
            <g key={d.dia}>
              <rect x={x} y={h - rH} width={16} height={rH} fill="#334E68" rx={2} />
              <rect x={x + 20} y={h - aH} width={16} height={aH} fill="#CBD2D9" rx={2} />
              <text
                x={x + 16}
                y={h + 16}
                textAnchor="middle"
                fontSize={9}
                fill="#627D98"
                fontFamily="JetBrains Mono, monospace"
                letterSpacing="0.05em"
              >
                {d.dia.toUpperCase()}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function SlaBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = Math.round((count / total) * 100)
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-deep">{label}</span>
        <span className="mono-label text-deep font-medium">{count}</span>
      </div>
      <div className="h-1.5 bg-divider rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />
      <span className="mono-label text-mid">{label}</span>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2 text-left mono-label text-mid font-medium">{children}</th>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    "Aberto": "bg-brand/10 text-brand border-brand/25",
    "Em Andamento": "bg-amber/10 text-amber border-amber/25",
    "Aguardando": "bg-mid/10 text-mid border-mid/25",
    "Resolvido": "bg-success/10 text-success border-success/25",
    "Fechado": "bg-divider text-mid border-divider",
  }
  return (
    <span className={`mono-label px-1.5 py-0.5 rounded border ${map[status] ?? "bg-divider text-mid"}`}>
      {status}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, string> = {
    "Crítica": "text-danger",
    "Alta": "text-amber",
    "Média": "text-mid",
    "Baixa": "text-mid/60",
  }
  return <span className={`mono-label ${map[priority] ?? "text-mid"}`}>{priority}</span>
}
