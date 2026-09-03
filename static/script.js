const chatWindow = document.getElementById("chatWindow");
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const themeToggle = document.getElementById("themeToggle");

/* ---------- Theme handling ---------- */
function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  localStorage.setItem("cybertriage-theme", theme);
}

(function initTheme() {
  const saved = localStorage.getItem("cybertriage-theme");
  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(saved || (prefersLight ? "light" : "dark"));
})();

themeToggle.addEventListener("click", () => {
  const current = document.body.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

/* ---------- Chat handling ---------- */
function scrollToBottom() {
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function addUserMessage(text) {
  const msg = document.createElement("div");
  msg.className = "msg msg-user";
  const bubble = document.createElement("div");
  bubble.className = "msg-bubble";
  bubble.textContent = text;
  msg.appendChild(bubble);
  chatWindow.appendChild(msg);
  scrollToBottom();
}

function addTypingIndicator() {
  const msg = document.createElement("div");
  msg.className = "msg msg-bot";
  msg.id = "typingIndicator";
  msg.innerHTML = `
    <div class="msg-bubble typing-bubble">
      <span></span><span></span><span></span>
    </div>
  `;
  chatWindow.appendChild(msg);
  scrollToBottom();
}

function removeTypingIndicator() {
  const el = document.getElementById("typingIndicator");
  if (el) el.remove();
}

function addBotResult(result) {
  const msg = document.createElement("div");
  msg.className = "msg msg-bot";

  const actionsHtml = result.actions.map(a => `<li>${escapeHtml(a)}</li>`).join("");
  const escalateHtml = result.escalate
    ? `<div class="escalate-flag">⚠ Escalate to security team immediately</div>`
    : "";

  msg.innerHTML = `
    <div class="result-card sev-${result.severity}">
      <div class="result-top">
        <span class="result-category">${escapeHtml(result.category)}</span>
        <span class="severity-badge ${result.severity}">${result.severity}</span>
      </div>
      ${escalateHtml}
      <ul>${actionsHtml}</ul>
    </div>
  `;
  chatWindow.appendChild(msg);
  scrollToBottom();
}

function addErrorMessage() {
  const msg = document.createElement("div");
  msg.className = "msg msg-bot";
  msg.innerHTML = `<div class="msg-bubble">Something went wrong reaching the server. Please try again.</div>`;
  chatWindow.appendChild(msg);
  scrollToBottom();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (!message) return;

  addUserMessage(message);
  userInput.value = "";
  userInput.disabled = true;
  sendBtn.disabled = true;

  addTypingIndicator();

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();

    // small delay so the typing indicator feels natural rather than instant
    await new Promise(r => setTimeout(r, 350));
    removeTypingIndicator();
    addBotResult(data);
  } catch (err) {
    removeTypingIndicator();
    addErrorMessage();
  } finally {
    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
  }
});