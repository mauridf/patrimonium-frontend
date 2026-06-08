# 🏠 Patrimonium Frontend

Frontend do sistema de gestão imobiliária Patrimonium.

## 🚀 Tecnologias

- **Angular 20** com Standalone Components
- **Angular Material** para UI
- **TypeScript** estrito
- **RxJS** para reatividade
- **NgxMask** para máscaras de input

## 📋 Pré-requisitos

- Node.js 18+ 
- npm 9+
- Angular CLI (`npm install -g @angular/cli`)

## 🔧 Instalação

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/patrimonium-frontend.git
cd patrimonium-frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start
```

Acesse: `http://localhost:4200`

## 📦 Build de Produção

```bash
npm run build:prod
```

Arquivos gerados em: `dist/patrimonium-frontend/browser/`

## 🌐 Deploy

O deploy é feito automaticamente no **Render** via GitHub.

- **URL Produção:** https://patrimonium-frontend.onrender.com
- **Branch:** `main`
- **Build Command:** `npm install && npm run build:prod`
- **Publish Directory:** `dist/patrimonium-frontend/browser`

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── core/           # Serviços, guards, interceptors
│   ├── features/       # Funcionalidades (dashboard, persons, properties...)
│   ├── shared/         # Componentes reutilizáveis, pipes
│   └── layout/         # Layouts (auth, main)
├── environments/       # Configurações por ambiente
└── styles.scss         # Estilos globais
```

## 🔗 API Backend

- **URL:** https://patrimonium-api.onrender.com
- **Documentação:** https://patrimonium-api.onrender.com/scalar/v1
```