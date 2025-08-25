const API_KEY = "AIzaSyDGOEA2AtjXUCKmO45RLr3t535438aFFsk";
const MODEL = "gemini-2.5-flash";

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("prompt");
const sendBtn = document.getElementById("enviar");

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", async () => {
  const pregunta = input.value.trim();
  if (!pregunta) return;

  addMessage(pregunta, "user");
  input.value = "";

  addMessage("⏳ Pensando...", "bot");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: pregunta }] }]
        }),
      }
    );

    const data = await response.json();

    // quitar "pensando..."
    chatBox.lastChild.remove();

    if (data.candidates && data.candidates.length > 0) {
      const output = data.candidates[0].content.parts[0].text;
      addMessage(output, "bot");
    } else {
      addMessage("⚠️ No se pudo generar respuesta.", "bot");
    }

  } catch (error) {
    console.error("Error con la API:", error);
    chatBox.lastChild.textContent = "❌ Error al conectar con la API.";
  }
});
