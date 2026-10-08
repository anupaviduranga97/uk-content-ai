const messages = document.getElementById("messages");
const form = document.getElementById("composer");
const input = document.getElementById("prompt");

function addMessage(text, role) {
  const wrap = document.createElement("div");
  wrap.className = `message ${role}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  wrap.appendChild(bubble);
  messages.appendChild(wrap);
  messages.scrollTop = messages.scrollHeight;

  return wrap;
}

function showTyping() {
  return addMessage("Thinking…", "bot");
}

async function submitPrompt(value) {
  const text = value.trim();
  if (!text) return;

  const welcome = document.querySelector(".welcome");
  if (welcome) welcome.remove();

  addMessage(text, "user");
  input.value = "";

  const typing = showTyping();

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();
    typing.remove();

    if (!response.ok) {
      addMessage(`Error: ${data.error || "Something went wrong."}`, "bot");
      return;
    }

    addMessage(data.content, "bot");
  } catch (error) {
    typing.remove();
    addMessage(
      "I can't reach the AI server yet. The backend must be running and connected to the OpenAI API.",
      "bot"
    );
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  submitPrompt(input.value);
});

function bindPromptButtons() {
  document.querySelectorAll("[data-prompt]").forEach((button) => {
    button.addEventListener("click", () => submitPrompt(button.dataset.prompt));
  });
}

bindPromptButtons();

document.getElementById("newChat").addEventListener("click", () => {
  messages.innerHTML = `
    <div class="welcome">
      <div class="welcome-icon">✦</div>
      <h2>Your content agent</h2>
      <p>Tell me what UK content you want. The AI can research current topics and prepare the content brief.</p>
      <div class="suggestions">
        <button class="suggestion" data-prompt="Find a trending UK topic and create a question-style image.">Create a UK trend image</button>
        <button class="suggestion" data-prompt="Find today's biggest UK news story and prepare a post.">Find today's UK news</button>
        <button class="suggestion" data-prompt="Create a 15-second UK news video.">Create a UK news video</button>
      </div>
    </div>`;
  bindPromptButtons();
});
