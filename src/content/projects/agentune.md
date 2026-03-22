---
title: "agentune"
slug: "agentune"
category: "Personal / Creative Side Projects"
order: 1
images:
  - name: "banner.jpg"
    url: "https://res.cloudinary.com/do6szo7zy/image/upload/v1774184623/banner_1_uioc8y.jpg"
---

## Overview

agentune is a local MCP music player for Claude Code, Codex, OpenCode, and other MCP-compatible coding agents. It lets an agent discover tracks, control playback, and keep one shared listening session running while I code.

## Key Features

- Zero-auth setup with no Spotify or Apple Music login and no API keys
- CLI-only runtime with a shared local daemon for playback, queue, history, and taste state
- Agent-controlled discover, play-now, queue, skip, pause, resume, volume, and history flows
- Browser dashboard for now playing, queue, volume, listening insights, and taste editing
- Local diagnostics with `agentune doctor`
- Cross-platform support for Windows, macOS, and Linux

## Role

Owner, creator, and maintainer.

## Responsibilities

- Product direction and MCP tool design
- Daemon lifecycle and local runtime architecture
- Playback pipeline integration with `mpv` and `yt-dlp`
- Browser dashboard and real-time state updates
- SQLite-backed history, persona, and discovery context design
- Build, test, release, and documentation workflow

## Architecture

Built around one shared local daemon per device. MCP clients connect through a lightweight proxy or local MCP endpoint, the daemon owns queue and playback state, SQLite stores durable history and taste text, the dashboard streams live updates over HTTP and WebSocket, and `mpv` handles background audio playback.

Discovery is Apple-first for canonical track metadata and ranking, while YouTube resolution is used to find a playable version for actual playback.

## Tech Stack

- TypeScript
- Node.js
- Model Context Protocol SDK
- SQLite
- better-sqlite3
- WebSocket
- mpv
- yt-dlp
- @distube/ytsr
- zod

## Results

- Shipped as a CLI-only open-source package for agent-controlled music playback
- Delivered a shared daemon plus browser dashboard instead of browser-tab-bound playback
- Added local health diagnostics and cross-platform runtime support
- Established an agent-first session model built around persona text, listening history, and discovery context

## Key Learnings

Deepened my understanding of MCP ergonomics, long-lived daemon design, local diagnostics, playback orchestration, and how lightweight history signals can improve agent-driven discovery without adding heavy user setup.

## Quick Start

1. Install prerequisites: Node.js 20+, `mpv`, and `yt-dlp`
2. Install the CLI: `npm install -g agentune`
3. Verify local runtime health with `agentune doctor`
4. Connect an MCP client to the local `agentune` command
5. Open the dashboard at `http://localhost:3737` after the first connection

## Source Code

https://github.com/tqdat410/agentune
