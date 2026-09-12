# ABINITIA — Da Origem ao Legado 🌳

> **Plataforma Inteligente de Genealogia, Memória e História Familiar**  
> *Do primeiro relato à imortalidade do memorial familiar.*

---

## 🏛️ Visão do Projeto

A **ABINITIA** une a nobreza e rusticidade de uma árvore genealógica secular à vanguarda tecnológica de interfaces modernas (Next.js 14, Canvas interativo com drag-move, inteligência artificial conversacional e captação de áudio e texto).

### Principais Pilares:
1. **Árvore Genealógica Interativa**: Visualização vetorial com nós arrastáveis (drag-move), conexões fluidas de parentesco, níveis de evidência genealógica (Confirmado, Reportado, Inferido, Em Investigação).
2. **Captação Multimodal com Agente IA (AG-001)**: Entrevista conversacional via texto e gravação de voz (Web Audio API), extraindo automaticamente pessoas, datas, locais e eventos para alimentar a árvore.
3. **Memorial & Livro Familiar**: Compilação automática de memórias orais em capítulos editoriais para publicação física ou preservação perpétua.
4. **Governança & Privacy by Design**: Controle estrito de aprovação de novos membros pelo criador da família, convites por ramo e respeito integral à LGPD.

---

## 📂 Estrutura do Repositório

```
abinitia/
├── landing-page/                  # ETAPA 1 — Landing Page Institucional
│   ├── index.html                 # Página de alta conversão (Web + Mobile)
│   ├── css/style.css              # Design System rústico/moderno
│   ├── js/main.js                 # Interatividade e scroll reveal
│   ├── js/tree-animation.js       # Árvore genealógica animada SVG
│   └── assets/                    # Texturas e imagens em alta resolução
│
└── src/                           # ETAPA 2 — Web App Completo (Next.js)
    ├── app/
    │   ├── (auth)/                # Fluxos de Login e Cadastro
    │   │   ├── login/
    │   │   └── cadastro/
    │   ├── (app)/                 # Área Logada & Painel da Família
    │   │   ├── dashboard/         # Métricas, investigações e atalhos
    │   │   ├── agente/            # Chat com IA + Gravador de Áudio + Extração de Fatos
    │   │   ├── busca/             # Busca pública de famílias e solicitação de entrada
    │   │   ├── convites/          # Central de aprovações e validação de parentesco
    │   │   └── familia/[id]/
    │   │       ├── arvore/        # Árvore com Drag-Move, Zoom e Pan
    │   │       ├── pessoas/       # Diretório de pessoas e dossiês
    │   │       ├── timeline/      # Linha do tempo cronológica
    │   │       ├── historias/     # Narrativas (Versão Editorial vs Relato Bruto)
    │   │       ├── livro/         # Livro Familiar e diagramação
    │   │       ├── arquivo/       # Vault de fotos, certidões e áudios
    │   │       └── membros/       # Permissões e gerador de links de convite
    │   ├── layout.tsx
    │   └── globals.css
    ├── lib/mock-data.ts           # Base de dados realista do MVP
    └── types/index.ts             # Tipagem estrita de entidades
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos:
- Node.js 18+ instalado
- Git

### Instalação e Execução:
```bash
# Instalar dependências
npm install

# Rodar o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🌐 Deploy na Vercel

O projeto foi configurado com compatibilidade nativa para a Vercel:
1. Conecte o repositório GitHub `abinitiafamily/abinitia` ao painel da [Vercel](https://vercel.com/abinitia).
2. Configure o Root Directory como `./` (ou selecione a pasta do app).
3. O build command padrão `next build` gerará todas as páginas estáticas e dinâmicas automaticamente.
4. Para apontar o domínio personalizado na Vercel:
   - Vá em **Project Settings > Domains**
   - Insira o domínio adquirido (ex: `abinitia.com.br`)
   - Configure os registros DNS `CNAME` ou `A` no seu provedor de registro.

---

## 📧 Contato do Projeto
- **Repositório:** [https://github.com/abinitiafamily/abinitia](https://github.com/abinitiafamily/abinitia)
- **Vercel Team:** [https://vercel.com/abinitia](https://vercel.com/abinitia)
- **E-mail oficial:** `abinitiafamily@gmail.com`
