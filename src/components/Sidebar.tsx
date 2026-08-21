import { type ReactNode } from "react"
import { type UserProfile } from "@/data/mockData"

export type ScreenId =
  | "dashboard"
  | "chamados"
  | "criar-chamado"
  | "detalhes-chamado"
  | "historico"
  | "usuarios"
  | "inventario"
  | "relatorios"
  | "auditoria"
  | "configuracoes"
  | "notificacoes"
  | "perfil"

interface NavItem {
  id: ScreenId
  label: string
  icon: ReactNode
  badge?: number
  dividerBefore?: boolean
}

interface SidebarProps {
  active: ScreenId
  onNavigate: (screen: ScreenId) => void
  collapsed: boolean
  onToggle: () => void
  userProfile: UserProfile
  userName: string
  userInitials: string
}

const ALL_NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <IconDashboard /> },
  { id: "chamados", label: "Meus Chamados", icon: <IconTicket />, badge: 2 },
  { id: "criar-chamado", label: "Abrir Chamado", icon: <IconPlus /> },
  { id: "historico", label: "Histórico", icon: <IconHistory />, dividerBefore: true },
  { id: "usuarios", label: "Usuários", icon: <IconUsers /> },
  { id: "inventario", label: "Inventário", icon: <IconBox /> },
  { id: "relatorios", label: "Relatórios", icon: <IconChart /> },
  { id: "auditoria", label: "Auditoria", icon: <IconShield />, dividerBefore: true },
  { id: "configuracoes", label: "Configurações", icon: <IconGear /> },
]

const PROFILE_SCREENS: Record<UserProfile, ScreenId[]> = {
  "Usuário Comum":  ["chamados", "criar-chamado"],
  "Resolutor":      ["dashboard", "chamados", "criar-chamado"],
  "Supervisor":     ["dashboard", "chamados", "criar-chamado", "historico", "usuarios", "inventario", "relatorios", "auditoria"],
  "Administrador":  ["dashboard", "chamados", "criar-chamado", "historico", "usuarios", "inventario", "relatorios", "auditoria", "configuracoes"],
}

const bottomItems: NavItem[] = [
  { id: "notificacoes", label: "Notificações", icon: <IconBell />, badge: 4 },
  { id: "perfil", label: "Meu Perfil", icon: <IconPerson /> },
]

export default function Sidebar({ active, onNavigate, collapsed, onToggle, userProfile, userName, userInitials }: SidebarProps) {
  const allowed = PROFILE_SCREENS[userProfile] ?? []
  const navItems = ALL_NAV.filter((item) => allowed.includes(item.id))
  const w = collapsed ? "w-14" : "w-[200px]"

  return (
    <div
      className={`${w} flex flex-col bg-panel border-r border-divider transition-all duration-200 flex-shrink-0 overflow-hidden`}
    >
      {/* Toggle */}
      <button
        onClick={onToggle}
        className="h-9 flex items-center justify-center text-mid hover:text-brand hover:bg-divider/50 transition-colors flex-shrink-0 border-b border-divider"
        title={collapsed ? "Expandir menu" : "Recolher menu"}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className={`transition-transform duration-200 ${collapsed ? "" : "rotate-180"}`}
        >
          <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Main nav */}
      <nav className="flex-1 py-2 overflow-y-auto overflow-x-hidden">
        {navItems.map((item) => (
          <div key={item.id}>
            {item.dividerBefore && <div className="mx-3 my-1.5 border-t border-divider" />}
            <NavButton item={item} active={active === item.id} collapsed={collapsed} onClick={() => onNavigate(item.id)} />
          </div>
        ))}
      </nav>

      {/* Bottom nav */}
      <div className="border-t border-divider py-2">
        {bottomItems.map((item) => (
          <NavButton key={item.id} item={item} active={active === item.id} collapsed={collapsed} onClick={() => onNavigate(item.id)} />
        ))}
      </div>

      {/* User card */}
      <div
        className={`border-t border-divider p-2 flex items-center gap-2 cursor-pointer hover:bg-divider/50 transition-colors ${collapsed ? "justify-center" : ""}`}
        onClick={() => onNavigate("perfil")}
      >
        <div className="w-7 h-7 rounded bg-brand flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-display font-bold text-white">{userInitials}</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden flex-1">
            <p className="text-[12px] font-medium text-deep truncate leading-tight">{userName}</p>
            <p className="mono-label text-mid truncate">{userProfile}</p>
          </div>
        )}
      </div>

      {/* Data integrity footer */}
      {!collapsed && (
        <div className="px-3 py-1.5 border-t border-divider bg-base/60">
          <p className="mono-label text-mid leading-relaxed">
            Dados locais: 1.248 reg.
          </p>
          <p className="mono-label text-success">Backup local OK</p>
        </div>
      )}
    </div>
  )
}

function NavButton({
  item,
  active,
  collapsed,
  onClick,
}: {
  item: NavItem
  active: boolean
  collapsed: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={`w-full flex items-center gap-2.5 relative transition-colors group ${
        collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2"
      } ${active ? "bg-brand/10 text-brand" : "text-mid hover:text-deep hover:bg-divider/60"}`}
    >
      {/* Active indicator */}
      {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-brand rounded-r" />}

      <span className="flex-shrink-0 w-4 h-4">{item.icon}</span>

      {!collapsed && (
        <span className="text-[12.5px] font-medium truncate flex-1 text-left">{item.label}</span>
      )}

      {!collapsed && item.badge !== undefined && item.badge > 0 && (
        <span className="text-[9px] font-mono font-bold bg-brand text-white rounded px-1 py-0.5 leading-none">
          {item.badge}
        </span>
      )}

      {collapsed && item.badge !== undefined && item.badge > 0 && (
        <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-brand" />
      )}
    </button>
  )
}

/* ── Icons ───────────────────────────────────────────── */
function IconDashboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}
function IconTicket() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <line x1="4.5" y1="6.5" x2="11.5" y2="6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="4.5" y1="9.5" x2="8.5" y2="9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <line x1="8" y1="5" x2="8" y2="11" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
function IconHistory() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <polyline points="8,5 8,8.5 10.5,10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M15 13c0-2.21-1.34-4-3-4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
function IconBox() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="1.3" />
      <line x1="2" y1="5.5" x2="14" y2="5.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}
function IconChart() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="9" width="3" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="6.5" y="5.5" width="3" height="8.5" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
      <rect x="11" y="2" width="3" height="12" rx="0.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}
function IconShield() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L13.5 4.5V8.5C13.5 11 11 13.5 8 14.5C5 13.5 2.5 11 2.5 8.5V4.5L8 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <polyline points="5.5,8 7.5,10 11,6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconGear() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M11.54 4.46l1.41-1.41M3.05 12.95l1.41-1.41" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
function IconBell() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2.5C5.52 2.5 3.5 4.52 3.5 7V10.5L2 12H14L12.5 10.5V7C12.5 4.52 10.48 2.5 8 2.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6.5 12.5C6.5 13.33 7.17 14 8 14C8.83 14 9.5 13.33 9.5 12.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}
function IconPerson() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 14C2 11.24 4.69 9 8 9s6 2.24 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
