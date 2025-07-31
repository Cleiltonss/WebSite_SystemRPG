const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const SAVE_FILE = path.join(__dirname, "data", "map_state.json");


let state = {
  mapImage: null,
  tokens: [],
  combatStarted: false // <-- novo estado
};

// 🔄 Tenta carregar o estado salvo
try {
  const savedData = fs.readFileSync(SAVE_FILE, "utf-8");
  state = JSON.parse(savedData);
  console.log("🧠 Estado carregado do disco.");
} catch (err) {
  console.log("📂 Nenhum estado salvo encontrado, iniciando vazio.");
}

const wss = new WebSocket.Server({ port: 8081 });

wss.on("connection", (ws) => {
  console.log("🧠 Novo cliente conectado");

  ws.on("message", (message) => {
    const msg = JSON.parse(message);

    if (msg.type === "get_state") {
      ws.send(JSON.stringify({
        type: "full_state",
        mapImage: state.mapImage,
        tokens: state.tokens,
        combatStarted: state.combatStarted, // <-- incluído aqui
      }));
    }

    if (msg.type === "set_map") {
      state.mapImage = msg.mapImage;
      saveState(); // 💾 salvar após alteração
      broadcast({ 
        type: "full_state", 
        mapImage: state.mapImage, 
        tokens: state.tokens,
        combatStarted: state.combatStarted, 
      });
    }

    if (msg.type === "token_update") {
      state.tokens = msg.tokens;
      saveState(); // Salva o novo estado
      broadcast({
        type: "token_update",
        tokens: state.tokens
      });
    }

    if (msg.type === "start_combat") {
      state.combatStarted = true;
      saveState();
      broadcast({
        type: "combat_status",
        combatStarted: true,
      });
    }

    if (msg.type === "reset_combat") {
      state.tokens = [];
      state.mapImage = null;
      state.combatStarted = false; 
      saveState();

      broadcast({
        type: "full_state",
        mapImage: state.mapImage,
        tokens: state.tokens,
        combatStarted: state.combatStarted,
      });
    }
  });

  ws.on("close", () => {
    console.log("❌ Cliente desconectado");
  });
});

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

// 💾 Salva o estado em disco
function saveState() {
  try {
    const json = JSON.stringify(state, null, 2); // indentado para debug
    fs.writeFileSync(SAVE_FILE, json);
    console.log("💾 Estado salvo com sucesso.");
  } catch (err) {
    console.error("❌ Erro ao salvar estado:", err);
  }
}

console.log("🌐 WebSocket rodando em ws://localhost:8081");
