# LizBee AI Workplace Productivity Assistant

A modern, responsive web application that helps professionals save time, improve communication, and automate daily workplace tasks with artificial intelligence. LizBee 🐝 is the friendly AI companion at the centre of the experience — guiding users through the app, generating content, summarising meetings, and supporting research.

## Project Overview

LizBee provides an intelligent workspace where users can:

- Generate professional emails in a variety of tones.
- Summarise meeting notes into structured action items and decisions.
- Conduct AI-powered research and improve their prompts.
- Store generated content locally in the browser.
- Chat with LizBee for guidance, productivity tips, and responsible AI reminders.

The application is built with TanStack Start, React, and Tailwind CSS, and uses the Lovable AI Gateway for all AI completions.

## Features Implemented

### Core Tools

- **Smart Email Generator** — Create professional emails with Formal, Friendly, or Persuasive tones. Also supports shorten, expand, and rewrite modes for existing drafts.
- **Meeting Notes Summariser** — Paste notes or transcripts and receive a structured Markdown summary with sections for Summary, Action Items, Decisions, and Deadlines.
- **AI Research Assistant** — Get topic summaries, analyse articles, ask follow-up questions, and receive improved prompt suggestions.
- **Email Templates** — Pre-built templates for common workplace emails.
- **Saved Documents** — Locally store emails, summaries, and research outputs with category management.

### Supporting Features

- **LizBee AI Chat** — Persistent floating chat widget for help, onboarding, and productivity advice.
- **Voice-to-Text Input** — Web Speech API integration for hands-free prompting.
- **Dark Mode** — Theme toggle with localStorage persistence.
- **Responsible AI Reminders** — In-app notices encouraging users to verify AI-generated content.
- **Responsive Design** — Works across desktop, tablet, and mobile viewports.
- **SEO Basics** — Route-level metadata, sitemap route, and robots.txt.

## Technologies and Tools Used

- **Framework:** TanStack Start v1
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Components:** shadcn/ui
- **Build Tool:** Vite 7
- **AI Provider:** Lovable AI Gateway (`google/gemini-3-flash-preview`)
- **Routing:** TanStack Router (file-based)
- **Icons:** Lucide React
- **State / Storage:** React hooks, localStorage
- **Voice Input:** Web Speech API
- **Deployment:** Lovable Cloud

## Setup Instructions

### Prerequisites

- [Bun](https://bun.sh/) installed (or Node.js with npm/pnpm)
- A Lovable AI API key set up in your environment

### Local Development

1. Clone the repository and open the project directory.
2. Install dependencies:

   ```bash
   bun install
   ```

3. Create a `.env` file in the project root and add your API key:

   ```bash
   LOVABLE_API_KEY=your_api_key_here
   ```

4. Start the development server:

   ```bash
   bun dev
   ```

5. Open the application in your browser at `http://localhost:8080`.

### Build for Production

```bash
bun run build
```

The production build will be output to the configured dist directory and can be deployed via Lovable Cloud or your preferred platform.

### Notes

- Saved documents and chat history are stored in the browser's localStorage and are not synced to a server.
- AI calls require a valid `LOVABLE_API_KEY` environment variable at runtime.
