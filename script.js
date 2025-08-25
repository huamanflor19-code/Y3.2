import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const ai = new GoogleGenerativeAI({
  apiKey: "AIzaSyDGOEA2AtjXUCKmO45RLr3t535438aFFsk"
});

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("prompt");
const sendBtn = document.getElementById("enviar");

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight; // auto scroll
}

sendBtn.addEventListener("click", async () => {
  const pregunta = input.value.trim();
  if (!pregunta) return;

  addMessage(pregunta, "user");
  input.value = "";

  addMessage("⏳ Pensando...", "bot");

  try {
    const result = await ai.getGenerativeModel({ model: "gemini-2.5-flash" })
      .generateContent(pregunta);

    const output = result.response.text || 
      result.response.candidates?.[0]?.content?.parts?.[0]?.text || 
      "⚠️ No se pudo generar respuesta";

    // eliminar "pensando..."
    chatBox.lastChild.remove();

    addMessage(output, "bot");

  } catch (error) {
    console.error("Error con la API:", error);
    chatBox.lastChild.textContent = "❌ Error al conectar con la API.";
  }
});
