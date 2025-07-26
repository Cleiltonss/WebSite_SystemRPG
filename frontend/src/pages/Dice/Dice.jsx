import "./Dice.css";
import Menu from "../../components/Menu/Menu";
import React, { useState } from "react";

export default function Dice() {
  const [command, setCommand] = useState("");  
  const [successMargin, setSuccessMargin] = useState(6); // default success margin
  const [successCriticalMargin, setSuccessCriticalMargin] = useState(10); // default critical success margin
  const [failureCriticalMargin, setFailureCriticalMargin] = useState(1); // default critical failure margin
  const [results, setResults] = useState([]);
  const [totalSuccess, setTotalSuccess] = useState(0);
  const [error, setError] = useState("");

  // New states for status and failure message
  const [status, setStatus] = useState("");
  const [failureType, setFailureType] = useState("");

  const handleRoll = async () => {
    setError("");
    setResults([]);
    setTotalSuccess(0);
    setStatus("");
    setFailureType("");

    try {
      const backendDicesURL = process.env.REACT_APP_BACKEND_DICES_URL;
      const response = await fetch(
        `${backendDicesURL}/roll?success_critical_margin=${successCriticalMargin}&failure_critical_margin=${failureCriticalMargin}&success_normal_margin=${successMargin}`,
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
        setError(err.error || "Error in response");
        return;
      }

      const data = await response.json();
      setResults(data.rolls || []);
      setTotalSuccess(data.grand_total_successes || 0);

      // Update status and failure message from backend
      setStatus(data.status || "");
      setFailureType(data.failure_type || "");
    } catch (err) {
      setError("Error connecting to server");
    }
  };

  return (
    <div className="dice-page">
      <Menu>
        <button onClick={() => (window.location.href = "/")}>Inicio</button>
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

          <button onClick={handleRoll}>Roll</button>

          <div className="success-margin-box">
            <label htmlFor="success-margin">Margem Sucesso</label>
            <input
              id="success-margin"
              type="number"
              min={1}
              value={successMargin}
              onChange={(e) => setSuccessMargin(Number(e.target.value))}
              title="Success Margin"
            />

            <label htmlFor="success-critical-margin">Margem Sucesso Critico</label>
            <input
              id="success-critical-margin"
              type="number"
              min={1}
              value={successCriticalMargin}
              onChange={(e) => setSuccessCriticalMargin(Number(e.target.value))}
              title="Critical Success Margin"
            />

            <label htmlFor="failure-critical-margin">Margem Falha Critica</label>
            <input
              id="failure-critical-margin"
              type="number"
              min={1}
              value={failureCriticalMargin}
              onChange={(e) => setFailureCriticalMargin(Number(e.target.value))}
              title="Critical Failure Margin"
            />
          </div>
        </div>

        {error && <p className="dice-error">{error}</p>}

        {/* Show critical failure message if status is failure */}
        {status === "failure" && failureType && (
          <p className="dice-error" style={{ fontWeight: "bold", marginTop: "1rem" }}>
            ⚠️ {failureType}
          </p>
        )}

        {results.length > 0 && (
          <div className="dice-results">
            <h3 className="dice-header">Results</h3>
            <ul>
              {results.map((group, idx) => (
                <li key={idx}>
                  <strong>{group.group}</strong>: (
                    {group.roll_details.map((rollArray, rIdx) => (
                      <span key={rIdx}>
                        Roll {rIdx + 1} → [{rollArray.join(", ")}]{rIdx < group.roll_details.length - 1 ? ", " : ""}
                      </span>
                    ))}
                    ) → Successes: {group.total_successes}
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
              🎯 <strong>Total Successes:</strong>{" "}
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
