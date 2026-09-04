# 🛡️ CyberTriage-Bot

**A rule-based cybersecurity incident triage chatbot** — describe what happened in plain English, and it classifies the severity, flags whether to escalate, and hands you the exact next steps to take. Built on classification logic inspired by **NIST SP 800-61**, the industry-standard Computer Security Incident Handling Guide.

<p>
  <img src="https://img.shields.io/badge/Python-3.9+-3776AB?logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Flask-3.0-000000?logo=flask&logoColor=white" />
  <img src="https://img.shields.io/badge/Engine-Rule--Based-22d3ee" />
  <img src="https://img.shields.io/badge/Reference-NIST%20SP%20800--61-6366f1" />
  <img src="https://img.shields.io/badge/License-MIT-lightgrey" />
</p>

---

## 🔎 Overview

🗨️ Describe an incident, get instant triage — no security background needed
🚨 Classifies severity: `Low` → `Critical`
📋 Hands you a ready-to-follow action checklist
📖 Also works as a mini cybersecurity glossary — just type a term
🧭 Modeled on real SOC playbook logic (NIST SP 800-61)

---

## ✨ Features

- 🗂️ **11-Category Rule Engine** — ransomware, phishing, malware, data leaks, unauthorized access & more, all pattern-matched in real time
- ✍️ **Typo-Tolerant NLP Matching** — word-boundary aware detection that still fires on short, vague, or single-word input like `"phishing"`
- 🛑 **Fail-Safe Severity Logic** — when multiple threats overlap, it always escalates to the higher risk — zero under-reporting
- 💳 **Real-World Threat Coverage** — UPI/GPay fraud, hacked Instagram/Google accounts, leaked passwords, privacy breaches
- 📖 **Built-In Security Glossary** — type any cyber term and get an instant, plain-English definition
- 🌗 **Dual-Theme Interface** — animated light/dark toggle with persisted user preference
- 💬 **Live Chat Experience** — typing indicators, sliding message animations, and a pulsing glow on Critical alerts
- 🧩 **Decoupled Rule Architecture** — knowledge base lives in pure JSON, fully separate from the inference engine
- ⚡ **Instant Response Time** — lightweight keyword engine returns triage results in milliseconds, no external API calls

---

## 🧠 How It Works

```
Browser (HTML / CSS / JS chat UI)
        │  POST /chat  { "message": "..." }
        ▼
Flask app  (app.py)
        │
        ▼
RuleEngine  (engine/rule_engine.py)
        │  normalizes text → matches against keyword rules
        ▼
incident_rules.json   (11 categories → keywords, severity, actions)
```

---

## 🗂️ Incident Categories

| Category | Severity |
|---|---|
| Ransomware | 🔴 Critical |
| Data Leak / Exposure | 🔴 Critical |
| Unauthorized Access | 🟠 High |
| Malware / Virus | 🟠 High |
| Lost / Stolen Device | 🟠 High |
| Payment / UPI Safety | 🟠 High |
| Phishing | 🟡 Medium |
| Password / Account Help | 🟡 Medium |
| Account Privacy / Security | 🟡 Medium |
| Device Performance / Basic Safety | 🟢 Low |
| Cybersecurity Basics (glossary) | 🟢 Low |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3 (custom properties for theming), vanilla JavaScript |
| Backend | Python, Flask |
| Rule Engine | Pure Python — regex-based, word-boundary keyword matching |
| Knowledge Base | JSON (`incident_rules.json`) |
| Reference Framework | NIST SP 800-61 (Detection & Analysis phase) |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.9 or later
- pip

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/CyberTriage-Bot.git
cd CyberTriage-Bot

# 2. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run the app
python app.py
```

Then open **http://127.0.0.1:5000** in your browser.

---

## 💬 Try It

| Type this | You'll get |
|---|---|
| `my files are locked and it's asking for payment` | `Ransomware` — Critical, escalate |
| `someone logged into my account from an unknown location` | `Unauthorized Access` — High |
| `GPay money deducted without my knowledge` | `Payment / UPI Safety` — High |
| `I got an email asking for my bank OTP` | `Phishing` — Medium |
| `I forgot my Instagram password` | `Password / Account Help` — Medium |
| `phishing` | Instant one-line glossary definition |
| `how do I secure my Google account` | `Account Privacy / Security` guidance |

---

## ⚠️ Disclaimer

This is an academic/portfolio project demonstrating rule-based reasoning applied to cybersecurity triage. It is not a substitute for a real incident response team, a bank's fraud helpline, or official security tooling.
