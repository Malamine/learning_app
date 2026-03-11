# 📚 Book Quiz — AI-Powered Study App

An offline-capable Progressive Web App (PWA) that turns any book PDF into an interactive quiz session, powered by Google Gemini.

Built originally for **Fluent Python** by Luciano Ramalho, but works with any technical book.

---

## ✨ Features

- **Drop your book PDF** → chapters are detected automatically from the table of contents
- **Random quiz by default** — a chapter is picked for you on every launch
- **AI-generated questions** — Gemini reads the chapter and creates varied questions (concepts, code, practical use)
- **Detailed feedback** — your answer is evaluated with corrections and code examples
- **Self-assessment** — mark each answer as ✓ Got it or ✗ Need to review
- **Weak spots tracker** — missed questions are saved and can be re-quizzed in a focused session
- **Multiple books** — switch between books from the header dropdown
- **Progress tracking** — scores per chapter saved across sessions
- **Installable PWA** — works as a native app on Android and iOS

---

## 🚀 Getting Started

### 1. Get a Gemini API Key (free)

Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) and create a free API key.

The free tier allows **1,500 requests/day** — more than enough for daily study sessions. You are **not charged** unless you explicitly upgrade to a paid plan.

### 2. Open the app

👉 **[https://YOUR_USERNAME.github.io/book-quiz](https://YOUR_USERNAME.github.io/book-quiz)**

*(replace with your actual GitHub Pages URL after deployment)*

### 3. First launch

1. Paste your Gemini API key and click **Save**
2. Drop your book PDF — chapters are extracted automatically (one-time operation)
3. A random chapter quiz starts immediately

---

## 📖 How to Use

### Starting a quiz

- **Random chapter** (default) — the app picks a chapter for you every time
- **Choose manually** — click **📚 Choose chapter** or browse the left sidebar
- **Weak spots review** — click **🔁 Weak spots (N)** to focus on questions you previously missed

### During a quiz

- Type your answer in the text box and press **Enter** (or **Shift+Enter** for a new line)
- Gemini evaluates your answer and gives detailed feedback
- After each feedback, rate yourself:
  - **✓ Got it** — moves to the next question
  - **✗ Need to review** — saves the question to your weak spots list for later

### Managing books

Click the **book name in the header** to:
- Switch between books instantly
- Add a new book (drop another PDF)
- Remove a book

### Settings ⚙

| Setting | Description |
|---|---|
| Gemini API Key | Your Google AI Studio key |
| Gemini Model | Model to use (click 🔍 List to see available models on your key) |
| Questions per session | Number of questions generated per chapter (1–15, default 4) |
| Clear weak spots | Reset the weak spots list for the current book |
| Clear quiz history | Reset all session scores |

---

## 📱 Install on Android (Chrome)

> Requires the app to be served over **HTTPS** (GitHub Pages works perfectly).

1. Open the app URL in **Chrome** on your Android phone
2. Tap the **⋮ menu** (top right)
3. Tap **"Add to Home screen"**
4. Confirm — the app icon appears on your home screen

The app opens **full-screen with no browser UI**, just like a native app.

---

## 🍎 Install on iPhone / iPad (Safari)

1. Open the app URL in **Safari**
2. Tap the **Share button** (box with arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **Add** — the icon appears on your home screen

---

## 🔒 Privacy & Security

- Your **API key** is stored in your browser's `localStorage` — it never leaves your device except for calls to Google's Gemini API
- Your **book PDF** is stored in your browser's `IndexedDB` — it never leaves your device
- Quiz history and weak spots are stored locally only
- The app has **no analytics, no tracking, no backend**

> ⚠️ Anyone with physical access to your device could extract your API key from browser storage. To limit risk, set a [usage quota](https://aistudio.google.com) on your API key.

---

## 🛠 Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/book-quiz.git
cd book-quiz
python -m http.server 8000
# open http://localhost:8000
```

> The Service Worker (offline support) only activates over HTTPS or `localhost`. Always use a local server — don't open `index.html` directly as a file.

---

## 🌐 Deploy to GitHub Pages

```bash
git init
git add index.html manifest.json sw.js icon-192.png icon-512.png README.md
git commit -m "Initial release"
git remote add origin https://github.com/YOUR_USERNAME/book-quiz.git
git branch -M main
git push -u origin main
```

Then go to your repo → **Settings** → **Pages** → Source: **Deploy from branch** → `main` / `root` → **Save**.

Your app will be live at `https://YOUR_USERNAME.github.io/book-quiz` within a minute.

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML + CSS + Vanilla JavaScript (single `index.html`) |
| AI | Google Gemini API (`gemini-2.5-flash` — free tier) |
| PDF parsing | [PDF.js](https://mozilla.github.io/pdf.js/) by Mozilla |
| Storage | `localStorage` (settings, history) + `IndexedDB` (book PDFs) |
| Offline | Service Worker + Cache API |
| Distribution | Static files — deployable anywhere |

---

## 📄 License

MIT — do whatever you want with it.
