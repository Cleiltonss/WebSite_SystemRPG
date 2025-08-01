const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const SAVE_FILE = path.join(__dirname, "data", "dice_state.json");

let state = {
  rollDice: []
};

// Try to load the saved state 
try {
  const savedData = fs.readFileSync(SAVE_FILE, "utf-8");
  state = JSON.parse(savedData);
  console.log("🧠 Estado carregado do dice.");
} catch (err) {
  console.log("📂 Nenhum estado salvo encontrado de dice, iniciando vazio.");
}

const wss = new WebSocket.Server({ port: 8081 });

wss.on("connection", (ws) => {
  console.log("🧠 Novo cliente conectado ao backend dice");

  ws.on("message", (message) => {
  console.log("📩 Mensagem recebida do frontend:", message);

  let msg;
    try {
      msg = JSON.parse(message);
    } catch (err) {
      console.error("❌ Erro ao fazer parse da mensagem:", message);
      return;
    }

    if (msg.type === "get_state") {
      ws.send(JSON.stringify({
        type: "full_state",
        rollDice: state.rollDice,
      }));
    }

    if (msg.type === "roll_dice") {
      console.log("📩 Mensagem recebida do frontend:", msg); // ADICIONE ESTA LINHA
      state.rollDice = msg.rollDice;
      saveState(); // 💾 salvar após alteração
      broadcast({ 
        type: "full_state", 
        rollDice: state.rollDice, 
      });
    }
  });


  ws.on("close", () => {
    console.log("❌ Cliente desconectado");
  });
});

// Broadcast to all clients
function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

// Save state on disk
function saveState() {
  try {
    const json = JSON.stringify(state, null, 2); // indentado para debug
    fs.writeFileSync(SAVE_FILE, json);
    console.log("💾 Estado salvo com sucesso.");
  } catch (err) {
    console.error("❌ Erro ao salvar estado:", err);
  }
}

console.log("🌐 Backend dice WebSocket rodando em ws://localhost:8081");