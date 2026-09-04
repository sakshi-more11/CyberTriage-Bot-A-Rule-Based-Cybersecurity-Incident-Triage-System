"""
Rule Engine for CyberTriage-Bot
--------------------------------
Loads the JSON rule base and matches free-text incident descriptions
against keyword rules to produce a category, severity, escalation flag,
and recommended response actions (inspired by NIST SP 800-61 phase 2:
Detection & Analysis).
"""

import json
import os
import re

RULES_PATH = os.path.join(os.path.dirname(__file__), "..", "rules", "incident_rules.json")

SEVERITY_RANK = {"Low": 0, "Medium": 1, "High": 2, "Critical": 3}


class RuleEngine:
    def __init__(self, rules_path: str = RULES_PATH):
        with open(rules_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.categories = data["categories"]
        self.default = data["default"]

    @staticmethod
    def _normalize(text: str) -> str:
        text = text.lower().strip()
        text = re.sub(r"[^a-z0-9\s]", " ", text)
        text = re.sub(r"\s+", " ", text)
        return text

    def classify(self, message: str) -> dict:
        """
        Match the incoming message against every category's keyword list.
        A category "matches" if any of its keywords appear as a substring
        of the normalized message. If multiple categories match, the one
        with the highest severity wins (fail-safe: never under-report risk).
        """
        normalized = self._normalize(message)

        matches = []
        for category in self.categories:
            for keyword in category["keywords"]:
                normalized_keyword = self._normalize(keyword)
                # Word boundaries prevent short keywords such as "otp" from
                # matching an unrelated word.  This also supports one-word
                # queries (for example, "phishing" or "malware").
                if re.search(r"(?<![a-z0-9])" + re.escape(normalized_keyword) + r"(?![a-z0-9])", normalized):
                    matches.append(category)
                    break

        if not matches:
            result = dict(self.default)
            result["matched_keyword"] = None
            return result

        # A higher severity always wins, which is safer when an input contains
        # both a broad term ("password") and an urgent signal ("stolen").
        best = max(matches, key=lambda c: SEVERITY_RANK[c["severity"]])
        result = dict(best)
        return result

    def respond(self, message: str) -> dict:
        if not message or not message.strip():
            return {
                "category": "None",
                "severity": "Low",
                "escalate": False,
                "actions": ["Please describe the incident so I can triage it."],
            }

        classification = self.classify(message)
        return {
            "category": classification["name"],
            "severity": classification["severity"],
            "escalate": classification["escalate"],
            "actions": classification["actions"],
        }
