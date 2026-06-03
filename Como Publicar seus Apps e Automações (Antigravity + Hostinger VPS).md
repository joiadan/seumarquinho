# Como Publicar seus Apps e Automações (Antigravity + Hostinger VPS)

Este guia prático orienta você no processo de conectar a sua IDE **Antigravity** à sua **VPS Hostinger** utilizando o **Coolify** para publicar e gerenciar o site **Seu Marquinho** e outras automações em produção.

---

## 🗺️ Visão Geral da Arquitetura

O fluxo de publicação funciona de forma automatizada e integrada:

```mermaid
graph LR
    Local[Sua Máquina / Antigravity] -->|Git Push| GitHub[Repositório Git]
    GitHub -->|Webhook/Deploy| Coolify[Coolify na Hostinger VPS]
    Coolify -->|Build & Run| Container[Docker Container (Next.js)]
    Antigravity -.->|Coolify MCP| Coolify
```

1. **Antigravity**: A IDE local onde você desenvolve o código e dispara comandos.
2. **GitHub/GitLab**: Armazena o código e notifica o Coolify sobre novos updates.
3. **Coolify**: Plataforma autohospedada na VPS Hostinger que compila e roda a aplicação em containers Docker.
4. **Coolify MCP**: Permite à IA do Antigravity listar recursos, monitorar logs e disparar novos builds diretamente pelo chat.

---

## 🛠️ Passo 1: Preparando o Projeto Next.js Localmente

O Coolify trabalha melhor utilizando o fluxo de **Git Deploy**. Vamos configurar o Git na pasta do seu projeto.

1. **Abra o terminal** na pasta do projeto `SITE SEU MARQUINHO` e rode os comandos abaixo para inicializar o repositório local:
   ```bash
   git init
   git add .
   git commit -m "First commit: Next.js setup"
   ```
2. **Crie um repositório** (público ou privado) no seu GitHub (ex: `site-seu-marquinho`).
3. **Conecte o repositório local ao GitHub** e faça o primeiro push:
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   git branch -M main
   git push -u origin main
   ```

---

## 🖥️ Passo 2: Configurando sua VPS Hostinger com Coolify

Caso você ainda não tenha o Coolify instalado na sua VPS da Hostinger:

1. **Obtenha o IP da VPS**: Acesse o painel da Hostinger -> VPS -> Gerenciar VPS e copie o **Endereço IP** (ex: `185.222.111.99`).
2. **Conecte-se via SSH**:
   ```bash
   ssh root@IP_DA_SUA_VPS
   ```
3. **Instale o Coolify** rodando o comando oficial de instalação em seu terminal SSH (certifique-se de que a VPS possui Ubuntu 22.04 LTS ou superior):
   ```bash
   curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
   ```
4. **Acesse o painel do Coolify** pelo navegador:
   * Abra no seu navegador o endereço: `http://IP_DA_SUA_VPS:8000`
   * Crie sua conta de administrador no primeiro acesso.

---

## 🔗 Passo 3: Conectando o Antigravity ao Coolify (MCP Server)

Nós já criamos o arquivo de configuração para você em `C:\Users\jorda\.gemini\antigravity-ide\mcp_config.json` com a chave do seu token. Porém, você precisa preencher o endereço da sua VPS no campo `COOLIFY_BASE_URL`.

1. Abra o arquivo [mcp_config.json](file:///C:/Users/jorda/.gemini/antigravity-ide/mcp_config.json) na IDE.
2. Substitua o placeholder `https://your-coolify-instance.com` pelo endereço real da sua VPS (incluindo a porta `:8000` se não tiver domínio próprio configurado). Exemplo:
   ```json
   {
     "mcpServers": {
       "coolify": {
         "command": "npx",
         "args": ["-y", "@masonator/coolify-mcp"],
         "env": {
           "COOLIFY_ACCESS_TOKEN": "1|izOk577nzQMrQiOoi7rKK0JOQrvnP4c2FFK0hRhvad4eb682",
           "COOLIFY_BASE_URL": "http://IP_DA_SUA_VPS:8000"
         }
       }
     }
   }
   ```
3. Salve o arquivo e reinicie a IDE para aplicar as configurações do MCP.

---

## 🚀 Passo 4: Publicando o site Next.js no Coolify

Com o painel do Coolify aberto no seu navegador (`http://IP_DA_SUA_VPS:8000`):

1. **Adicione uma fonte Git**:
   * Vá em **Sources** -> **Add New Source** -> Escolha **GitHub App** ou **Deploy Key** (para repositórios privados). 
   * Siga as instruções rápidas na tela para autorizar o Coolify a acessar os seus repositórios do GitHub.
2. **Crie um Novo Projeto**:
   * Vá em **Projects** -> **Add New Project**.
   * Dê o nome de `Seu Marquinho`.
3. **Crie a Aplicação Next.js**:
   * Clique em **Add New Resource** -> **Public Repository** ou **Private Repository**.
   * Selecione o repositório `site-seu-marquinho` e a branch `main`.
   * O Coolify detectará automaticamente que é um projeto Next.js e usará a tecnologia **Nixpacks** para fazer o build sem requerer nenhuma configuração de Dockerfile!
4. **Configurações Importantes no Painel**:
   * **Domain**: Digite o domínio que você deseja usar (ex: `https://seumarquinho.com.br`). Se não tiver um domínio ainda, você pode usar o domínio wildcard gratuito gerado pelo Coolify clicando em *Generate UUID Domain*.
   * **Ports**: O Next.js roda na porta `3000` por padrão. Certifique-se de que a porta configurada no Coolify seja `3000`.
   * **Environment Variables**: Se o projeto precisar de alguma variável de ambiente, adicione-a na aba *Environment Variables* do recurso no Coolify.
5. **Clique em Deploy**:
   * Clique no botão **Deploy** no canto superior direito do painel.
   * O Coolify começará a compilar e implantar sua aplicação Next.js. O SSL (HTTPS) será gerado automaticamente pelo Traefik embutido no Coolify.

---

## 🔄 Passo 5: Atualizações Automáticas (CI/CD)

Toda vez que você terminar uma alteração local no seu site pelo Antigravity:
1. Salve os arquivos e faça o push:
   ```bash
   git add .
   git commit -m "update: melhorias no layout"
   git push
   ```
2. O Coolify detectará o push no GitHub automaticamente via Webhook e fará o deploy da nova versão sem que você precise fazer nada!

---

## 💬 Usando a IA para Controlar o Deploy

Uma vez que o servidor MCP do Coolify esteja rodando com o IP correto, você poderá mandar mensagens para mim como:
* *"Como está o status do build do site?"*
* *"Dispare um novo deploy para o projeto Seu Marquinho"*
* *"Mostre os logs de erro da aplicação"*

E a IA conseguirá consultar a API do Coolify diretamente na sua VPS para responder e agir para você!
