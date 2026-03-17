# Visangol ERP

Sistema de Gestão (ERP) desenvolvido com React, TypeScript, Tailwind CSS e Firebase.

## 🚀 Preparação do Ambiente (Pop!_OS / Linux)

Para rodar este projeto localmente no seu Pop!_OS e desenvolver usando o VS Code, siga os passos abaixo:

### 1. Instalar o Node.js e NPM
Recomendamos o uso do NVM (Node Version Manager) para gerenciar as versões do Node.js:
```bash
# Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Recarregar o terminal ou rodar:
source ~/.bashrc # ou source ~/.zshrc

# Instalar a versão LTS do Node.js
nvm install --lts
nvm use --lts
```

### 2. Clonar e Instalar Dependências
Abra o terminal na pasta onde deseja salvar o projeto e rode:
```bash
# Instalar as dependências do projeto
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
```bash
cp .env.example .env
```
Abra o arquivo `.env` no VS Code e preencha com as suas credenciais do Firebase/Gemini (se aplicável).

### 4. Abrir no VS Code
```bash
code .
```
O projeto já vem com configurações prontas para o VS Code (`.vscode/`). Ao abrir o projeto, o VS Code sugerirá a instalação das extensões recomendadas (Tailwind CSS, Prettier, ESLint). Aceite para ter a melhor experiência de desenvolvimento!

### 5. Rodar o Servidor de Desenvolvimento
```bash
npm run dev
```
O projeto estará rodando em `http://localhost:3000`.
