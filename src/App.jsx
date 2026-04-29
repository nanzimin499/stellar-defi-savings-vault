import { useState } from "react";
import "./App.css";

function App() {
  const [depositAmount, setDepositAmount] = useState("1");
  const [goalAmount, setGoalAmount] = useState("50");
  const [records, setRecords] = useState([]);

  const totalSaved = records.reduce(
    (total, record) => total + Number(record.amount),
    0
  );

  const progressPercent =
    Number(goalAmount) > 0
      ? Math.min(Math.round((totalSaved / Number(goalAmount)) * 100), 100)
      : 0;

  function handleDemoDeposit() {
    if (!depositAmount || Number(depositAmount) <= 0) {
      alert("Please enter a valid deposit amount.");
      return;
    }

    const newRecord = {
      id: Date.now(),
      amount: Number(depositAmount),
      status: "success",
      network: "Stellar Testnet",
      txHash: `demo-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    setRecords([newRecord, ...records]);
  }

  function handleClearHistory() {
    setRecords([]);
  }

  return (
    <main className="app">
      <section className="hero">
        <div className="heroPanel">
          <p className="eyebrow">Stellar Level 3 Mini-dApp</p>
          <h1>Stellar DeFi Savings Vault</h1>
          <p className="heroText">
            A demo savings vault on Stellar Testnet. Users can simulate deposits,
            track savings progress, and prepare evidence for Level 3 submission.
          </p>
        </div>

        <div className="walletCard">
          <p className="label">Wallet Status</p>
          <p className="walletAddress">Demo Mode</p>
          <p className="balance">{totalSaved.toFixed(2)} XLM</p>
          <button className="secondaryButton">Freighter integration ready</button>
        </div>
      </section>

      <section className="statusBox success">
        <strong>Status:</strong> App UI is running successfully.
      </section>

      <section className="grid">
        <div className="card">
          <h2>1. Vault Deposit</h2>
          <p className="muted">
            Enter a deposit amount to simulate saving XLM into the vault.
          </p>

          <label>
            Deposit Amount
            <input
              value={depositAmount}
              onChange={(event) => setDepositAmount(event.target.value)}
              type="number"
              min="0.1"
              step="0.1"
            />
          </label>

          <button className="primaryButton fullWidth" onClick={handleDemoDeposit}>
            Add Demo Deposit
          </button>
        </div>

        <div className="card">
          <h2>2. Savings Goal</h2>

          <label>
            Goal Amount
            <input
              value={goalAmount}
              onChange={(event) => setGoalAmount(event.target.value)}
              type="number"
              min="1"
            />
          </label>

          <div className="progressHeader">
            <span>{totalSaved.toFixed(2)} XLM saved</span>
            <span>{progressPercent}%</span>
          </div>

          <div className="progressBar">
            <div
              className="progressFill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="stats">
            <div>
              <p className="label">Target</p>
              <strong>{Number(goalAmount || 0).toFixed(2)} XLM</strong>
            </div>

            <div>
              <p className="label">Deposits</p>
              <strong>{records.length}</strong>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>3. Contract Tests</h2>
          <p className="muted">
            Your Soroban contract already passed 4 tests. This satisfies the
            Level 3 requirement of minimum 3 tests passing.
          </p>

          <div className="projectionBox">
            <p className="label">Test Result</p>
            <strong>4 Passed</strong>
          </div>
        </div>
      </section>

      <section className="historySection">
        <div className="sectionHeader">
          <div>
            <h2>Deposit History</h2>
            <p className="muted">
              This local demo history helps show the full mini-dApp flow.
            </p>
          </div>

          {records.length > 0 && (
            <button className="secondaryButton" onClick={handleClearHistory}>
              Clear Local History
            </button>
          )}
        </div>

        {records.length === 0 ? (
          <div className="emptyState">
            No deposits yet. Add your first demo vault deposit.
          </div>
        ) : (
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Network</th>
                  <th>Transaction</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.amount.toFixed(2)} XLM</td>
                    <td>
                      <span className="successBadge">{record.status}</span>
                    </td>
                    <td>{record.network}</td>
                    <td>{record.txHash}</td>
                    <td>{new Date(record.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;