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
  const [initiativeOrder, setInitiativeOrder] = useState([]);
  const [combatStarted, setCombatStarted] = useState(false);
  const previousTokensLength = useRef(0);

  // Cache das imagens dos tokens
  const [tokenImagesCache, setTokenImagesCache] = useState({});

  // Novo ref para guardar histórico das células visitadas por cada token durante drag
  const visitedCellsRef = useRef({}); // { tokenIndex: [{x: cellX, y: cellY}, ...], ... }

  const canvasRef = useRef(null);
  const tokenRadius = 20;

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

  useEffect(() => {
    if (!mapImage) return;
    const image = new Image();
    image.src = mapImage;
    image.onload = () => setCanvasSize(calculateCanvasSize(image));
  }, [mapImage]);

  useEffect(() => {
    const handleResize = () => {
      if (!mapImage) return;
      const image = new Image();
      image.src = mapImage;
      image.onload = () => setCanvasSize(calculateCanvasSize(image));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mapImage]);

  // Carregar imagens dos tokens no cache
  useEffect(() => {
    if (tokens.length === 0) {
      setTokenImagesCache({});
      return;
    }
    tokens.forEach(token => {
      if (!tokenImagesCache[token.imageSrc]) {
        const img = new Image();
        img.src = token.imageSrc;
        img.onload = () => {
          setTokenImagesCache(prev => ({ ...prev, [token.imageSrc]: img }));
        };
      }
    });
  }, [tokens]);

  // Desenhar no canvas
  useEffect(() => {
    if (!mapImage || canvasSize.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.src = mapImage;

    image.onload = () => {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Grid
      const gridSize = 50 * (canvas.width / image.width);
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

      // >>> Desenhar trajetória dos tokens em movimento
      if (isDragging && draggingIndex !== null) {
        const visitedCells = visitedCellsRef.current[draggingIndex];
        if (visitedCells && visitedCells.length > 0) {
          ctx.fillStyle = 'rgba(216, 226, 23, 0.3)';
          visitedCells.forEach(cell => {
            ctx.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize, gridSize);
          });
        }
      }

      // Desenha tokens
      tokens.forEach(token => {
        const tokenImg = tokenImagesCache[token.imageSrc];
        if (tokenImg) {
          const size = gridSize;
          ctx.drawImage(tokenImg, token.x - size / 2, token.y - size / 2, size, size);
        }
      });
    };
  }, [canvasSize, mapImage, tokens, tokenImagesCache]);

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

  const iniciarCombate = () => {
    if (tokens.length === 0) return;
    if (initiativeOrder.length !== tokens.length) {
      const order = tokens.map((_, idx) => idx);
      setInitiativeOrder(order);
    }
    setCombatStarted(true);
  };

  const resetCombat = () => {
    setTokens([]);
    setInitiativeOrder([]);
    setCombatStarted(false);
    previousTokensLength.current = 0;
    setTokenImagesCache({});
    
    // Notifica todas as abas via WebSocket
    ws.current?.send(JSON.stringify({ type: "reset_combat" }));
  };

  useEffect(() => {
    if (tokens.length === 0) {
      setInitiativeOrder([]);
      previousTokensLength.current = 0;
      return;
    }

    if (tokens.length !== previousTokensLength.current) {
      setInitiativeOrder(tokens.map((_, idx) => idx));
      previousTokensLength.current = tokens.length;
    }
  }, [tokens]);

  // Drag & Drop dos tokens
  const handleMouseDown = e => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const index = tokens.findIndex(token =>
      Math.hypot(token.x - mouseX, token.y - mouseY) <= tokenRadius
    );
    if (index !== -1) {
      setDraggingIndex(index);
      setIsDragging(true);
    }
  };

  const handleMouseMove = e => {
    if (draggingIndex === null) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const canvas = canvasRef.current;
    const image = new Image();
    image.src = mapImage;
    image.onload = () => {
      const gridSize = 50 * (canvas.width / image.width);
      const cellX = Math.floor(mouseX / gridSize);
      const cellY = Math.floor(mouseY / gridSize);
      const tokenX = cellX * gridSize + gridSize / 2;
      const tokenY = cellY * gridSize + gridSize / 2;

      // Atualiza a posição do token arrastado
      const updated = tokens.map((token, idx) => {
        if (idx === draggingIndex) {
          return { ...token, x: tokenX, y: tokenY };
        }
        return token;
      });

      updateTokensAndBroadcast(updated);

      // Atualiza histórico de células visitadas para o token sendo arrastado
      if (!visitedCellsRef.current[draggingIndex]) {
        visitedCellsRef.current[draggingIndex] = [];
      }
      const visitedCells = visitedCellsRef.current[draggingIndex];
      const lastCell = visitedCells.length > 0 ? visitedCells[visitedCells.length - 1] : null;

      if (!lastCell || lastCell.x !== cellX || lastCell.y !== cellY) {
        visitedCells.push({ x: cellX, y: cellY });
        if (visitedCells.length > 30) visitedCells.shift(); // limite a 30 células
      }
    };
  };


  const handleMouseUp = () => {
    setDraggingIndex(null);
    setIsDragging(false);
    // Limpa histórico após soltar o token
    visitedCellsRef.current = {};
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
      }
      if (msg.type === "token_update") {
        setTokens(msg.tokens);
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

              <button className="control-button" onClick={iniciarCombate}>Iniciar Combate</button>
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
            {initiativeOrder.map((idx, i) => (
              <li key={i}>
                {tokens[idx] ? (
                  <input
                    type="text"
                    value={tokens[idx].name}
                    onChange={(e) => {
                      const newName = e.target.value;

                      // Valida se o índice é válido
                      if (idx >= 0 && idx < tokens.length) {
                        const updatedTokens = [...tokens];
                        updatedTokens[idx] = { ...updatedTokens[idx], name: newName };
                        updateTokensAndBroadcast(updatedTokens);
                      }
                    }}
                    className="token-name-input"
                  />
                ) : (
                  'Token removido'
                )}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
