# Discip-LAN

A modular productivity stack for students: Canvas sync, syllabus-aware planning, biometrics, and a small in-app companion—without mixing those concerns in one giant script.

---

## Quick start

1. **Clone** this repo and open the project folder.

2. **Create a virtual environment** (recommended):

   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```

3. **Install dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure secrets**: copy `.env.example` to `.env` and fill in Canvas (and other) keys.  
   Do **not** commit `.env`.

5. **Run the Canvas sync** (when `engine/canvas_api.py` is wired):

   ```bash
   python engine/canvas_api.py
   ```

---

## Project layout

| Folder | What it’s for |
|--------|----------------|
| **`engine/`** | Backend-style code with no UI: Canvas (`canvas_api.py`), webcam / fatigue (`vision_module.py`), scoring / priorities (`brain.py`). |
| **`ui/`** | Streamlit app (`app.py`) and reusable pieces in `ui/components/` (NPC, sidebar). |
| **`data/syllabi/`** | Syllabus text or exports you save locally. |
| **`data/cache/`** | Short-lived cache files (this path is gitignored). |
| **`assets/`** | Sprites, icons, and other static files for the UI. |

---

## Configuration

| File | Purpose |
|------|---------|
| `.env.example` | Template: copy to `.env` and add real values. |
| `.env` | Your real keys (ignored by git). |
| `requirements.txt` | Pinned dependency list with comments describing each package. |

---

## Roadmap (planned)

These pieces are **not built yet**—they describe where the product can go once Canvas + syllabus data are solid.

1. **Smarter inputs** — Pull in **exams, due dates, and topic lists** from Canvas (assignments, calendar, syllabus text) so the app knows *what* to study and *when*.

2. **Study plan (Perplexity)** — Send that structured context to **Perplexity** (or a similar research / reasoning API) to produce a **personalized study plan**: ordered topics, time suggestions, and gaps to fill.

3. **Interactive podcast (ElevenLabs)** — Turn the plan (and optional follow-up summaries) into **spoken audio** with **ElevenLabs**, then layer an **interactive** experience: listen like a podcast, pause, and **ask questions** that map back to your materials (Q&A or conversational agent on top of the same content).

**Rough flow:** Canvas + syllabus → **study plan text** (Perplexity) → **voice + dialogue** (ElevenLabs + orchestration in `engine/` / `ui/`).

When this ships, API keys will live in `.env` (alongside Canvas)—never in source code.

---

## Security

- Never push **session cookies**, **CSRF tokens**, or **API keys** to GitHub.
- If a secret is ever pasted into chat or committed by mistake, **rotate it** (new Canvas session, new API key, etc.).
