# ABINITIA

## Plataforma Inteligente de Genealogia, Memória e História Familiar

**Versão:** 2.0 — Sistema Implementado e em Produção  
**Status:** Produção Ativa (Vercel + Supabase PostgreSQL)  
**Conceito:** Da origem ao legado.  
**Categoria:** Tecnologia • Genealogia • Memória • História Familiar • Inteligência Artificial
**Última Atualização:** Setembro de 2026

---

# 1\. VISÃO DO PROJETO

A ABINITIA será uma plataforma digital destinada a preservar, organizar, investigar e transformar a história das famílias em uma experiência contínua e colaborativa.

A plataforma permitirá que uma pessoa inicie uma árvore genealógica a partir de qualquer geração conhecida — inclusive um avô, bisavô, tio-avô, trisavô ou outro ancestral — e, posteriormente, permita que outros membros da família ingressem na mesma estrutura por meio de convites.

Cada novo participante poderá contribuir com:

- informações genealógicas;
- histórias;
- memórias;
- fotografias;
- documentos;
- áudios;
- vídeos;
- acontecimentos;
- informações sobre antepassados;
- informações sobre descendentes;
- correções e complementações.

A inteligência artificial será utilizada para entrevistar, transcrever, organizar, relacionar, investigar, contextualizar, revisar e transformar o material coletado em uma narrativa histórica familiar.

O resultado será uma **árvore genealógica viva**, uma **linha do tempo familiar**, um **arquivo histórico privado** e, progressivamente, um **livro da família**.

---

# 2\. PROPÓSITO

A ABINITIA nasce de uma ideia simples:

> **Toda família possui uma história, mas grande parte dessa história desaparece quando as pessoas que a conhecem deixam de existir.**

O propósito da ABINITIA é impedir que essas memórias sejam perdidas.

A plataforma deverá transformar relatos individuais em patrimônio histórico familiar, permitindo que diferentes gerações contribuam para uma mesma narrativa.

---

# 3\. CONCEITO CENTRAL

## DA ORIGEM AO LEGADO

A ABINITIA não será apenas uma ferramenta para criar árvores genealógicas.

Ela deverá responder a uma pergunta muito maior:

> **“De onde viemos, quem fomos, quem somos e o que deixaremos para as próximas gerações?”**

A árvore será a estrutura.

As histórias serão a memória.

Os documentos serão as evidências.

A linha do tempo será a trajetória.

O livro será o legado.

---

# 4\. PRINCÍPIO FUNDAMENTAL

## A ÁRVORE PERTENCE À FAMÍLIA

O usuário que inicia uma árvore não será necessariamente o proprietário conceitual da genealogia.

Ele será o **iniciador da estrutura**.

A partir desse momento, outros familiares poderão ser convidados a participar.

Uma árvore poderá crescer em várias direções simultaneamente:

- ascendentes;
- descendentes;
- irmãos;
- tios;
- tios-avôs;
- primos;
- sobrinhos;
- sobrinhos-netos;
- demais relações familiares.

---

# 5\. INÍCIO EM QUALQUER PONTO DA LINHAGEM

A ABINITIA não obrigará o usuário a começar por si mesmo.

O início poderá ocorrer a partir de:

- si próprio;
- pai;
- mãe;
- avô;
- avó;
- bisavô;
- bisavó;
- trisavô;
- trisavó;
- tio;
- tia;
- tio-avô;
- tia-avó;
- outro ancestral conhecido.

Exemplo:

> Uma pessoa conhece apenas o nome de seu bisavô italiano e inicia a árvore a partir dele.

Posteriormente, descendentes desse bisavô poderão entrar na mesma árvore e completar diferentes ramificações.

---

# 6\. USUÁRIO ≠ PESSOA GENEALÓGICA

Essa será uma regra estrutural fundamental.

O sistema deverá distinguir:

### Usuário

Pessoa que possui uma conta e utiliza a plataforma.

### Pessoa Genealógica

Indivíduo pertencente à história familiar registrada na árvore.

Uma pessoa genealógica poderá existir no sistema antes de possuir um usuário associado.

Exemplo:

``` text
PESSOA GENEALÓGICA
João da Silva
Nascimento: 1920
Falecimento: 1988

       ↓ posteriormente

USUÁRIO
Carlos da Silva

       ↓

ASSOCIAÇÃO
“Eu sou João da Silva”
```

A plataforma deverá permitir que um usuário seja associado a uma pessoa já existente, mediante confirmação e regras de segurança.

---

# 7\. ENTRADA POR CONVITE

Qualquer participante autorizado poderá convidar familiares.

Exemplo:

``` text
Árvore iniciada por:

TIO-AVÔ
      │
      ├── FILHO
      │    └── NETO
      │         └── SOBRINHO-NETO
      │
      └── IRMÃO
           └── FILHO
                └── NETO
```

O sobrinho-neto poderá receber um convite e ingressar diretamente na árvore.

Ao entrar, o sistema poderá perguntar:

> “Qual é a sua relação com as pessoas desta árvore?”

A pessoa poderá indicar sua posição e o sistema calculará a relação genealógica correspondente.

---

# 8\. MOTOR DE PARENTESCO

A ABINITIA deverá possuir um motor especializado para cálculo de relações familiares.

O sistema não deverá depender exclusivamente de relações textuais previamente cadastradas.

Ele deverá utilizar a estrutura genealógica para calcular a relação entre duas pessoas.

Exemplos:

- pai;
- mãe;
- filho;
- filha;
- avô;
- avó;
- neto;
- neta;
- bisavô;
- bisavó;
- bisneto;
- bisneta;
- trisavô;
- trisavó;
- tataravô;
- tataravó;
- tio;
- tia;
- tio-avô;
- tia-avó;
- sobrinho;
- sobrinha;
- sobrinho-neto;
- sobrinha-neta;
- primo;
- prima;
- primos de graus subsequentes.

A nomenclatura deverá seguir inicialmente a convenção genealógica/civil adotada para o Brasil, mantendo possibilidade futura de internacionalização.

---

# 9\. PONTO DE OBSERVAÇÃO

O parentesco deverá ser apresentado considerando quem está observando a relação.

Exemplo:

``` text
Antônio
│
├── João
│   └── Carlos
│
└── José
    └── Maria
```

Para Carlos:

José poderá ser identificado como tio-avô.

Para Maria:

João poderá ser identificado como tio-avô.

Portanto, o sistema deverá calcular:

**Pessoa A → relação → Pessoa B**

e também:

**Pessoa B → relação → Pessoa A**

---

# 10\. MODELO DE DADOS CONCEITUAL

A ABINITIA deverá ser estruturada como um **grafo genealógico**, ainda que sua principal visualização seja uma árvore.

Entidades principais:

``` text
FAMÍLIA
   │
   ├── USUÁRIOS
   │
   ├── PESSOAS
   │
   ├── RELACIONAMENTOS
   │
   ├── EVENTOS
   │
   ├── HISTÓRIAS
   │
   ├── DOCUMENTOS
   │
   ├── FOTOGRAFIAS
   │
   ├── ÁUDIOS
   │
   ├── VÍDEOS
   │
   ├── LOCAIS
   │
   ├── LINHA DO TEMPO
   │
   ├── EVIDÊNCIAS
   │
   └── LIVRO
```

---

# 11\. AGENTES DE INTELIGÊNCIA ARTIFICIAL

A ABINITIA deverá trabalhar com uma arquitetura multiagente.

## Agente 01 — ENTREVISTADOR

Responsável pela conversa com o usuário.

Funções:

- realizar entrevistas;
- fazer perguntas;
- identificar informações relevantes;
- aprofundar histórias;
- reconhecer lacunas;
- estimular lembranças;
- solicitar datas, nomes e locais;
- conduzir entrevistas por voz ou texto.

O agente deverá conversar naturalmente.

Ele não deverá parecer um formulário.

---

# 12\. AGENTE GENEALOGISTA

Responsável pela estrutura genealógica.

Funções:

- identificar pessoas;
- estabelecer relações;
- calcular graus de parentesco;
- detectar possíveis duplicidades;
- identificar lacunas;
- organizar ascendentes e descendentes;
- estruturar famílias e ramificações.

---

# 13\. AGENTE INVESTIGADOR

Responsável por identificar o que ainda não foi esclarecido.

Exemplo:

``` text
João da Silva

Nascimento: confirmado
Casamento: confirmado
Filiação: parcialmente confirmada
Local de nascimento: desconhecido
Nome da mãe: desconhecido
```

O agente poderá sugerir novas perguntas.

Também poderá apontar:

> “Existem versões diferentes sobre o ano de nascimento.”

---

# 14\. AGENTE HISTORIADOR

Responsável por contextualizar acontecimentos familiares.

Exemplo:

Relato:

> “Meu avô chegou a Belo Horizonte em 1948.”

A plataforma poderá associar o acontecimento ao contexto histórico daquele período.

A contextualização deverá ser claramente separada do relato familiar.

---

# 15\. AGENTE DE EVIDÊNCIAS

Cada informação relevante deverá possuir uma origem.

Categorias:

### DOCUMENTADA

Com evidência documental.

### RELATO

Informação fornecida por um familiar.

### CONTEXTUALIZAÇÃO

Informação histórica utilizada para contextualizar.

### INFERÊNCIA

Possível conclusão produzida pelo sistema.

### NÃO CONFIRMADA

Informação ainda sem confirmação suficiente.

A IA jamais deverá apresentar uma inferência como fato.

---

# 16\. MEMÓRIA CRUZADA

Quando diferentes familiares relatarem o mesmo acontecimento, a ABINITIA deverá comparar os relatos.

Exemplo:

``` text
Maria:
“Meu pai chegou ao Brasil em 1948.”

Carlos:
“Meu avô chegou em 1949.”

João:
“Acho que foi em 1950.”
```

O sistema deverá identificar:

> **Divergência encontrada**

E preservar as versões.

A plataforma não deverá escolher arbitrariamente uma versão como verdadeira.

---

# 17\. AGENTE REVISOR

Áudios gravados pelo usuário deverão ser transcritos.

A revisão deverá:

- corrigir erros de transcrição;
- melhorar legibilidade;
- preservar a essência;
- preservar fatos;
- preservar personalidade;
- preservar emoção;
- preservar expressões importantes;
- não inventar informações.

O princípio editorial será:

> **Melhorar a forma sem destruir a voz de quem contou.**

---

# 18\. AGENTE EDITORIAL

O agente editorial será responsável pela construção progressiva do livro.

Ele receberá:

- árvore;
- linha do tempo;
- relatos;
- entrevistas;
- documentos;
- fotografias;
- acontecimentos;
- evidências;
- informações históricas.

A partir disso, construirá capítulos e seções.

---

# 19\. LIVRO VIVO

O livro não será necessariamente produzido apenas no final.

Ele será construído progressivamente.

Exemplo:

``` text
LIVRO DA FAMÍLIA

✓ Capítulo 1 — As origens
✓ Capítulo 2 — Os primeiros ancestrais
✓ Capítulo 3 — A chegada ao Brasil
◐ Capítulo 4 — A família no século XX
◐ Capítulo 5 — Os descendentes
○ Capítulo 6 — A geração atual
○ Capítulo 7 — As novas gerações
```

Novas informações poderão modificar e ampliar a obra.

---

# 20\. LINHA DO TEMPO

Cada acontecimento relevante poderá ocupar uma posição temporal.

Exemplo:

``` text
1892
Nascimento do ancestral

1914
Casamento

1918
Nascimento do primeiro filho

1927
Mudança de cidade

1948
Migração

1952
Nascimento do neto

1977
Nascimento de um descendente

2026
Criação da ABINITIA
```

A linha do tempo poderá ser filtrada por:

- pessoa;
- geração;
- ramo familiar;
- local;
- tipo de acontecimento;
- documentos;
- histórias.

---

# 21\. ARQUIVO HISTÓRICO FAMILIAR

Cada família terá um espaço privado para armazenar:

- certidões;
- fotografias;
- cartas;
- documentos;
- diplomas;
- registros;
- vídeos;
- áudios;
- recortes;
- objetos digitalizados;
- documentos históricos.

Os arquivos poderão ser vinculados a pessoas e acontecimentos.

---

# 22\. DOCUMENTAÇÃO E PESQUISA DE CIDADANIA

A ABINITIA poderá possuir um módulo de organização documental.

Exemplo:

``` text
DESCENDENTE
   ↓
PAI
   ↓
AVÔ
   ↓
BISAVÔ
   ↓
TRISAVÔ
   ↓
ANCESTRAL ESTRANGEIRO
```

O sistema poderá indicar:

- documentos encontrados;
- documentos ausentes;
- nomes variantes;
- relações ainda não comprovadas;
- pontos que necessitam investigação.

A ABINITIA deverá deixar claro que a organização de informações não constitui garantia de cidadania ou aconselhamento jurídico.

---

# 23\. IDENTIDADE DA FAMÍLIA

Cada família poderá possuir:

- nome;
- sobrenomes;
- descrição;
- origem;
- símbolo;
- selo;
- fotografias;
- lema;
- cores;
- mapa de origem;
- narrativa histórica.

Caso a família não possua um símbolo, poderá ser criado um **Selo Contemporâneo da Família**, claramente identificado como criação moderna e não como brasão histórico.

---

# 24\. PRIVACIDADE

A ABINITIA deverá nascer sob o princípio de:

## PRIVACY BY DESIGN

Os dados familiares deverão ser tratados como informações privadas.

A plataforma deverá contemplar:

- controle de acesso;
- consentimento;
- permissões;
- autenticação;
- criptografia;
- registro de atividades;
- gestão de documentos;
- controle de compartilhamento;
- proteção de dados pessoais;
- mecanismos compatíveis com a LGPD.

---

# 25\. FAMILY VAULT

Cada família deverá possuir um ambiente privado:

## FAMILY VAULT

Dentro dele estarão:

``` text
ÁRVORE
LINHA DO TEMPO
PESSOAS
HISTÓRIAS
DOCUMENTOS
FOTOS
ÁUDIOS
VÍDEOS
LIVRO
CONFIGURAÇÕES
PERMISSÕES
```

---

# 26\. PERFIS DE ACESSO

Possíveis níveis:

### Administrador da Família

Gerencia a estrutura e permissões.

### Editor

Pode editar informações autorizadas.

### Contribuidor

Pode adicionar histórias, documentos e informações.

### Participante

Pode responder entrevistas e contribuir conforme autorização.

### Leitor

Pode visualizar o conteúdo permitido.

As permissões deverão ser detalhadas por categoria de informação.

---

# 27\. PRINCÍPIO DE NÃO EXPOSIÇÃO EXTERNA

As informações familiares não deverão ser publicadas externamente por padrão.

O compartilhamento deverá ser:

**opt-in**

e não:

**opt-out**.

O usuário deverá saber exatamente:

- o que está compartilhando;
- com quem;
- para qual finalidade;
- por quanto tempo;
- se pode revogar o compartilhamento.

---

# 28\. EXPERIÊNCIA MOBILE

O aplicativo mobile será principalmente o ambiente de:

**CONVERSA + MEMÓRIA + CONTRIBUIÇÃO.**

Funções:

- conversar com o agente;
- gravar áudio;
- responder perguntas;
- enviar fotos;
- enviar documentos;
- registrar acontecimentos;
- visualizar pessoas relacionadas;
- receber convites;
- acompanhar a evolução da família.

---

# 29\. EXPERIÊNCIA WEB

O site/app web será principalmente o ambiente de:

**VISUALIZAÇÃO + ORGANIZAÇÃO + INVESTIGAÇÃO + EDIÇÃO.**

Principais áreas:

- dashboard familiar;
- árvore;
- timeline;
- pessoas;
- mapa;
- documentos;
- histórias;
- arquivo;
- livro;
- investigações;
- pendências;
- membros da família.

---

# 30\. DASHBOARD DA FAMÍLIA

Exemplo:

``` text
ABINITIA
Família Silva

Pessoas: 284
Gerações: 7
Histórias: 126
Documentos: 342
Fotografias: 817
Áudios: 58
Eventos: 193

Livro:
72% concluído

Pendências:
14 informações para investigar

Novos colaboradores:
3
```

---

# 31\. ÁRVORE GENEALÓGICA VIVA

A visualização deverá permitir:

- zoom;
- navegação;
- expansão de ramos;
- recolhimento;
- busca;
- filtros;
- seleção de pessoa;
- visualização de relações;
- acesso às histórias;
- acesso aos documentos.

Ao selecionar uma pessoa:

``` text
João da Silva

Pai: Antônio
Mãe: Maria

Cônjuge: Ana

Filhos: 3

Histórias: 12
Documentos: 8
Fotografias: 23

Parentes:
Tio-avô
Primos
Sobrinhos
Descendentes
```

---

# 32\. PRINCÍPIO DE CONTINUIDADE GERACIONAL

A ABINITIA deverá ser concebida para permanecer útil durante décadas.

Uma criança que hoje aparece como descendente poderá, no futuro:

- assumir seu perfil;
- contar sua própria história;
- acrescentar seus filhos;
- adicionar novos documentos;
- continuar o livro familiar.

Assim:

> **A história não termina com a publicação do livro.**

Ela continua.

---

# 33\. REGRAS FUNDAMENTAIS DE NEGÓCIO

### RB-001

Uma família poderá ser iniciada a partir de qualquer pessoa conhecida.

### RB-002

O iniciador não será necessariamente o proprietário de todas as informações.

### RB-003

Uma pessoa genealógica poderá existir sem usuário associado.

### RB-004

Um usuário poderá ser associado a uma pessoa genealógica existente mediante confirmação.

### RB-005

Uma árvore poderá possuir múltiplos colaboradores.

### RB-006

Uma pessoa poderá contribuir para diferentes ramificações autorizadas.

### RB-007

O parentesco deverá ser calculado pela estrutura genealógica.

### RB-008

Divergências deverão ser preservadas e identificadas.

### RB-009

Informações não confirmadas não poderão ser apresentadas como fatos documentados.

### RB-010

Documentos poderão ser associados a pessoas, relações e eventos.

### RB-011

Histórias poderão ser associadas a uma ou mais pessoas.

### RB-012

Áudios poderão originar transcrições e posteriormente narrativas editoriais.

### RB-013

A família terá controle sobre permissões e compartilhamentos.

### RB-014

O livro será construído a partir dos dados autorizados pela família.

### RB-015

Novas gerações poderão continuar a estrutura familiar.

---

# 34\. MVP — PRIMEIRA VERSÃO

A primeira versão não deverá tentar implementar todo o conceito.

O MVP deverá provar o núcleo mágico da ABINITIA:

## MVP 1

### Cadastro

- usuário;
- família;
- primeira pessoa;
- relação inicial.

### Árvore

- pessoas;
- pais;
- filhos;
- irmãos;
- relacionamentos.

### Convite

- geração de convite;
- entrada de familiar;
- associação à árvore existente.

### Agente

- conversa;
- perguntas;
- coleta de informações;
- memória contextual.

### Áudio

- gravação;
- transcrição;
- armazenamento.

### Timeline

- criação automática de eventos.

### Histórias

- armazenamento;
- revisão;
- associação a pessoas.

### Livro

- geração inicial de capítulos.

### Privacidade

- autenticação;
- família privada;
- permissões básicas.

---

# 35\. A EXPERIÊNCIA MÁGICA

O primeiro momento mágico deverá acontecer quando o usuário perceber que não está preenchendo uma árvore.

Ele está **conversando com alguém que quer conhecer sua família**.

Exemplo:

> “Vamos começar pelo seu avô. O que você lembra dele?”

O usuário responde por áudio.

A plataforma transcreve.

O agente identifica:

- pessoa;
- data;
- local;
- profissão;
- acontecimento;
- emoção;
- possíveis relações.

Depois apresenta:

> **Encontrei 4 novas informações sobre sua família.**

E:

> **Sua árvore ganhou uma nova geração.**

Posteriormente:

> **Sua história está começando a tomar forma.**

Esse é o núcleo emocional da ABINITIA.

---

# 36\. VISÃO FUTURA

Após o MVP, poderão ser adicionados:

- mapas migratórios;
- reconhecimento de documentos;
- OCR;
- análise de fotografias;
- restauração assistida;
- identificação de pessoas em fotografias;
- pesquisa documental;
- integração com bases genealógicas;
- traduções;
- múltiplos idiomas;
- árvore colaborativa avançada;
- impressão profissional do livro;
- livros por ramo familiar;
- livros por geração;
- memorial digital;
- cápsulas do tempo;
- mensagens para futuras gerações;
- narrativas em áudio;
- documentários familiares;
- experiências imersivas;
- integração com IA multimodal.

---

# 37\. POSICIONAMENTO

A ABINITIA não deverá ser apresentada simplesmente como:

> “um aplicativo para fazer árvore genealógica.”

O posicionamento deverá ser:

> **ABINITIA é uma plataforma inteligente que transforma memórias, documentos e histórias familiares em uma árvore genealógica viva e em um legado histórico para as próximas gerações.**

---

# 38\. FRASE-MANIFESTO

> **Comece onde você estiver.**
>
> **Descubra de onde veio.**
>
> **Conecte quem veio antes.**
>
> **Conte o que foi vivido.**
>
> **Preserve para quem ainda virá.**
>
> **ABINITIA — Da origem ao legado.**

---

# 39\. PRÓXIMA ETAPA DO PROJETO

Este documento deverá evoluir para os seguintes documentos técnicos:

### Dossiê 02

**Especificação Funcional e Requisitos**

### Dossiê 03

**Arquitetura Técnica**

### Dossiê 04

**Modelo de Banco de Dados**

### Dossiê 05

**Arquitetura Multiagente de IA**

### Dossiê 06

**UX/UI e Design System**

### Dossiê 07

**Segurança, Privacidade e LGPD**

### Dossiê 08

**Roadmap e MVP**

### Dossiê 09

**Modelo de Negócio**

### Dossiê 10

**Especificação Editorial do Livro Familiar**

A ABINITIA deverá ser desenvolvida inicialmente como um sistema modular, permitindo que cada componente evolua sem comprometer o núcleo genealógico.

**Documento de referência:** ABINITIA — Plataforma Inteligente de Genealogia, Memória e História Familiar.

**Conceito:** Da origem ao legado.

---

# 40\. INVENTÁRIO DO SISTEMA IMPLEMENTADO E EM PRODUÇÃO (VERSÃO 2.0)

Abaixo encontra-se o registro oficial e consolidado de toda a infraestrutura, módulos de produto, arquitetura de dados e recursos já construídos, testados e disponíveis no ambiente de produção da ABINITIA.

---

## 40.1. URLs OFICIAIS E AMBIENTES DE PRODUÇÃO

* **Aplicação Web em Produção:** [https://abinitia-dev.vercel.app](https://abinitia-dev.vercel.app)
* **URL Direta do Deployment (Vercel):** [https://abinitia-f8bsbjmma-abinitia.vercel.app](https://abinitia-f8bsbjmma-abinitia.vercel.app)
* **Repositório Oficial no GitHub:** [https://github.com/abinitiafamily/abinitia](https://github.com/abinitiafamily/abinitia)
* **Banco de Dados Supabase (PostgreSQL 17.6):** `https://ucvicxjvcsojpbwkydkf.supabase.co`
* **API de Health Check e Monitoramento:** [https://abinitia-dev.vercel.app/api/health](https://abinitia-dev.vercel.app/api/health)

---

## 40.2. ETAPA 1 — LANDING PAGE INSTITUCIONAL & DESIGN SYSTEM

Desenvolvida com foco em impacto estético nobre, imersão emocional e alta performance.

1. **Identidade Visual & Tipografia Renascentista:**
   - Paleta cromática inspirada em pergaminhos nobres, ouro velho e heráldica (`#C68B2E`, `#8B5E1A`, `#1a0f05`, `#fbf8f2`).
   - Fontes Google: *Playfair Display* (títulos nobres), *Crimson Text* (corpo de texto narrativo/editorial) e *Inter* (interface moderna).
2. **Hero com Árvore Animada Interativa em HTML5 Canvas (`tree-animation.js`):**
   - Simulação fractal e orgânica de ramificações genealógicas desenhando-se em tempo real na tela.
   - Partículas douradas e nós interativos com efeito hover e física de profundidade.
3. **10 Seções de Apresentação:**
   - **Hero Section:** Mensagem central *"Da origem ao legado"* com CTAs dinâmicos.
   - **O Que É a ABINITIA:** Manifesto emocional sobre a preservação da memória familiar.
   - **Pilares Centrais:** Árvore Viva, Arquivo Histórico, Linha do Tempo e Livro da Família.
   - **Como Funciona:** Fluxo em 4 passos (Início ancestral, Convites, IA Investigativa, Criação do Livro).
   - **O Livro Familiar:** Demonstração visual da diagramação editorial impressa e digital.
   - **Agente Genealógico com IA:** Apresentação da interface conversacional de extração de relatos.
   - **Casos de Uso Reais:** 35 cenários de aplicação prática para famílias.
   - **Tabela de Planos e Preços:** Planos Memória, Legado e Dinastia.
   - **Depoimentos e Prova Social:** Avaliações de famílias participantes.
   - **FAQ (Perguntas Frequentes):** Acordeão interativo com respostas sobre privacidade, LGPD e herança digital.

---

## 40.3. ETAPA 2 — APLICAÇÃO WEB (WEB APP NEXT.JS 16 COM APP ROUTER)

Construída em Next.js 16 com Turbopack, TypeScript rigoroso e CSS Modules encapsulado.

### 1. Autenticação e Entrada (`/login`, `/cadastro`)
* Fluxos de login e registro com design integrado ao tema nobre da plataforma.
* Redirecionamento automático e contextual para o painel principal.

### 2. Painel Central / Dashboard (`/dashboard`)
* Resumo executivo com métricas familiares: total de pessoas catalogadas, gerações ativas, histórias registradas, documentos anexados e progresso percentual de composição do Livro Familiar.
* Seletor rápido de famílias para usuários com múltiplos ramos ou genealogias.
* Painel de atalhos rápidos para Árvore, Investigação, Linha do Tempo, Arquivo e Agente.

### 3. Árvore Genealógica Interativa (`/familia/[id]/arvore`)
* **Navegação Gráfica Completa:** Visualização em nós com suporte a pan, zoom in/out e centralização.
* **Agrupamento por Gerações:** Renderização de ascendentes (pais, avós), colaterais (cônjuges, irmãos) e descendentes (filhos, netos).
* **Selos de Evidência Visual:**
  - `CONFIRMED` (Verde esmeralda): Fato atestado por documento oficial.
  - `REPORTED` (Azul celeste): Relato oral de membro da família.
  - `INFERRED` (Amarelo âmbar): Dedução lógica calculada pelo sistema.
  - `UNCONFIRMED` (Cinza neutro): Informação preliminar pendente.
  - `INVESTIGATING` (Púrpura nobre): Em processo de busca documental ativa.
* **Brasão e Lema Familiar:** Exibição do escudo heráldico da família com lema editável diretamente na interface da árvore.
* **Modal de Pessoa:** Ficha biográfica rápida ao clicar em qualquer nó, com acesso direto a fotos, histórias e edição.

### 4. Caderno de Investigações Genealógicas (`/familia/[id]/investigacoes`)
* Central dedicada à resolução de lacunas históricas (antepassados misteriosos, certidões não localizadas, registros de imigração).
* Organização por status de investigação: *Aberto*, *Em Andamento*, *Resolvido* e *Encerrado*.
* Registro estruturado de **Hipóteses Levantadas**, **Achados Documentais** e **Fontes Consultadas** (cartórios, paróquias, portais e arquivos públicos).

### 5. Linha do Tempo Biográfica e Histórica (`/familia/[id]/timeline`)
* Linha do tempo cronológica com marcos de nascimento, casamentos, viagens migratórias, realizações profissionais e falecimentos.
* **Camada de Contexto Histórico Paralelo:** Eventos históricos mundiais e nacionais inseridos na cronologia da família (ex: Guerras Mundiais, Abolição da Escravidão, Grande Imigração) para humanizar a trajetória dos ancestrais.

### 6. Histórias e Relatos Orais (`/familia/[id]/historias`)
* Repositório de crônicas familiares, memórias afetivas e transcrições de entrevistas.
* Controle de visibilidade editorial: *Privada*, *Compartilhada na Família* ou *Destinada ao Livro*.

### 7. Arquivo Histórico de Evidências (`/familia/[id]/arquivo`)
* Guarda digital de certidões (nascimento, batismo, casamento, óbito), cartas antigas, fotos restauradas, documentos oficiais e áudios.
* Sistema de tags, categorização e associação direta a pessoas da árvore.

### 8. Estúdio do Livro da Família (`/familia/[id]/livro`)
* Compilação editorial automatizada em capítulos cronológicos e geracionais.
* Status editorial por capítulo (*Rascunho*, *Revisão*, *Pronto para Publicação*).
* Visualização prévia da diagramação em padrão livro de arte/memória.

### 9. Agente Genealógico com IA (`/agente`)
* Interface conversacional onde o membro da família relata memórias e conta causos orais ou por texto.
* Extração automatizada de entidades: datas, parentescos, locais e fatos biográficos prontos para validação e incorporação na árvore.

### 10. Gestão de Membros e Governança Familiar (`/familia/[id]/membros`)
* Matriz de papéis familiares:
  - `ADMIN`: Administrador e guardião da árvore.
  - `EDITOR`: Permissão total de adição e revisão de dados.
  - `CONTRIBUTOR`: Pode adicionar suas próprias memórias e fotos.
  - `PARTICIPANT`: Membro vinculado a um nó com permissão de comentários.
  - `READER`: Acesso exclusivo para leitura e apreciação.

### 11. Sistema de Convites e Códigos Seguros (`/convites`)
* Geração de convites protegidos com códigos alfanuméricos únicos.
* Vinculação de convite a uma pessoa genealógica específica (ex: convidar a prima para assumir seu próprio nó na árvore).

### 12. Busca Global de Famílias (`/busca`)
* Localizador de linhagens e sobrenomes abertos para colaboração entre ramos distantes.

### 13. Configurações da Família e Trilha de Auditoria (`/familia/[id]/configuracoes`)
* Gestão de brasão, lema, descrição, origem e status público/privado.
* **Audit Trail Completo:** Histórico imutável de todas as modificações, garantindo a integridade e a preservação contra perdas acidentais de dados genealógicos.

---

## 40.4. ETAPA 3 — BANCO DE DADOS POSTGRESQL & SEGURANÇA SUPABASE

O sistema opera sobre o **Supabase PostgreSQL 17.6** (Região AWS São Paulo `sa-east-1`), projetado com arquitetura relacional e conformidade com LGPD.

### 1. 14 Tabelas Estruturais Criadas e Indexadas:
1. `profiles`: Dados públicos de perfil dos usuários autenticados.
2. `families`: Linhagens familiares cadastradas, metadados heráldicos e visibilidade.
3. `family_members`: Vínculos de usuários às famílias com RBAC (Role-Based Access Control).
4. `persons`: Indivíduos genealógicos (nascimento, óbito, gênero, biografia, fotos, status de evidência).
5. `relationships`: Arestas genealógicas (`PARENT_CHILD`, `SPOUSE`, `SIBLING`, `ADOPTED`).
6. `timeline_events`: Eventos biográficos e contextuais históricos.
7. `stories`: Histórias, transcrições, áudios e visibilidade editorial.
8. `documents`: Documentos probatórios, certidões, fotos em alta resolução e metadados.
9. `investigations`: Caderno de investigações, hipóteses, achados e fontes.
10. `book_chapters`: Capítulos do livro estruturados por gerações e ramos.
11. `invitations`: Códigos de convite temporários e seguros.
12. `join_requests`: Solicitações de novos membros para ingressar em uma família existente.
13. `audit_logs`: Trilha de auditoria e registro de mutações no banco.
14. `agent_messages`: Conversas e payloads estruturados do Agente de IA.

### 2. Segurança RLS (Row Level Security):
* **RLS Ativado em 100% das Tabelas.**
* **56 Políticas de Segurança Estritas:** Nenhuma política permissiva genérica; escrita restrita a usuários autenticados (`auth.uid() IS NOT NULL`), validação de integridade nos pedidos de entrada (`join_requests`) e privacidade por família.
* **Acesso Administrativo Seguro:** Suporte a conexões de servidor com Service Role Key para operações em lote com bypass seguro de RLS.

### 3. Dados Iniciais de Demonstração (Seed):
* Linhagem da **Família Ferraro** cadastrada com 3 gerações completas (Giovanni, Maria, Antonio, Helena, Rosa, Carlos Alberto e Beatriz Ferraro).
* Relacionamentos conjugais e de filiação interligados.
* Eventos da Linha do Tempo (imigração a partir de Nápoles em 1888, abertura da primeira mercearia na Mooca em 1920) e contexto histórico nacional.
* Dossiê de investigação com busca por certidão de batismo no Arquivo Diocesano de Nápoles.

---

## 40.5. INTEGRAÇÃO E PIPELINE CONTÍNUO (CI/CD)

* **Controle de Versão:** Todo o código-fonte, scripts de migração (`migrate-schema.js`), rotinas de seed (`seed-db.js`) e configuração de RLS (`enable-rls.js`, `fix-rls-policies.js`) estão versionados no GitHub.
* **Deploy Automático:** Qualquer alteração na branch `main` dispara automaticamente o build otimizado com Next.js Turbopack na infraestrutura Vercel edge global.
* **Monitoramento Ativo:** Endpoint `/api/health` conectado ao pooler Postgres para verificação contínua de latência e contagem de registros em produção.