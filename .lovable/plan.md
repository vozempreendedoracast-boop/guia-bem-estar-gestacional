

# Lovable Publish vs Vercel: Comparação

## Lovable Publish (Recomendado para seu caso)

**Como funciona**: Clique em "Publish" no canto superior direito do editor.

| Aspecto | Detalhes |
|---------|----------|
| **Custo** | Incluído no plano Lovable (sem custo extra) |
| **Domínio** | Subdomínio `.lovable.app` grátis; domínio custom em planos pagos |
| **Backend** | Edge Functions e banco Supabase já integrados e deployados automaticamente |
| **SSL** | Automático |
| **Setup** | Zero configuração — um clique |
| **CI/CD** | Cada prompt aplica mudanças e publica backend automaticamente |

**Vantagens**:
- Tudo integrado: frontend + Edge Functions + Supabase num único lugar
- Suas Edge Functions (webhook Kiwify, chat, admin-users) já estão deployadas automaticamente
- Domínio custom suportado
- Sem necessidade de configurar variáveis de ambiente separadamente

**Desvantagens**:
- Menos controle sobre infraestrutura avançada (CDN, rewrite rules)
- Sem suporte a SSR (é SPA/Vite)

---

## Vercel

| Aspecto | Detalhes |
|---------|----------|
| **Custo** | Plano Hobby grátis (limites); Pro a partir de US$ 20/mês |
| **Domínio** | `.vercel.app` grátis; custom em qualquer plano |
| **Backend** | Não hospeda Supabase Edge Functions — precisaria manter no Lovable Cloud de qualquer forma |
| **Setup** | Requer conectar GitHub, configurar build, variáveis de ambiente manualmente |

**Vantagens**:
- CDN global de alta performance
- Controle avançado de headers, redirects, middlewares
- Analytics integrado (plano Pro)

**Desvantagens**:
- **Suas Edge Functions continuariam no Lovable Cloud** — deploy dividido em dois lugares
- Configuração manual de env vars (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, etc.)
- Custo adicional se precisar do plano Pro
- Mais complexidade sem benefício real para SPAs simples

---

## Recomendação

Para o MamyBoo, **use o Lovable Publish**. Motivos:

1. Seu backend (webhook Kiwify, chat IA, admin) já está deployado no Lovable Cloud
2. Zero configuração extra
3. Sem custo adicional
4. Depois de publicar, basta configurar os secrets do Kiwify e os links de checkout

A Vercel faria sentido se você precisasse de SSR (Next.js) ou já tivesse infraestrutura lá — não é o caso.

