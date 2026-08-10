---
title: Parchment People
tagline: A D&D 5e character sheet built for the table — cloud-synced, keyboard-friendly, and designed to stay out of your way mid-session.
stack: [React 19, TypeScript, Vite, Supabase, Tailwind CSS, TipTap, Vercel]
liveUrl: https://www.parchmentpeople.com
caseStudy: true
order: 1
---

## What it does

Seven tabs cover a full character sheet — ability scores, skills and saving throws on **Core**; HP, conditions, death saves and attacks on **Combat**; full SRD spell search on **Spells**; encumbrance and attunement on **Inventory**; pets and summons with their own stat blocks on **Companions**; backstory and portrait on **Background**; and a freeform **Notes** pad for the middle of a session.

A guided level-up wizard walks a character from level N to N+1 — class, hit points, ability scores or a feat, spell slots, new features — and applies the change as a single patch rather than a dozen small edits. Proficiencies and starting equipment are suggested from class, race and background, offered as chips to accept or ignore rather than applied silently.

Parties are real-time: a DM creates a group, shares an invite code, and reads party members' sheets as they update live. Players choose what to share; DMs keep private per-member notes.

Autosave runs on a 2-second debounce, backed by in-session undo, persisted version history with restore, and a save-conflict guard for the same character open in two tabs at once.

## Why it's a case study and not a repo link

Parchment People has real users with real accounts, characters, and campaign notes, so the source isn't public. This page is the substitute for a README — the engineering decisions below are the ones that would otherwise live there.

## A few decisions worth mentioning

**Backups are a script, not a platform feature.** The project runs on Supabase's free tier, which takes no automatic backups. A scheduled `pg_dump`-based script fills that gap, writing `schema.sql`, an allowlisted `data-auth.sql` (just `auth.users` and `auth.identities` — not Supabase's internal bookkeeping), and `data.sql` for the app's own tables. It keeps the last 14 runs and prunes anything older than 90 days, which is also the literal mechanism behind the privacy policy's claim that deleted data doesn't survive more than 90 days in backups.

**Source maps are gated by the same variable that authenticates their upload.** `SENTRY_AUTH_TOKEN` is build-time only, set in Vercel, never shipped to the browser. Without it, the build emits no source maps at all — deliberately, since the Sentry plugin is what deletes them *after* upload, and generating them with nothing there to delete them would leave readable source sitting in `dist/`.

**Row-level security is the actual access model**, not an afterthought bolted onto an existing schema. Groups/parties in particular carry security-definer RLS helpers and a column-level `UPDATE` grant, which is why the schema lives entirely in versioned migrations rather than being hand-edited — a simplified rewrite would silently drop the column-level grant and quietly widen what a party member can touch.

## Stack

React 19 + TypeScript + Vite, routed with React Router, state via React Context. Supabase for Postgres, auth (Google OAuth), storage and realtime. Deno edge functions handle account deletion. Tailwind CSS v4 with shadcn/ui components, TipTap for rich text, `@react-pdf/renderer` for PDF export. Sentry for error tracking (session replay deliberately never enabled), Umami for cookieless analytics. Hosted on Vercel.
