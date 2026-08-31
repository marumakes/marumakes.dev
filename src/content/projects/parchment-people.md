---
title: Parchment People
tagline: A D&D 5e character sheet built for the table - cloud-synced, beautiful, and automated just enough to keep the game fun. Sheets can be shared across parties.
stack: [React 19, TypeScript, Vite, TipTap]
mounting: Supabase · Vercel
finish: Tailwind CSS
firstLight: 2026-04
designation: Chartula
condition: in-service
screenshot: /projects/parchment-people/screenshot.png
screenshotAlt: A Parchment People character sheet open on the Core tab, showing ability scores, skills, saving throws and proficiencies
liveUrl: https://www.parchmentpeople.com
caseStudy: true
order: 1
---

## The Problem

In my recent D&D campaign ([read about it here](/field-notes/running-a-large-party)), I noticed that the players using online character sheets were split across three different platforms, all of which had significant problems. None of them were quite the solution we wanted (alas, not enough to send us back to paper and ink).

D&D Beyond is highly polished, but much of its content is locked behind a paywall, and its heavy automation can take away some of the fun of managing a character sheet. Roll20 provides a free alternative, but its interface and UX left a lot to be desired. I myself spent most of one session Alt-Tabbing between the official online PDF character sheet and a Notion document containing all the information the PDF couldn't accommodate.

## The Solution

Parchment People is my solution to this: a beautifully designed character sheet with optional automation for the more tedious parts of character management. As a web app, the sheet can grow naturally with whatever information a character needs to contain, rather than being constrained by the physical dimensions of a piece of paper (within reason, and Supabase's limits).

It also supports party play. The Groups feature allows character sheets to be shared between DMs and players in read-only mode, making it easy for everyone at the table to keep track of each other's characters.

## Decisions Behind the Development

Supabase's row-level security policies were particularly well suited to the Groups feature, allowing me to define flexible permissions for who can view a character sheet and what they can do with it. Supabase's real-time functionality also allows party members to watch a sheet being edited as changes happen.

Because sheets are read-only to everyone except their author, simultaneous editing conflicts aren't an issue. In this respect, the system mirrors the behaviour of a paper character sheet: one person writes on it, while everyone else can look over their shoulder.

The biggest challenge I encountered during development was polishing the UI/UX, particularly around edge cases and bugs. This is something I care about deeply, so I spent a great deal of time iterating on the interface with Claude. Alongside this collaboration, I researched UI/UX more broadly (including reading Norman's _The Design of Everyday Things_) and developed a workflow that suited the way I like to build interfaces. I've since extracted that workflow into a Claude skill and applied it to my other projects, including this site.

As I write this case study, I have also planned - but not yet implemented - a homebrew monster feature inspired by my recent Rust project (currently a WIP). This will allow DMs to create and export well-designed monster stat blocks. My goal is to grow Parchment People into a general-purpose D&D toolkit rather than keeping it solely as an online character sheet.
