

# Plano: Monetização MamyBoo com Kiwify

## O que já existe

| Módulo | Status |
|--------|--------|
| Dashboard, Jornada (40 semanas), Sintomas, Exercícios, Saúde, Diário | Funcionando com Supabase |
| Assistente IA (OpenRouter + Lovable fallback) | Funcionando |
| Página de vendas (`/vendas`) | Existe, mas genérica (sem planos, sem preços) |
| Onboarding / Perfil | Funcionando via localStorage (sem auth real) |
| Admin Panel | Funcionando com CRUD completo |
| Autenticação Supabase | **Não implementada** — tudo local |
| Controle de acesso por plano | **Não existe** |
| Integração de pagamento | **Não existe** |
| Tabela de usuários/planos | **Não existe** |

## O que será construído

### 1. Banco de dados (migrações)

- **Tabela `user_profiles`**: `id`, `user_id` (ref auth.users), `email`, `plan` (essential/premium/none), `plan_status` (active/expired/none), `kiwify_order_id`, `purchased_at`, `expires_at`, `created_at`, `updated_at`
- **Tabela `ai_usage`**: `id`, `user_id`, `messages_count`, `month_year` (ex: "2026-03"), `created_at`
- **RLS**: usuários leem/atualizam apenas seus próprios dados; service_role pode tudo (para o webhook)
- **Trigger**: auto-criar profile no signup via `auth.users`

### 2. Edge Function: Webhook Kiwify (`supabase/functions/kiwify-webhook/index.ts`)

- Recebe POST da Kiwify
- Valida assinatura (header `X-Kiwify-Signature` com HMAC SHA256)
- Confirma `status === "approved"`
- Identifica produto → mapeia para plano (essential ou premium)
- Cria usuário no Supabase Auth via `admin.createUser()` (ou atualiza plano se já existe)
- Insere/atualiza `user_profiles`
- Gera magic link via `admin.generateLink()` 
- Retorna URL do magic link para Kiwify redirecionar (ou envia por email)

Secret necessário: `KIWIFY_WEBHOOK_SECRET` (será solicitado ao usuário)

### 3. Autenticação Supabase

- Componente `AuthProvider` com `onAuthStateChange` + `getSession`
- Página `/login` com magic link (email)
- Proteção de rotas: redirecionar para `/login` se não autenticado
- Migrar dados do localStorage para o perfil Supabase após login
- Atualizar `PregnancyContext` para usar auth + `user_profiles`

### 4. Página de Planos (`/planos`)

- Layout responsivo com dois cards lado a lado
- **Essencial (R$ 47)**: lista de benefícios, botão → link checkout Kiwify
- **Premium (R$ 97)**: badge "Mais escolhido", destaque visual, lista completa, botão → link checkout Kiwify
- Selo de pagamento seguro, garantia, FAQ
- Design: bordas arredondadas, sombras suaves, cores rosado/lilás

### 5. Controle de acesso por plano

- Hook `usePlan()` que lê `user_profiles.plan` do Supabase
- Middleware/guard no `Assistant.tsx`: se plano !== premium → tela de upgrade
- Limite técnico invisível: 300 msgs/mês na `ai_usage` (verificado na edge function `chat`)
- Componente `UpgradePrompt` para mostrar quando bloqueado

### 6. Atualização da página de vendas

- Reformular `/vendas` com os dois planos, preços e CTAs direcionando para `/planos`
- Remover referências a "grátis"

### 7. Fluxo completo

```text
Usuária → /planos → Escolhe plano → Redirect Kiwify
                                          ↓
                                   Pagamento aprovado
                                          ↓
                              Kiwify envia webhook → Edge Function
                                          ↓
                              Cria user + profile + magic link
                                          ↓
                              Usuária recebe email → clica → logada
                                          ↓
                                      /cadastro → /painel
```

## Ordem de implementação

1. Migrações DB (tabelas + RLS + trigger)
2. Secret `KIWIFY_WEBHOOK_SECRET`
3. Edge Function webhook Kiwify
4. AuthProvider + página de login
5. Hook `usePlan()` + proteção do Assistente IA
6. Atualizar edge function `chat` com limite de 300 msgs/mês
7. Página `/planos` com design premium
8. Atualizar `/vendas`, Index e navegação
9. Atualizar Admin com dados reais de usuárias

