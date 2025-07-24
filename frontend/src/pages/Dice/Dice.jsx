import "./Dice.css";
import Menu from "../../components/Menu/Menu";
import React, { useState } from "react";

export default function Dice() {
  const [command, setCommand] = useState("");  
  const [successMargin, setSuccessMargin] = useState(6); // default
  const [successCriticalMargin, setSuccessCriticalMargin] = useState(10); // default crítico
  const [failureCriticalMargin, setFailureCriticalMargin] = useState(1); // default falha crítica
  const [results, setResults] = useState([]);
  const [totalSuccess, setTotalSuccess] = useState(0);
  const [error, setError] = useState("");

  const handleRoll = async () => {
    setError("");
    setResults([]);
    setTotalSuccess(0);

    try {
      const response = await fetch(
        `http://localhost:8080/roll?success_margin=${successMargin}&success_critical=${successCriticalMargin}&failure_critical=${failureCriticalMargin}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain"
          },
          body: command,
        }
      );

      if (!response.ok) {
        const err = await response.json();
        setError(err.error || "Erro na resposta");
        return;
      }

      const data = await response.json();
      setResults(data.rolls || []);
      setTotalSuccess(data.grand_total_successes || 0);
    } catch (err) {
      setError("Erro ao conectar no servidor");
    }
  };

  return (
    <div className="dice-page">
      <Menu>
        <button onClick={() => (window.location.href = "/")}>Início</button>
        <button onClick={() => (window.location.href = "/system")}>Sistema</button>
        <button onClick={() => (window.location.href = "/equipment")}>Equipamento</button>
        <button onClick={() => (window.location.href = "/character")}>Personagem</button>
        <button onClick={() => (window.location.href = "/dice")}>Dados</button>
        <button onClick={() => (window.location.href = "/map")}>Mapa</button>
      </Menu>

      <div style={{ padding: "20px" }}>
        <div className="dice-command-box">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="!roll XdY [+ PdQ + ...]"
          />

          <button onClick={handleRoll}>Rolar</button>

          <div className="success-margin-box">
            <label htmlFor="success-margin">Margem de Sucesso</label>
            <input
              id="success-margin"
              type="number"
              min={1}
              value={successMargin}
              onChange={(e) => setSuccessMargin(Number(e.target.value))}
              title="Margem de Sucesso"
            />

            <label htmlFor="success-critical-margin">Margem de Sucesso Crítico</label>
            <input
              id="success-critical-margin"
              type="number"
              min={1}
              value={successCriticalMargin}
              onChange={(e) => setSuccessCriticalMargin(Number(e.target.value))}
              title="Margem de Sucesso Crítico"
            />

            <label htmlFor="failure-critical-margin">Margem de Falha Crítica</label>
            <input
              id="failure-critical-margin"
              type="number"
              min={1}
              value={failureCriticalMargin}
              onChange={(e) => setFailureCriticalMargin(Number(e.target.value))}
              title="Margem de Falha Crítica"
            />
          </div>
        </div>

        {error && <p className="dice-error">{error}</p>}

        {results.length > 0 && (
          <div className="dice-results">
            <h3 className="dice-header">Resultados</h3>
            <ul>
              {results.map((group, idx) => (
                <li key={idx}>
                  <strong>{group.group}</strong>: (
                    {group.roll_details.map((roll, rIdx) => (
                      <span key={rIdx}>
                        Reroll {roll.reroll} → [{roll.dice.join(", ")}]
                      </span>
                    ))}
                    ) → Sucessos: {group.total_successes}
                </li>
              ))}
            </ul>
            <p
              className={`dice-success-count ${
                totalSuccess > 0
                  ? "dice-success-positive"
                  : totalSuccess < 0
                  ? "dice-success-negative"
                  : ""
              }`}
            >
              🎯 <strong>Total Sucessos:</strong>{" "}
              <span
                className={`dice-success-number ${
                  totalSuccess > 0
                    ? "dice-success-positive"
                    : totalSuccess < 0
                    ? "dice-success-negative"
                    : ""
                }`}
              >
                {totalSuccess}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
