import { GoogleGenAI } from "https://esm.run/@google/genai";

const ai = new GoogleGenAI({
  apiKey: "AIzaSyDGOEA2AtjXUCKmO45RLr3t535438aFFsk" // ⚠️ solo para pruebas
});

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
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: pregunta,
    });

    const output = response.text || "⚠️ No se pudo generar respuesta";

    // quitar el "Pensando..."
    chatBox.lastChild.remove();

    addMessage(output, "bot");

  } catch (error) {
    console.error("Error con la API:", error);
    chatBox.lastChild.textContent = "❌ Error al conectar con la API.";
  }
});
