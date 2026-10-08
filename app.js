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
}

function submitPrompt(value) {
  const text = value.trim();
  if (!text) return;

  const welcome = document.querySelector(".welcome");
  if (welcome) welcome.remove();

  addMessage(text, "user");
  input.value = "";

  setTimeout(() => {
    addMessage(
      "I understand the request. The chatbot shell is working. Next we will connect the ChatGPT brain, live UK research, image generation, video generation/editing, and final file export.",
      "bot"
    );
  }, 350);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  submitPrompt(input.value);
});

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => submitPrompt(button.dataset.prompt));
});

document.getElementById("newChat").addEventListener("click", () => {
  messages.innerHTML = `
    <div class="welcome">
      <div class="welcome-icon">✦</div>
      <h2>Your content agent</h2>
      <p>Tell me what UK content you want. Research, creation and export will be connected in the next stages.</p>
      <div class="suggestions">
        <button class="suggestion" data-prompt="Find a trending UK topic and create a question-style image.">Create a UK trend image</button>
        <button class="suggestion" data-prompt="Find today's biggest UK news story and prepare a post.">Find today's UK news</button>
        <button class="suggestion" data-prompt="Create a 15-second UK news video.">Create a UK news video</button>
      </div>
    </div>`;
  document.querySelectorAll("[data-prompt]").forEach((button) => {
    button.addEventListener("click", () => submitPrompt(button.dataset.prompt));
  });
});
