---
title: Room Booking System
tagline: A mobile-first web app for sharing out a university society's booked rooms among the people running sessions - built to replace a shared spreadsheet that got very confusing very quickly.
stack: [React 19, TypeScript, Vite]
mounting: Supabase
finish: Tailwind CSS
firstLight: 2026-09
designation: Cella
condition: complete
screenshot: /projects/room-booking-system/screenshot.png
screenshotAlt: Three phone screens from the room booking app - the sign-in form, a week of rooms to claim, and the sheet for claiming a room
repoUrl: https://github.com/marumakes/room-booking-system
order: 4
---

Hosts sign in with a code sent to their university email and claim rooms week by week, with everyone's claims updating live. There's no custom server - all the rules live in the database (row-level security, and claims going through database functions), so they hold whatever the client does, even when everyone claims at once. This version is set up for a made-up Astronomy Society; the original is in use by my own society.
