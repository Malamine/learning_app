# Custom Quiz — PWA

## Project Context
A Progressive Web App (PWA) for reviewing the book **"Fluent Python" by Luciano Ramalho** (2nd edition, ~900 pages).

The user reads the book chapter by chapter and wants to be quizzed daily on what they have learned, via an interactive chat powered by an LLM.

---

## Tech Stack
- **Frontend**: HTML + CSS + vanilla JavaScript (single file `index.html`)
- **LLM**: Google Gemini API (`gemini-2.0-flash` — free up to 1,500 req/day)
- **PDF**: Client-side reading via `PDF.js` (Mozilla)
- **PWA**: `manifest.json` + Service Worker for mobile installation
- **Storage**: `localStorage` for history and progress tracking

---

## Features to Build

### 1. PDF Chapter Upload
- The user uploads a chapter (or section) of the book as a PDF
- Text is extracted client-side using PDF.js
- The extracted text is sent to Gemini as context

### 2. Question Generation by Gemini
- Gemini reads the chapter content
- It generates 3 to 5 varied questions (open-ended, code completion, concept explanation)
- Questions focus exclusively on the content of the uploaded chapter

### 3. Chat Interface
- The user answers each question freely
- Gemini evaluates the answer, provides detailed feedback and a correction if needed
- Tone is pedagogical, encouraging, and precise

### 4. Progress Tracking
- Session history saved in localStorage
- Score per chapter
- Summary view of already reviewed chapters

### 5. Mobile-Installable PWA
- `manifest.json` with icon and app name
- Basic Service Worker for offline support (static cache)
- Responsive design, usable on smartphone

---

## File Structure

```
fluent-python-quiz/
├── index.html          # Full app (HTML + CSS + JS)
├── manifest.json       # PWA config
├── sw.js               # Service Worker
├── icon-192.png        # PWA icon (to generate)
├── icon-512.png        # PWA icon (to generate)
└── CLAUDE.md           # This file
```

---

## Gemini API Configuration

The user enters their Gemini API key directly in the interface (stored in localStorage).

- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`
- Free key available at: https://aistudio.google.com/app/apikey
- Free tier limits: 1,500 requests/day, 15 requests/minute

---

## System Prompt for Gemini

```
You are a pedagogical assistant and Python expert, specialized in the book
"Fluent Python" by Luciano Ramalho.

When provided with a chapter excerpt:
1. Generate 3 to 5 varied and relevant questions about the content
2. Mix question types: theoretical concepts, code examples, practical use cases
3. When the user answers, evaluate their response with kindness
4. Provide precise feedback: what is correct, what is missing, and the full correction
5. Use Python code examples when relevant
6. Stay focused on the content of the provided chapter

Always reply in English.
```

---

## Design / UX
- Dark theme — comfortable for reading code
- Monospace font for code blocks
- Clean chat interface with clear visual distinction between questions and answers
- Visible PWA install button
- Mobile-first design

---

## Useful Commands

```bash
# Start a local server to test the PWA (required for Service Worker)
python -m http.server 8000
# or
npx serve .

# Open in browser
http://localhost:8000
```

> ⚠️ The Service Worker only works over HTTPS or localhost. Always test via a local server, never by opening the file directly.

---

## What Claude Code Should Do

Build the entire app following this specification. Start with `index.html` (structure + styles + JS logic), then `manifest.json` and `sw.js`.

The app must be **fully functional on first launch** with just a Gemini API key.
