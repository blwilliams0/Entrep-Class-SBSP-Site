create extension if not exists pgcrypto;

create table if not exists responses (
  id bigserial primary key,
  response text not null check (response in ('Yes', 'Maybe', 'No')),
  ip_address text not null,
  user_agent text not null,
  visitor_hash text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists contacts (
  id bigserial primary key,
  name text not null,
  email text not null,
  company text,
  linked_response_id bigint references responses(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_contacts_linked_response_id on contacts(linked_response_id);
create index if not exists idx_contacts_email on contacts(email);