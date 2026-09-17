<!-- BEGIN:nextjs-agent-rules -->

# Raasta Project — AGENTS.md

## 1. Project Overview

Raasta is a smart public-transport route finder.

The main purpose of Raasta is:

> "Tell us where you want to go, and we explain how to get there."

Users should be able to:

- Select a city
- Enter a starting location
- Enter a destination
- Find available bus routes
- See starting and ending points
- See important stops
- See roads traveled
- Understand where to change buses
- Follow a step-by-step journey
- View routes on a map
- Search using landmarks and common location names

The initial target city is Karachi, Pakistan, but the architecture must support multiple cities.

---

# 2. Project Architecture

Raasta is a monorepo.

```text
raasta/
├── client/                 # Next.js frontend
├── server/                 # Express.js backend
├── docs/                   # Project documentation
├── .gitignore
├── AGENTS.md
├── README.md
└── package.json

<!-- END:nextjs-agent-rules -->
