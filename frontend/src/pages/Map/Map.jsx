import './Map.css';
import Menu from '../../components/Menu/Menu';
import React, { useState, useRef, useEffect } from 'react';

export default function Map() {
  const [mapImage, setMapImage] = useState(null);
  const [selectedTokenImage, setSelectedTokenImage] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [tokens, setTokens] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);
  const [combatStarted, setCombatStarted] = useState(false);
  const previousTokensLength = useRef(0);

  // Novo ref para guardar histórico das células visitadas por cada token durante drag
  const visitedCellsRef = useRef({}); // { tokenIndex: [{x: cellX, y: cellY}, ...], ... }

  // Map and Tokens
  const canvasRef = useRef(null);
  const mapRef = useRef(null);
  const tokenRef = useRef({});
  const currentDraggingPositionRef = useRef(null);

  // Websocket server communication
  const ws = useRef(null);


  // Upload handlers
  const handleMapUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    
    reader.onload = () => {
      setMapImage(reader.result);
      ws.current?.send(JSON.stringify({
        type: "set_map",
        mapImage: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleTokenImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSelectedTokenImage(reader.result);
    reader.readAsDataURL(file);
  };

  const calculateCanvasSize = image => {
    let width = image.width * 2;
    let height = image.height;

    const maxWidth = window.innerWidth * 0.95;
    const maxHeight = window.innerHeight * 0.7;

    if (width > maxWidth) {
      const ratio = maxWidth / width;
      width = maxWidth;
      height *= ratio;
    }

    if (height > maxHeight) {
      const ratio = maxHeight / height;
      height = maxHeight;
      width *= ratio;
    }

    return { width, height };
  };

  // Load map image and update canvas size whenever mapImage changes
  useEffect(() => {
    if (!mapImage) return;
    const image = new Image();
    image.src = mapImage;
    image.onload = () => {
      mapRef.current = image;
      setCanvasSize(calculateCanvasSize(image));
    };
  }, [mapImage]);

  // Recalculate canvas size on window resize, keeping it synced with the current map image
  useEffect(() => {
    const handleResize = () => {
      if (!mapImage) return;
      const image = new Image();
      image.src = mapImage;
      image.onload = () => {
        mapRef.current = image;
        setCanvasSize(calculateCanvasSize(image));
      };
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mapImage]);

  // Upload image of the tokens
  useEffect(() => {
    if (tokens.length === 0) {
      tokenRef.current = {};
      return;
    }
    tokens.forEach(token => {
      if (!tokenRef.current[token.imageSrc]) {
        const img = new Image();
        img.src = token.imageSrc;
        img.onload = () => {
          tokenRef.current[token.imageSrc] = img;
        };
      }
    });
  }, [tokens]);

  // Draw on the canvas
  useEffect(() => {
    drawCanvas();
  }, [canvasSize, mapImage, tokens]);

  
  // General buttons interaction on the map
  // Add token to the map on click
  const handleCanvasClick = e => {
    if (isDragging || !selectedTokenImage || combatStarted) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const image = new Image();
    image.src = mapImage;
    image.onload = () => {
      const gridSize = 50 * (canvas.width / image.width);
      const cellX = Math.floor(clickX / gridSize);
      const cellY = Math.floor(clickY / gridSize);
      const tokenX = cellX * gridSize + gridSize / 2;
      const tokenY = cellY * gridSize + gridSize / 2;
      updateTokensAndBroadcast([...tokens, {
        x: tokenX,
        y: tokenY,
        imageSrc: selectedTokenImage,
        name: `Token ${tokens.length + 1}`,
      }]);
    };
  };

  const startCombat = () => {
    if (tokens.length === 0) return;
    setCombatStarted(true);

    ws.current?.send(JSON.stringify({
      type: "start_combat",
      combatStarted: true
    }));
  };

  const resetCombat = () => {
    setTokens([]);
    setCombatStarted(false);
    previousTokensLength.current = 0;
    tokenRef.current = {};
    
    // Notify all the windows by WebSocket
    ws.current?.send(JSON.stringify({ 
      type: "reset_combat",
    }));
  };


  // Drag & Drop dos tokens
  // Press the mouse
  const handleMouseDown = e => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const index = tokens.findIndex(token =>
      Math.hypot(token.x - mouseX, token.y - mouseY) <= 20
    );
    if (index !== -1) {
      setDraggingIndex(index);
      setIsDragging(true);
    }
  };

  // Hold the mouse
  const handleMouseMove = e => {
    if (draggingIndex === null) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const image = mapRef.current;
    if (!image) return;

    const gridSize = 50 * (canvasRef.current.width / image.width);
    const cellX = Math.floor(mouseX / gridSize);
    const cellY = Math.floor(mouseY / gridSize);
    const tokenX = cellX * gridSize + gridSize / 2;
    const tokenY = cellY * gridSize + gridSize / 2;

    currentDraggingPositionRef.current = { x: tokenX, y: tokenY, cellX, cellY };

    // Atualiza histórico de células visitadas
    if (!visitedCellsRef.current[draggingIndex]) {
      visitedCellsRef.current[draggingIndex] = [];
    }

    const visitedCells = visitedCellsRef.current[draggingIndex];
    const lastCell = visitedCells.length > 0 ? visitedCells[visitedCells.length - 1] : null;

    if (!lastCell || lastCell.x !== cellX || lastCell.y !== cellY) {
      visitedCells.push({ x: cellX, y: cellY });
      if (visitedCells.length > 30) visitedCells.shift();
    }

    drawCanvas(); // call to re-draw the temporary position
  };

  // Release the mouse
  const handleMouseUp = () => {
    if (draggingIndex !== null && currentDraggingPositionRef.current) {
      const updated = tokens.map((token, idx) => {
        if (idx === draggingIndex) {
          return {
            ...token,
            x: currentDraggingPositionRef.current.x,
            y: currentDraggingPositionRef.current.y
          };
        }
        return token;
      });

      updateTokensAndBroadcast(updated);
    }

    setDraggingIndex(null);
    setIsDragging(false);
    visitedCellsRef.current = {};
    currentDraggingPositionRef.current = null;
  };

  // Draw canvas
  const drawCanvas = () => {
    if (!mapRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = mapRef.current;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const gridSize = 50 * (canvas.width / image.width);

    // Grid
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.6)';
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Moving Token Path
    if (isDragging && draggingIndex !== null) {
      const visitedCells = visitedCellsRef.current[draggingIndex];
      if (visitedCells?.length > 0) {
        ctx.fillStyle = 'rgba(216, 226, 23, 0.3)';
        visitedCells.forEach(cell => {
          ctx.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize, gridSize);
        });
      }
    }

    // Tokens
    tokens.forEach((token, idx) => {
      const tokenImg = tokenRef.current[token.imageSrc];
      if (!tokenImg) return;
      const size = gridSize;
      
      let x = token.x;
      let y = token.y;

      // Se este é o token em movimento, use a posição temporária
      if (isDragging && idx === draggingIndex && currentDraggingPositionRef.current) {
        x = currentDraggingPositionRef.current.x;
        y = currentDraggingPositionRef.current.y;
      }

      ctx.drawImage(tokenImg, x - size / 2, y - size / 2, size, size);
    });
  };


  // Websocket Server
  useEffect(() => {
    const isDocker = window.location.hostname !== 'localhost';
    const wsUrl = isDocker
      ? 'ws://websocket:8081'
      : 'ws://localhost:8081';

    ws.current = new WebSocket(wsUrl);
    window.ws = ws.current;


    ws.current.onopen = () => {
      console.log("✅ WebSocket connected from Map.jsx");
    };

    const sendWhenOpen = () => {
      if (ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: "get_state" }));
      } else {
        // tenta de novo em 50ms se ainda não estiver aberto
        setTimeout(sendWhenOpen, 50);
      }
    };

    sendWhenOpen();

    ws.current.onmessage = (event) => {
      if (typeof event.data === 'string') {
        const msg = JSON.parse(event.data);
        handleMessage(msg);
      } else if (event.data instanceof Blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result;
          const msg = JSON.parse(text);
          handleMessage(msg);
        };
        reader.readAsText(event.data);
      } else {
        console.warn('Tipo de dado recebido não suportado:', event.data);
      }
    };

    function handleMessage(msg) {
      if (msg.type === "full_state") {
        setMapImage(msg.mapImage);
        setTokens(msg.tokens);
        setCombatStarted(msg.combatStarted || false); // <-- Make sure to set the state
      }

      if (msg.type === "token_update") {
        setTokens(msg.tokens);
      }

      if (msg.type === "combat_status") {
        setCombatStarted(msg.combatStarted); // <-- Update locally
      }
    }

    ws.current.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
    };

    ws.current.onclose = (event) => {
      console.log("🔌 WebSocket connection closed.");
      console.log('WebSocket fechado:', event);
    };

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, []);

  // Auxiliar function to websocket saving position of tokens
  const updateTokensAndBroadcast = (newTokens) => {
    setTokens(newTokens);
    ws.current?.send(JSON.stringify({
      type: "token_update",
      tokens: newTokens,
    }));
  };


  return (
    <div className="map-page">
      <Menu>
        <button onClick={() => (window.location.href = '/')}>Inicio</button>
        <button onClick={() => (window.location.href = '/system')}>Sistema</button>
        <button onClick={() => (window.location.href = '/equipment')}>Equipamento</button>
        <button onClick={() => (window.location.href = '/character')}>Personagem</button>
        <button onClick={() => (window.location.href = '/dice')}>Dados</button>
        <button onClick={() => (window.location.href = '/map')}>Mapa</button>
      </Menu>

      <div className="map-insert">
        <div className="map-controls">
          {!combatStarted && (
            <>
              <label htmlFor="map-upload" className="custom-file-upload">Inserir MAPA</label>
              <input id="map-upload" type="file" accept="image/*" onChange={handleMapUpload} style={{ display: 'none' }} />

              <label htmlFor="token-upload" className="custom-file-upload">Inserir TOKEN</label>
              <input id="token-upload" type="file" accept="image/*" onChange={handleTokenImageUpload} style={{ display: 'none' }} />

              <button className="control-button" onClick={startCombat}>Iniciar Combate</button>
              <button className="control-button" onClick={resetCombat}>Voltar Tudo</button>
            </>
          )}

          {combatStarted && (
            <button className="control-button" onClick={resetCombat}>Voltar Tudo</button>
          )}
        </div>

        <div className="map-canvas">
          {mapImage && (
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              width={canvasSize.width}
              height={canvasSize.height}
            />
          )}
        </div>

        <div className="token-container">
          <h3 className="token-header">Personagens</h3>
          <ul>
            {tokens.map((token, idx) => (
              <li key={idx}>
                <input
                  type="text"
                  value={token.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    const updatedTokens = [...tokens];
                    updatedTokens[idx] = { ...token, name: newName };
                    updateTokensAndBroadcast(updatedTokens);
                  }}
                  className="token-name-input"
                />
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
