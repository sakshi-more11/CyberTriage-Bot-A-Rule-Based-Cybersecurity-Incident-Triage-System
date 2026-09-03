# CyberTriage-Bot 🛡️
### A Rule-Based Chatbot for Cybersecurity Incident Triage

CyberTriage-Bot is a **rule-based chatbot** that helps non-security staff quickly
understand how serious a reported cybersecurity incident is, and what to do
about it first — before it gets worse. It classifies free-text incident
reports (phishing, ransomware, unauthorized access, malware, data leaks,
lost/stolen devices) into a severity level and returns immediate response
actions, using logic inspired by **NIST SP 800-61 — Computer Security
Incident Handling Guide**.

---

## Problem

When employees encounter a potential security incident, they often don't
know how urgent it is or what to do first. Delayed or incorrect first
response (e.g. paying a ransom, ignoring a compromised account) makes the
damage worse. Security Operations Centers (SOCs) solve this with structured
**triage playbooks**. This project builds a simplified, rule-based version
of that triage step.

## Solution

A chatbot with a **rule engine** — not a hardcoded if-elif chain — that:
1. Takes a plain-text description of what happened.
2. Matches it against a keyword-based rule base (`rules/incident_rules.json`).
3. Returns a **category**, **severity level**, **escalation flag**, and a
   list of **immediate response actions**.

If multiple rules match, the engine always returns the **highest severity**
match — a fail-safe so the bot never under-reports risk.

## Input → Output

**Input:** `"my files are locked and it's asking for payment"`

**Output:**
- Category: `Ransomware`
- Severity: `Critical`
- Escalate: `true`
- Actions: disconnect from network, do not pay, do not restart, report
  immediately, preserve the ransom note as evidence.

---

## Architecture

```
Browser (HTML/CSS/JS chat UI)
        │  POST /chat  { message }
        ▼
Flask app (app.py)
        │
        ▼
RuleEngine (engine/rule_engine.py)
        │  loads & matches against
        ▼
incident_rules.json  (keyword → category, severity, actions)
```

Rules are kept in a separate JSON config rather than hardcoded in the
app — so the rule base can grow without touching backend logic, similar
to how real expert systems separate the "knowledge base" from the
"inference engine."

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, vanilla JavaScript |
| Backend | Python, Flask |
| Rule Engine | Python (keyword-matching), JSON rule base |
| Reference framework | NIST SP 800-61 (Detection & Analysis phase) |

## Project Structure

```
cybertriage-bot/
├── app.py                    # Flask backend & /chat API route
├── engine/
│   └── rule_engine.py        # Rule matching logic
├── rules/
│   └── incident_rules.json   # Keyword → category/severity/action rule base
├── templates/
│   └── index.html            # Chat UI
├── static/
│   ├── style.css
│   └── script.js
├── requirements.txt
└── README.md
```

## Setup & Run

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/CyberTriage-Bot.git
cd CyberTriage-Bot

# 2. Create a virtual environment
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the app
python app.py
```

Then open **http://127.0.0.1:5000** in your browser.

## Example Prompts to Try

- "I received an email asking for my bank OTP"
- "my files are locked and it's asking for payment"
- "someone logged into my account from an unknown location"
- "my laptop is running very slow and showing strange pop-ups"
- "I accidentally shared a confidential file with the wrong person"
- "I lost my work laptop"

## Extending the Rule Base

Add a new category to `rules/incident_rules.json` with an `id`, `name`,
`keywords`, `severity` (`Low`/`Medium`/`High`/`Critical`), `escalate`
(true/false), and a list of `actions`. No code changes needed.

## Disclaimer

This is an academic/portfolio project demonstrating rule-based reasoning.
It is **not** a substitute for a real incident response team or official
security tooling.
