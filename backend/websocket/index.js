const WebSocket = require('ws');

const port = 8081; // websocket gate
const wss = new WebSocket.Server({ port });

let clients = [];

wss.on('connection', (ws) => {
    console.log('New client connected');
    clients.push(ws);

    ws.on('message', (message) => {
        try {
            console.log('📩 Received:', message);

            // Se quiser tratar como JSON:
            // const data = JSON.parse(message);

            clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });

        } catch (error) {
            console.error("❌ Error handling message:", error.message);
            // Você pode também:
            // ws.send(JSON.stringify({ error: "Invalid message format" }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients = clients.filter(c => c !== ws);
    });
});

console.log(`WebSocket server running on ws://localhost:${port}`);