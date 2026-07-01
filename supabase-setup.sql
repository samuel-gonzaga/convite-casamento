-- ============================================================
-- Convite Ana & Lucas — setup do banco (Supabase / Postgres)
-- Rode este script em: Supabase > SQL Editor > New query > Run
-- ============================================================

-- 1) Tabela das confirmações de presença (RSVP)
create table if not exists public.rsvp (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  nome        text not null,
  telefone    text not null,
  presenca    text not null check (presenca in ('Sim', 'Não')),
  quantidade  int  check (quantidade between 1 and 4),  -- só quando presenca = 'Sim'
  restricao   text,
  mensagem    text
);

-- 2) Liga a segurança por linha (Row Level Security)
alter table public.rsvp enable row level security;

-- 3) Políticas de acesso
--    a) Qualquer visitante pode ENVIAR uma confirmação (insert),
--       mas NÃO pode ler nada.
drop policy if exists "convidados podem enviar rsvp" on public.rsvp;
create policy "convidados podem enviar rsvp"
  on public.rsvp
  for insert
  to anon, authenticated
  with check (true);

--    b) Somente usuários autenticados (os noivos) podem LER as respostas.
drop policy if exists "noivos podem ler rsvp" on public.rsvp;
create policy "noivos podem ler rsvp"
  on public.rsvp
  for select
  to authenticated
  using (true);

-- ============================================================
-- Depois de rodar:
--   Authentication > Users > "Add user" -> crie e-mail + senha
--   dos noivos. Esse login é usado na página /admin/.
-- ============================================================
