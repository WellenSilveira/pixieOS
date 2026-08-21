import { useState } from "react"
import TitleBar from "@/components/TitleBar"
import Sidebar, { type ScreenId } from "@/components/Sidebar"
import SplashScreen from "@/screens/SplashScreen"
import LoginScreen, { type LoginResult } from "@/screens/LoginScreen"
import AtualizarSenha from "@/screens/AtualizarSenha"
import Dashboard from "@/screens/Dashboard"
import MeusChamados from "@/screens/MeusChamados"
import ChamadosList from "@/screens/ChamadosList"
import CriarChamado from "@/screens/CriarChamado"
import DetalhesChamado from "@/screens/DetalhesChamado"
import GestaoUsuarios from "@/screens/GestaoUsuarios"
import Inventario from "@/screens/Inventario"
import { type UserProfile } from "@/data/mockData"

type Phase = "splash" | "login" | "update-password" | "app"

function getInitials(nome: string) {
  const parts = nome.trim().split(" ")
  return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : parts[0].slice(0, 2).toUpperCase()
}

export default function App() {
  const [phase, setPhase] = useState<Phase>("splash")
  const [activeScreen, setActiveScreen] = useState<ScreenId>("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const [selectedTicketId, setSelectedTicketId] = useState("TKT-00142")
  const [userProfile, setUserProfile] = useState<UserProfile>("Administrador")
  const [userName, setUserName] = useState("Juliana Costa")

  function handleSplashComplete() {
    setPhase("login")
  }

  function handleLogin(result: LoginResult) {
    setUserProfile(result.profile)
    setUserName(result.nome)
    if (result.firstAccess) {
      setPhase("update-password")
    } else {
      // Route common users to their own tickets; everyone else to dashboard
      setActiveScreen(result.profile === "Usuário Comum" ? "chamados" : "dashboard")
      setPhase("app")
    }
  }

  function handlePasswordUpdated() {
    setActiveScreen(userProfile === "Usuário Comum" ? "chamados" : "dashboard")
    setPhase("app")
  }

  function handleNavigate(screen: string) {
    setActiveScreen(screen as ScreenId)
  }

  function handleOpenTicket(id: string) {
    setSelectedTicketId(id)
    setActiveScreen("detalhes-chamado")
  }

  const userInitials = getInitials(userName)

  // ── Pre-app phases ───────────────────────────────────────────────────────
  if (phase === "splash") {
    return (
      <div className="flex flex-col h-screen">
        <TitleBar isOnline={isOnline} onToggleOnline={() => setIsOnline((v) => !v)} />
        <div className="flex-1 overflow-hidden">
          <SplashScreen onComplete={handleSplashComplete} />
        </div>
      </div>
    )
  }

  if (phase === "login") {
    return (
      <div className="flex flex-col h-screen">
        <TitleBar isOnline={isOnline} onToggleOnline={() => setIsOnline((v) => !v)} />
        <div className="flex-1 overflow-hidden">
          <LoginScreen onLogin={handleLogin} />
        </div>
      </div>
    )
  }

  if (phase === "update-password") {
    return (
      <div className="flex flex-col h-screen">
        <TitleBar isOnline={isOnline} onToggleOnline={() => setIsOnline((v) => !v)} />
        <div className="flex-1 overflow-hidden">
          <AtualizarSenha onComplete={handlePasswordUpdated} />
        </div>
      </div>
    )
  }

  // ── Main app shell ───────────────────────────────────────────────────────
  const sidebarActive = activeScreen === "detalhes-chamado" ? "chamados" : activeScreen

  return (
    <div className="flex flex-col h-screen">
      <TitleBar isOnline={isOnline} onToggleOnline={() => setIsOnline((v) => !v)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          active={sidebarActive}
          onNavigate={handleNavigate}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
          userProfile={userProfile}
          userName={userName}
          userInitials={userInitials}
        />
        <main className="flex-1 overflow-hidden bg-base animate-fade-in">
          {/* Common user home */}
          {activeScreen === "chamados" && userProfile === "Usuário Comum" && (
            <MeusChamados
              userName={userName}
              onOpenTicket={handleOpenTicket}
              onAbrirChamado={() => handleNavigate("criar-chamado")}
            />
          )}

          {/* Full ticket list for elevated profiles */}
          {activeScreen === "chamados" && userProfile !== "Usuário Comum" && (
            <ChamadosList onOpenTicket={handleOpenTicket} onNavigate={handleNavigate} />
          )}

          {activeScreen === "detalhes-chamado" && (
            <DetalhesChamado ticketId={selectedTicketId} onBack={() => setActiveScreen("chamados")} />
          )}
          {activeScreen === "criar-chamado" && (
            <CriarChamado
              onSave={() => setActiveScreen("chamados")}
              onCancel={() => setActiveScreen("chamados")}
            />
          )}
          {activeScreen === "dashboard" && <Dashboard onNavigate={handleNavigate} />}
          {activeScreen === "historico" && (
            <ChamadosList onOpenTicket={handleOpenTicket} onNavigate={handleNavigate} />
          )}
          {activeScreen === "usuarios" && <GestaoUsuarios />}
          {activeScreen === "inventario" && <Inventario />}
          {activeScreen === "relatorios" && (
            <Placeholder title="Relatórios Locais" description="Exportação de relatórios em PDF/CSV diretamente para o disco da máquina." />
          )}
          {activeScreen === "auditoria" && (
            <Placeholder title="Auditoria do Sistema" description="Logs cronológicos de rastreabilidade de ações locais." />
          )}
          {activeScreen === "configuracoes" && (
            <Placeholder title="Configurações do Sistema" description="Parâmetros globais, SLAs, diretório de armazenamento local e backup — restrito ao Administrador." />
          )}
          {activeScreen === "notificacoes" && (
            <Placeholder title="Central de Notificações" description="Alertas de vencimento de SLA, interações em chamados e eventos do sistema." />
          )}
          {activeScreen === "perfil" && (
            <Placeholder title="Meu Perfil e Preferências" description={`Logado como ${userName} · ${userProfile}`} />
          )}
        </main>
      </div>
    </div>
  )
}

function Placeholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
      <div className="w-12 h-12 rounded-lg bg-panel border border-divider flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="7" height="7" rx="1.5" stroke="#627D98" strokeWidth="1.5" />
          <rect x="11" y="2" width="7" height="7" rx="1.5" stroke="#627D98" strokeWidth="1.5" />
          <rect x="2" y="11" width="7" height="7" rx="1.5" stroke="#627D98" strokeWidth="1.5" />
          <rect x="11" y="11" width="7" height="7" rx="1.5" stroke="#627D98" strokeWidth="1.5" />
        </svg>
      </div>
      <div>
        <h2 className="font-display text-lg font-bold text-deep">{title}</h2>
        <p className="text-[13px] text-mid mt-1 max-w-sm leading-relaxed">{description}</p>
        <p className="mono-label text-mid/50 mt-3">Módulo em desenvolvimento — Pixie OS v2.1</p>
      </div>
    </div>
  )
}
