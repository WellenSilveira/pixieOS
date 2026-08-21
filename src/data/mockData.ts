export type TicketStatus = "Aberto" | "Em Andamento" | "Aguardando" | "Resolvido" | "Fechado"
export type Priority = "Crítica" | "Alta" | "Média" | "Baixa"
export type UserProfile = "Administrador" | "Supervisor" | "Resolutor" | "Usuário Comum"
export type SlaStatus = "ok" | "warning" | "breach"

export interface Interaction {
  id: string
  autor: string
  cargo: string
  initials: string
  mensagem: string
  timestamp: string
  tipo: "resposta" | "nota-interna" | "status-change"
}

export interface Ticket {
  id: string
  titulo: string
  descricao: string
  status: TicketStatus
  prioridade: Priority
  solicitante: string
  responsavel: string | null
  criado: string
  atualizado: string
  slaLabel: string
  slaStatus: SlaStatus
  categoria: string
  departamento: string
  interacoes: Interaction[]
}

export interface User {
  id: string
  nome: string
  cargo: string
  departamento: string
  cpf: string
  email: string
  perfil: UserProfile
  status: "Ativo" | "Inativo" | "Bloqueado"
  ultimoAcesso: string
  initials: string
}

export interface Asset {
  id: string
  nome: string
  tipo: string
  marca: string
  modelo: string
  numeroSerie: string
  status: "Ativo" | "Manutenção" | "Inativo" | "Descartado"
  responsavel: string
  departamento: string
  dataAquisicao: string
  chamadosVinculados: number
}

export const loggedInUser: User = {
  id: "USR-004",
  nome: "Juliana Costa",
  cargo: "Gerente de TI",
  departamento: "TI",
  cpf: "456.789.012-33",
  email: "juliana.costa@empresa.com",
  perfil: "Administrador",
  status: "Ativo",
  ultimoAcesso: "2026-08-12 08:22",
  initials: "JC",
}

export const mockUsers: User[] = [
  { id: "USR-001", nome: "Carlos Eduardo Lima", cargo: "Analista de RH", departamento: "Recursos Humanos", cpf: "123.456.789-00", email: "carlos.lima@empresa.com", perfil: "Usuário Comum", status: "Ativo", ultimoAcesso: "2026-08-12 07:44", initials: "CE" },
  { id: "USR-002", nome: "Ana Paula Ferreira", cargo: "Técnica em TI", departamento: "TI", cpf: "234.567.890-11", email: "ana.ferreira@empresa.com", perfil: "Resolutor", status: "Ativo", ultimoAcesso: "2026-08-12 08:01", initials: "AF" },
  { id: "USR-003", nome: "Roberto Mendes", cargo: "Coordenador de TI", departamento: "TI", cpf: "345.678.901-22", email: "roberto.mendes@empresa.com", perfil: "Supervisor", status: "Ativo", ultimoAcesso: "2026-08-12 08:15", initials: "RM" },
  { id: "USR-004", nome: "Juliana Costa", cargo: "Gerente de TI", departamento: "TI", cpf: "456.789.012-33", email: "juliana.costa@empresa.com", perfil: "Administrador", status: "Ativo", ultimoAcesso: "2026-08-12 08:22", initials: "JC" },
  { id: "USR-005", nome: "Pedro Alves", cargo: "Analista Financeiro", departamento: "Financeiro", cpf: "567.890.123-44", email: "pedro.alves@empresa.com", perfil: "Usuário Comum", status: "Ativo", ultimoAcesso: "2026-08-11 16:30", initials: "PA" },
  { id: "USR-006", nome: "Fernanda Silva", cargo: "Técnica em TI", departamento: "TI", cpf: "678.901.234-55", email: "fernanda.silva@empresa.com", perfil: "Resolutor", status: "Inativo", ultimoAcesso: "2026-08-10 14:20", initials: "FS" },
  { id: "USR-007", nome: "Marcos Ribeiro", cargo: "Gerente Comercial", departamento: "Comercial", cpf: "789.012.345-66", email: "marcos.ribeiro@empresa.com", perfil: "Usuário Comum", status: "Ativo", ultimoAcesso: "2026-08-12 09:00", initials: "MR" },
  { id: "USR-008", nome: "Tatiana Nunes", cargo: "Analista Jurídico", departamento: "Jurídico", cpf: "890.123.456-77", email: "tatiana.nunes@empresa.com", perfil: "Usuário Comum", status: "Bloqueado", ultimoAcesso: "2026-08-05 11:30", initials: "TN" },
]

export const mockTickets: Ticket[] = [
  {
    id: "TKT-00142",
    titulo: "Computador não liga — Sala 304",
    descricao: "O computador da mesa 3 da sala 304 não está ligando. Ao pressionar o botão power, o led acende brevemente e apaga. Monitores e periféricos funcionam normalmente.",
    status: "Em Andamento",
    prioridade: "Alta",
    solicitante: "Carlos Eduardo Lima",
    responsavel: "Ana Paula Ferreira",
    criado: "2026-08-12 08:32",
    atualizado: "2026-08-12 09:14",
    slaLabel: "1h 46min restante",
    slaStatus: "warning",
    categoria: "Hardware",
    departamento: "Recursos Humanos",
    interacoes: [
      { id: "INT-001", autor: "Carlos Eduardo Lima", cargo: "Analista de RH", initials: "CE", mensagem: "O computador da mesa 3 não está ligando desde o início do expediente. Preciso urgente pois tenho reunião às 10h.", timestamp: "2026-08-12 08:32", tipo: "resposta" },
      { id: "INT-002", autor: "Ana Paula Ferreira", cargo: "Técnica em TI", initials: "AF", mensagem: "Chamado recebido. Irei verificar o equipamento ainda nesta manhã. Pode ser fonte de alimentação ou memória RAM com mau contato.", timestamp: "2026-08-12 08:47", tipo: "resposta" },
      { id: "INT-003", autor: "Ana Paula Ferreira", cargo: "Técnica em TI", initials: "AF", mensagem: "Nota interna: verificado fisicamente — fonte com ruído ao ligar. Necessário substituição. Consultando estoque de peças no almoxarifado.", timestamp: "2026-08-12 09:14", tipo: "nota-interna" },
    ],
  },
  {
    id: "TKT-00141",
    titulo: "VPN não conecta fora da rede corporativa",
    descricao: "Não consigo conectar à VPN corporativa quando estou trabalhando remotamente. O cliente Cisco AnyConnect retorna erro de autenticação.",
    status: "Aberto",
    prioridade: "Média",
    solicitante: "Pedro Alves",
    responsavel: null,
    criado: "2026-08-12 07:15",
    atualizado: "2026-08-12 07:15",
    slaLabel: "6h restantes",
    slaStatus: "ok",
    categoria: "Rede",
    departamento: "Financeiro",
    interacoes: [
      { id: "INT-004", autor: "Pedro Alves", cargo: "Analista Financeiro", initials: "PA", mensagem: "Ontem funcionava normalmente. Hoje ao tentar acessar de casa recebo erro de autenticação. Minha senha não foi alterada.", timestamp: "2026-08-12 07:15", tipo: "resposta" },
    ],
  },
  {
    id: "TKT-00140",
    titulo: "Impressora HP LaserJet — atolamento recorrente",
    descricao: "A impressora do corredor B está sofrendo atolamentos frequentes de papel nos últimos 3 dias.",
    status: "Resolvido",
    prioridade: "Baixa",
    solicitante: "Mariana Torres",
    responsavel: "Fernanda Silva",
    criado: "2026-08-11 14:00",
    atualizado: "2026-08-12 08:00",
    slaLabel: "Resolvido no prazo",
    slaStatus: "ok",
    categoria: "Hardware",
    departamento: "Administrativo",
    interacoes: [],
  },
  {
    id: "TKT-00139",
    titulo: "Acesso ao ERP — perfil desatualizado após promoção",
    descricao: "Fui promovido a coordenador mas meu perfil no ERP ainda é de analista. Não consigo aprovar requisições de compra.",
    status: "Aguardando",
    prioridade: "Alta",
    solicitante: "Lucas Oliveira",
    responsavel: "Ana Paula Ferreira",
    criado: "2026-08-11 10:30",
    atualizado: "2026-08-11 15:45",
    slaLabel: "Vencido há 2h",
    slaStatus: "breach",
    categoria: "Acesso",
    departamento: "Operações",
    interacoes: [],
  },
  {
    id: "TKT-00138",
    titulo: "Monitor com tela piscando — Recepção",
    descricao: "O monitor da recepção está piscando intermitentemente desde segunda-feira.",
    status: "Fechado",
    prioridade: "Média",
    solicitante: "Beatriz Ramos",
    responsavel: "Fernanda Silva",
    criado: "2026-08-10 09:00",
    atualizado: "2026-08-11 11:00",
    slaLabel: "Resolvido no prazo",
    slaStatus: "ok",
    categoria: "Hardware",
    departamento: "Administrativo",
    interacoes: [],
  },
  {
    id: "TKT-00137",
    titulo: "Solicitação de notebook para novo colaborador",
    descricao: "Novo colaborador do setor jurídico iniciou hoje e precisa de equipamento para trabalho.",
    status: "Aberto",
    prioridade: "Crítica",
    solicitante: "Tatiana Nunes",
    responsavel: null,
    criado: "2026-08-12 09:00",
    atualizado: "2026-08-12 09:00",
    slaLabel: "4h restantes",
    slaStatus: "ok",
    categoria: "Provisionamento",
    departamento: "Jurídico",
    interacoes: [],
  },
]

export const mockAssets: Asset[] = [
  { id: "ATI-0891", nome: "Desktop HP ProDesk 400 G7", tipo: "Desktop", marca: "HP", modelo: "ProDesk 400 G7", numeroSerie: "MXL1234567", status: "Ativo", responsavel: "Carlos Eduardo Lima", departamento: "RH", dataAquisicao: "2023-03-15", chamadosVinculados: 3 },
  { id: "ATI-0892", nome: "Notebook Dell Latitude 5420", tipo: "Notebook", marca: "Dell", modelo: "Latitude 5420", numeroSerie: "DL7890123", status: "Manutenção", responsavel: "Pedro Alves", departamento: "Financeiro", dataAquisicao: "2022-11-20", chamadosVinculados: 7 },
  { id: "ATI-0893", nome: "Impressora HP LaserJet M404n", tipo: "Impressora", marca: "HP", modelo: "LaserJet M404n", numeroSerie: "HP4567890", status: "Ativo", responsavel: "Administrativo", departamento: "Administrativo", dataAquisicao: "2021-06-10", chamadosVinculados: 12 },
  { id: "ATI-0894", nome: "Switch Cisco Catalyst 2960-24TC", tipo: "Rede", marca: "Cisco", modelo: "Catalyst 2960-24TC", numeroSerie: "CS1122334", status: "Ativo", responsavel: "TI", departamento: "TI", dataAquisicao: "2020-01-08", chamadosVinculados: 1 },
  { id: "ATI-0895", nome: "Monitor LG 24MK600M", tipo: "Monitor", marca: "LG", modelo: "24MK600M", numeroSerie: "LG3344556", status: "Inativo", responsavel: "Recepção", departamento: "Administrativo", dataAquisicao: "2021-09-30", chamadosVinculados: 2 },
  { id: "ATI-0896", nome: "Notebook Lenovo ThinkPad E14", tipo: "Notebook", marca: "Lenovo", modelo: "ThinkPad E14 Gen 3", numeroSerie: "LV9988776", status: "Ativo", responsavel: "Marcos Ribeiro", departamento: "Comercial", dataAquisicao: "2023-07-22", chamadosVinculados: 0 },
  { id: "ATI-0897", nome: "Nobreak APC BVX700I-BR", tipo: "Energia", marca: "APC", modelo: "BVX700I-BR", numeroSerie: "AP6655443", status: "Descartado", responsavel: "TI", departamento: "TI", dataAquisicao: "2019-04-05", chamadosVinculados: 0 },
]

export const weeklyChart = [
  { dia: "Seg", abertos: 5, resolvidos: 8 },
  { dia: "Ter", abertos: 7, resolvidos: 11 },
  { dia: "Qua", abertos: 4, resolvidos: 6 },
  { dia: "Qui", abertos: 9, resolvidos: 7 },
  { dia: "Sex", abertos: 6, resolvidos: 9 },
  { dia: "Sáb", abertos: 2, resolvidos: 4 },
  { dia: "Dom", abertos: 1, resolvidos: 3 },
]

export const dashboardStats = {
  totalChamados: 142,
  abertos: 18,
  emAndamento: 7,
  resolvidos: 117,
  slaBreached: 3,
  slaWarning: 5,
  totalAtivos: 248,
  ativosEmManutencao: 12,
  totalUsuarios: 87,
  usuariosAtivos: 84,
  taxaResolucao: 82,
}
