import { useState } from "react"
import { mockUsers, type UserProfile } from "@/data/mockData"

const PROFILE_COLORS: Record<UserProfile, string> = {
  "Administrador": "bg-brand/10 text-brand border-brand/25",
  "Supervisor": "bg-mid/10 text-mid border-mid/25",
  "Resolutor": "bg-success/10 text-success border-success/25",
  "Usuário Comum": "bg-divider text-mid border-divider",
}

const STATUS_COLORS: Record<string, string> = {
  "Ativo": "text-success",
  "Inativo": "text-mid",
  "Bloqueado": "text-danger",
}

export default function GestaoUsuarios() {
  const [search, setSearch] = useState("")
  const [profileFilter, setProfileFilter] = useState<UserProfile | "">("")
  const [showForm, setShowForm] = useState(false)

  const filtered = mockUsers.filter((u) => {
    const matchSearch =
      !search ||
      u.nome.toLowerCase().includes(search.toLowerCase()) ||
      u.cpf.includes(search) ||
      u.departamento.toLowerCase().includes(search.toLowerCase())
    const matchProfile = !profileFilter || u.perfil === profileFilter
    return matchSearch && matchProfile
  })

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-divider bg-panel flex-shrink-0">
        <div className="flex items-baseline gap-2 mr-auto">
          <h1 className="font-display text-[15px] font-bold text-deep">Gestão de Usuários</h1>
          <span className="mono-label text-mid">{filtered.length} usuário{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-mid" width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3" />
            <line x1="8.5" y1="8.5" x2="12" y2="12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuário..."
            className="pl-7 pr-3 py-1.5 text-[12px] bg-white border border-divider rounded w-44 text-deep placeholder-mid/50 focus:outline-none focus:border-brand transition-colors"
          />
        </div>

        <select
          value={profileFilter}
          onChange={(e) => setProfileFilter(e.target.value as UserProfile | "")}
          className="text-[11px] font-mono bg-white border border-divider rounded px-2 py-1.5 text-deep focus:outline-none focus:border-brand"
        >
          <option value="">Todos os perfis</option>
          {(["Administrador", "Supervisor", "Resolutor", "Usuário Comum"] as UserProfile[]).map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white text-[12px] font-semibold rounded hover:bg-brand/90 transition-colors"
        >
          <span className="text-[15px] leading-none">+</span>
          <span>Novo Usuário</span>
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-base z-10">
            <tr className="border-b border-divider">
              {["Usuário", "CPF", "Departamento", "Cargo", "Perfil", "Status", "Último Acesso", ""].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left mono-label text-mid font-medium border-b border-divider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-divider/50 hover:bg-panel/60 transition-colors group">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-brand flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-display font-bold text-white">{u.initials}</span>
                    </div>
                    <div>
                      <p className="text-[12.5px] font-medium text-deep">{u.nome}</p>
                      <p className="mono-label text-mid">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className="mono-label text-mid">{u.cpf}</span>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className="text-[12px] text-deep">{u.departamento}</span>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className="text-[12px] text-mid">{u.cargo}</span>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className={`mono-label px-1.5 py-0.5 rounded border ${PROFILE_COLORS[u.perfil]}`}>
                    {u.perfil}
                  </span>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${u.status === "Ativo" ? "bg-success" : u.status === "Bloqueado" ? "bg-danger" : "bg-mid"}`} />
                    <span className={`mono-label ${STATUS_COLORS[u.status]}`}>{u.status}</span>
                  </div>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <span className="mono-label text-mid">{u.ultimoAcesso}</span>
                </td>
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ActionBtn title="Editar">
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M7.5 1.5l2 2L3 10H1V8L7.5 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
                      </svg>
                    </ActionBtn>
                    {u.status === "Ativo" ? (
                      <ActionBtn title="Bloquear">
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <rect x="2" y="5" width="7" height="5" rx="1" stroke="currentColor" strokeWidth="1.2" />
                          <path d="M3.5 5V3.5a2 2 0 114 0V5" stroke="currentColor" strokeWidth="1.2" />
                        </svg>
                      </ActionBtn>
                    ) : (
                      <ActionBtn title="Reativar">
                        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                          <path d="M9 6.5A4 4 0 112 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                          <path d="M2 2v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </ActionBtn>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-divider flex-shrink-0 bg-base/60">
        <span className="mono-label text-mid">{filtered.length} de {mockUsers.length} usuários cadastrados</span>
        <span className="mono-label text-mid">Dados locais · Sync pendente</span>
      </div>

      {/* Inline new user form */}
      {showForm && (
        <div className="absolute inset-0 bg-deep/30 flex items-center justify-center z-50">
          <div className="bg-base border border-divider rounded shadow-xl w-[420px] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-divider">
              <h2 className="font-display text-[14px] font-bold text-deep">Novo Usuário</h2>
              <button onClick={() => setShowForm(false)} className="text-mid hover:text-deep transition-colors">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <line x1="2" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  <line x1="12" y1="2" x2="2" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {[["Nome Completo", "text", "Ana Paula Ferreira"], ["CPF", "text", "000.000.000-00"], ["E-mail Corporativo", "email", "ana.ferreira@empresa.com"], ["Cargo", "text", "Analista de TI"]].map(([label, type, placeholder]) => (
                <div key={label} className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-mid uppercase tracking-wide">{label}</label>
                  <input type={type} placeholder={placeholder} className="text-[12px] bg-white border border-divider rounded px-3 py-2 text-deep placeholder-mid/40 focus:outline-none focus:border-brand transition-colors font-mono" />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-mid uppercase tracking-wide">Perfil de Acesso</label>
                  <select className="text-[11px] font-mono bg-white border border-divider rounded px-2 py-2 text-deep focus:outline-none focus:border-brand">
                    {["Usuário Comum", "Resolutor", "Supervisor", "Administrador"].map((p) => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-mid uppercase tracking-wide">Departamento</label>
                  <select className="text-[11px] font-mono bg-white border border-divider rounded px-2 py-2 text-deep focus:outline-none focus:border-brand">
                    {["TI", "RH", "Financeiro", "Comercial", "Operações"].map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 bg-amber/5 border border-amber/20 rounded mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber flex-shrink-0" />
                <span className="mono-label text-amber">Senha temporária será gerada automaticamente</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t border-divider">
              <button onClick={() => setShowForm(false)} className="px-3 py-1.5 text-[12px] font-medium text-mid border border-divider rounded hover:border-mid transition-colors">Cancelar</button>
              <button onClick={() => setShowForm(false)} className="px-3 py-1.5 bg-brand text-white text-[12px] font-semibold rounded hover:bg-brand/90 transition-colors">Cadastrar Usuário</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ActionBtn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <button title={title} className="w-6 h-6 flex items-center justify-center text-mid hover:text-brand hover:bg-brand/10 rounded transition-colors">
      {children}
    </button>
  )
}
