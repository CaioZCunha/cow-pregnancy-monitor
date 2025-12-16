# 🐄 BovCheck - Sistema de Detecção de Gestação Bovina

Sistema para detecção de gestação em bovinos utilizando análise de ultrassom. O aplicativo permite gerenciar múltiplas sessões de verificação, acompanhar o status de gestação mensal de cada vaca e gerar relatórios detalhados.

---

## 📋 Funcionalidades

### Autenticação
- Login e cadastro de usuários
- Armazenamento seguro de credenciais
- Suporte a múltiplos usuários (fazendeiros/criadores)

### Gerenciamento de Sessões
- Criação ilimitada de sessões
- Definição do número de vacas por sessão
- Visualização de estatísticas por sessão
- Exclusão de sessões

### Tabela de Acompanhamento Mensal
- Visualização mensal do status de cada vaca
- Status: **S** (Grávida) | **N** (Não Grávida) | **-** (Pendente)
- Edição manual de registros
- Seletor de mês para navegação

### Análise de Áudio (Simulado)
- Interface de gravação de áudio
- Simulação de análise de batimentos cardíacos
- Detecção de 1 coração (não grávida) ou 2 corações (grávida)
- Confirmação ou repetição da análise

### Busca Avançada
- Pesquisa por número da vaca
- Filtro por sessão
- Filtro por status de gestação
- Visualização de datas de primeira e última checagem

### Relatórios
- Exportação em formato CSV
- Contagem de vacas grávidas vs não grávidas
- Dados organizados por sessão

---

## 🗂️ Estrutura de Pastas

```
bovcheck/
├── public/                     # Arquivos públicos estáticos
│   ├── favicon.ico            # Ícone do aplicativo
│   ├── placeholder.svg        # Imagem placeholder
│   └── robots.txt             # Configuração para crawlers
│
├── src/                        # Código fonte principal
│   ├── assets/                # Recursos estáticos (imagens, etc.)
│   │
│   ├── components/            # Componentes React reutilizáveis
│   │   ├── ui/               # Componentes de UI (shadcn/ui)
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── button.tsx     # Botões customizados
│   │   │   ├── card.tsx       # Cards
│   │   │   ├── dialog.tsx     # Modais
│   │   │   ├── input.tsx      # Inputs
│   │   │   ├── select.tsx     # Selects
│   │   │   ├── table.tsx      # Tabelas
│   │   │   ├── toast.tsx      # Notificações
│   │   │   └── ...            # Outros componentes UI
│   │   │
│   │   ├── AudioAnalyzer.tsx  # Componente de análise de áudio
│   │   ├── CowTable.tsx       # Tabela de vacas com status mensal
│   │   ├── NavLink.tsx        # Links de navegação
│   │   └── SearchBar.tsx      # Barra de busca avançada
│   │
│   ├── hooks/                 # Hooks customizados
│   │   ├── use-mobile.tsx     # Detecção de dispositivo móvel
│   │   └── use-toast.ts       # Hook para notificações
│   │
│   ├── lib/                   # Utilitários e helpers
│   │   └── utils.ts           # Funções utilitárias (cn, etc.)
│   │
│   ├── pages/                 # Páginas da aplicação
│   │   ├── Auth.tsx           # Página de login/cadastro
│   │   ├── Dashboard.tsx      # Painel principal com sessões
│   │   ├── Index.tsx          # Landing page
│   │   ├── NotFound.tsx       # Página 404
│   │   └── SessionDetail.tsx  # Detalhes de uma sessão
│   │
│   ├── App.css                # Estilos globais do App
│   ├── App.tsx                # Componente raiz com rotas
│   ├── index.css              # Design system e tokens CSS
│   ├── main.tsx               # Ponto de entrada da aplicação
│   └── vite-env.d.ts          # Tipos do Vite
│
├── .gitignore                 # Arquivos ignorados pelo Git
├── components.json            # Configuração do shadcn/ui
├── eslint.config.js           # Configuração do ESLint
├── index.html                 # HTML principal
├── package.json               # Dependências e scripts
├── postcss.config.js          # Configuração do PostCSS
├── tailwind.config.ts         # Configuração do Tailwind CSS
├── tsconfig.json              # Configuração do TypeScript
└── vite.config.ts             # Configuração do Vite
```

---

## 🎨 Design System

O aplicativo utiliza um tema agrícola com cores verdes e tons terrosos:

### Cores Principais
- **Primary**: Verde (#22c55e) - Ações principais
- **Secondary**: Verde claro - Elementos secundários
- **Accent**: Verde lima - Destaques
- **Background**: Tons neutros - Fundos
- **Muted**: Cinzas - Textos secundários

### Componentes Visuais
- Cards com efeito "glass" (glassmorphism)
- Sombras suaves
- Gradientes sutis
- Animações de transição

---

## 🛠️ Tecnologias

| Tecnologia | Descrição |
|------------|-----------|
| **React 18** | Biblioteca de UI |
| **TypeScript** | Tipagem estática |
| **Vite** | Build tool e dev server |
| **Tailwind CSS** | Framework de estilos |
| **shadcn/ui** | Componentes de UI |
| **React Router** | Navegação SPA |
| **TanStack Query** | Gerenciamento de estado servidor |
| **Lucide React** | Biblioteca de ícones |
| **date-fns** | Manipulação de datas |
| **Recharts** | Gráficos (disponível) |

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou bun como gerenciador de pacotes

### Instalação

```bash
# Clonar o repositório
git clone <URL_DO_REPOSITORIO>

# Navegar para o diretório
cd bovcheck

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Gera build de produção
npm run preview  # Visualiza build de produção
npm run lint     # Executa linter
```

---

## 📱 Fluxo de Uso

1. **Acesse** a landing page
2. **Faça login** ou crie uma conta
3. **Crie uma sessão** definindo o número de vacas
4. **Selecione o mês** para verificação
5. **Analise cada vaca** usando o analisador de áudio
6. **Confirme o resultado** (Grávida/Não Grávida)
7. **Visualize relatórios** e exporte dados
8. **Use a busca** para encontrar vacas específicas

---

## 📊 Estrutura de Dados

### Sessão
```typescript
interface Session {
  id: string;
  name: string;
  cowCount: number;
  createdAt: string;
  records: {
    [cowNumber: number]: {
      [month: string]: "S" | "N" | null;
    };
  };
}
```

### Status de Gestação
- `"S"` - Grávida (Success/Sim)
- `"N"` - Não Grávida (Negative/Não)
- `null` - Pendente/Não verificado

---

## 🔮 Roadmap Futuro

- [ ] Integração com análise de áudio real
- [ ] Persistência com Lovable Cloud (PostgreSQL)
- [ ] Autenticação com Supabase Auth
- [ ] Gráficos e dashboards avançados
- [ ] Notificações e lembretes
- [ ] Exportação em PDF
- [ ] Modo offline (PWA)
- [ ] App mobile nativo

---

## 📄 Licença

Este projeto foi desenvolvido com [Lovable](https://lovable.dev).

---

## 🤝 Suporte

Para dúvidas ou sugestões, entre em contato através do projeto no Lovable.
