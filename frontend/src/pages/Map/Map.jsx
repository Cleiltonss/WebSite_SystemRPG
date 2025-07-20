// imports
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
  const [initiativeOrder, setInitiativeOrder] = useState([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [turnCounter, setTurnCounter] = useState(1);
  const canvasRef = useRef(null);
  const previousTokensLength = useRef(tokens.length);
  const tokenRadius = 20;
  

  // Upload do mapa
  const handleMapUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setMapImage(reader.result);
    reader.readAsDataURL(file);
  };

  // Upload do token
  const handleTokenImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSelectedTokenImage(reader.result);
    reader.readAsDataURL(file);
  };

  // Resetar tudo
  const handleResetTokens = () => {
    setTokens([]);
    setInitiativeOrder([]);
    setCombatStarted(false);
    setCurrentTurnIndex(0);
    setTurnCounter(1);
  };

  const resetCombat = () => {
    setTokens([]);
    setMapImage(null);
    setInitiativeOrder([]);
    setCombatStarted(false);
    setCurrentTurnIndex(0);
    setTurnCounter(1);
  };


  // Calcular tamanho do canvas baseado na imagem
  const calculateCanvasSize = image => {
    let width = image.width * 2;  // aumenta a largura em 50%
    let height = image.height;      // mantém  a altura original

    // Opcional: limita o tamanho para não ultrapassar a tela
    const maxWidth = window.innerWidth * 0.95;
    const maxHeight = window.innerHeight * 0.7;

    if (width > maxWidth) {
      const ratio = maxWidth / width;
      width = maxWidth;
      height = height * ratio;
    }

    if (height > maxHeight) {
      const ratio = maxHeight / height;
      height = maxHeight;
      width = width * ratio;
    }

    return { width, height };
  };


  // Redimensionar canvas ao carregar imagem
  useEffect(() => {
    if (!mapImage) return;
    const image = new Image();
    image.src = mapImage;
    image.onload = () => setCanvasSize(calculateCanvasSize(image));
  }, [mapImage]);

  
  // Redesenhar canvas
  useEffect(() => {
    if (!mapImage || canvasSize.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = mapImage;

    image.onload = async () => {
      canvas.width = canvasSize.width;
      canvas.height = canvasSize.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

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

      // Função que carrega uma imagem e retorna Promise com a imagem pronta
      const loadImage = (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(img);
        });

      // Carrega todas as imagens dos tokens
      const loadedTokenImages = await Promise.all(
        tokens.map(token => loadImage(token.imageSrc))
      );

      loadedTokenImages.forEach((tokenImg, idx) => {
        const token = tokens[idx];
        const size = gridSize;

        // Desenha círculo se for o token da vez
        if (combatStarted && idx === initiativeOrder[currentTurnIndex]) {
          ctx.beginPath();
          ctx.arc(token.x, token.y, size / 2 + 6, 0, 2 * Math.PI);
          ctx.strokeStyle = 'yellow';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Desenha o token
        ctx.drawImage(tokenImg, token.x - size / 2, token.y - size / 2, size, size);
      });
    };
  }, [canvasSize, mapImage, tokens, combatStarted, initiativeOrder, currentTurnIndex]);


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

  // Clique para adicionar token
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
      setTokens(prev => [...prev, { x: tokenX, y: tokenY, imageSrc: selectedTokenImage, name: `Token ${prev.length + 1}` }]);
    };
  };

  // Iniciar combate
  const iniciarCombate = () => {
    // Se a ordem estiver incompleta, usa ordem padrão
    let finalOrder = initiativeOrder.length === tokens.length
      ? initiativeOrder
      : tokens.map((_, index) => index);
      
    setInitiativeOrder(finalOrder);
    setCombatStarted(true);
    setCurrentTurnIndex(0);
    setTurnCounter(1);
  };


  // Avançar turno
  const nextTurn = () => {
    if (!combatStarted || initiativeOrder.length === 0) return;
    

    const isLastToken = currentTurnIndex === initiativeOrder.length - 1; 
    setCurrentTurnIndex((currentTurnIndex + 1) % initiativeOrder.length);
    
    // Verifica se ele completou
    if (isLastToken) {
      setTurnCounter(prev => prev + 1);
    }
  };


  // Voltar jogada
  const previousMove = () => {
    if (!combatStarted || initiativeOrder.length === 0) return;

    const isFirstToken = currentTurnIndex === 0;

    if (isFirstToken && turnCounter === 1) {return;} // Evita voltar além do início

    const newIndex = (currentTurnIndex - 1 + initiativeOrder.length) % initiativeOrder.length;
    setCurrentTurnIndex(newIndex); // Atualiza
    
    if (isFirstToken && turnCounter > 1) {
      setTurnCounter(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (tokens.length === 0) {
      setInitiativeOrder([]);
      previousTokensLength.current = 0;
      return;
    }

    // Se mudou o número de tokens, resetar a ordem
    if (tokens.length !== previousTokensLength.current) {
      setInitiativeOrder(tokens.map((_, idx) => idx));
      previousTokensLength.current = tokens.length;
    }
    // Se o tamanho não mudou, mantém a ordem (não faz nada)
  }, [tokens]);




  // Controle de movimento
  const handleMouseDown = e => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const index = tokens.findIndex(token =>
      Math.hypot(token.x - mouseX, token.y - mouseY) <= tokenRadius
    );
    if (index !== -1 && (!combatStarted || index === initiativeOrder[currentTurnIndex])) {
      setDraggingIndex(index);
      setIsDragging(true);
    }
  };

  const handleMouseMove = e => {
    if (draggingIndex === null) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setTokens(prev => {
      const updated = [...prev];
      updated[draggingIndex] = { ...updated[draggingIndex], x: mouseX, y: mouseY };
      return updated;
    });
  };

  const handleMouseUp = () => {
    setDraggingIndex(null);
    setIsDragging(false);
  };

  
  // Reordenar iniciativa
  const moveInitiative = (index, direction) => {
    setInitiativeOrder(prev => {
      const updated = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= updated.length) return prev;
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      return updated;
    });
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
            <>
              <button className="control-button" onClick={nextTurn}>Próximo</button>
              <button className="control-button" onClick={previousMove}>Voltar</button>
              <button className="control-button" onClick={resetCombat}>Voltar Tudo</button>
            </>
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
              style={{ border: '1px solid #000' }}
            />
          )}
        </div>

        {!combatStarted && tokens.length > 0 && (
        <div className="initiative-setup">
          <h4 style={{ color: 'white', marginBottom: '16px' }}>Definir Ordem de Iniciativa</h4>
          
          {tokens.map((token, idx) => (
            <div key={idx} className="token-name-container">
              <img
                src={token.imageSrc}
                alt={`token ${idx}`}
                className="token-preview"
              />
              
              <input
                className="token-name-input"
                type="text"
                value={token.name}
                onChange={(e) => {
                  const newName = e.target.value;
                  setTokens(prev => {
                    const updated = [...prev];
                    updated[idx] = { ...updated[idx], name: newName };
                    return updated;
                  });
                }}
                placeholder={`Token ${idx + 1}`}
              />

              <select
                className="initiative-select"
                value={initiativeOrder.indexOf(idx) + 1 || ''}
                onChange={(e) => {
                  const pos = parseInt(e.target.value) - 1;
                  if (isNaN(pos)) return;
                  setInitiativeOrder(prev => {
                    const newOrder = [...prev];
                    const currentIdx = newOrder.indexOf(idx);
                    if (currentIdx !== -1) newOrder.splice(currentIdx, 1);
                    newOrder.splice(pos, 0, idx);
                    return newOrder;
                  });
                }}
              >
                <option value="">--</option>
                {tokens.map((_, i) => (
                  <option key={i} value={i + 1}>{i + 1}º</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        )}



        {combatStarted && (
          <div className="initiative-panel">
            <h4>Iniciativa</h4>
            {initiativeOrder.map((tokenIndex, idx) => (
              <div key={idx} className="initiative-token">
                <img src={tokens[tokenIndex].imageSrc} alt={`token ${idx}`} />
                <span>{tokens[tokenIndex].name}</span>
                {idx === currentTurnIndex && <strong> ← Ativo</strong>}
                <button onClick={() => moveInitiative(idx, -1)}>↑</button>
                <button onClick={() => moveInitiative(idx, 1)}>↓</button>
              </div>
            ))}

            {/* Contador de turno posicionado abaixo da lista de iniciativa */}
            <p className="turn-counter">Turno: {turnCounter}</p>
          </div>
        )}

      </div>
    </div>
  );
}