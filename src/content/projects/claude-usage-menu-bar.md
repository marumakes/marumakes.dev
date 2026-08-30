---
title: Claude Usage Menu Bar
tagline: A macOS menu bar app showing live Claude Code session and weekly usage - my first Swift project, and an end to typing /usage.
stack: [Swift, SwiftUI]
mounting: MenuBarExtra
firstLight: 2026 # TODO: confirm - placeholder
designation: Vigil
condition: in-service # TODO: confirm - placeholder
screenshot: /projects/claude-usage-menu-bar/screenshot.png
screenshotAlt: A macOS menu bar dropdown showing Claude Code session and weekly usage percentages
repoUrl: https://github.com/marumakes/claude-usage-menu-bar
order: 4
---

Live session/weekly usage percentages in the menu bar, with auto-refresh every 5 minutes. First project in Swift - the biggest lesson was that the Claude CLI's output format isn't uniform (`h:mma` vs `ha` for times), which is what finally pushed a switch to parsing with regex instead of hand-rolled string matching.
