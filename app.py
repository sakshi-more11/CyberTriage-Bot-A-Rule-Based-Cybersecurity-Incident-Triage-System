"""
CyberTriage-Bot
----------------
A rule-based chatbot that triages cybersecurity incidents by severity
and recommends immediate response actions, inspired by NIST SP 800-61
incident classification logic.

Run with: python app.py
"""

from flask import Flask, render_template, request, jsonify
from engine.rule_engine import RuleEngine

app = Flask(__name__)
engine = RuleEngine()


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "")

    result = engine.respond(message)
    return jsonify(result)


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
