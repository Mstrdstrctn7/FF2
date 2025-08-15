import React, { useState } from "react";
import axios from "axios";

export default function Trade() {
  const [symbol, setSymbol] = useState("BTC_USDT");
  const [side, setSide] = useState("buy");
  const [amount, setAmount] = useState("10");
  const [status, setStatus] = useState("");

  const handleTrade = async () => {
    setStatus("Placing order...");
    try {
      const response = await axios.post("/.netlify/functions/trade", {
        symbol,
        side,
        amount,
      });
      setStatus(`✅ Success: ${response.data.status}`);
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Error placing trade.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">💱 Execute Trade</h1>
      <div className="bg-gray-800 p-4 rounded shadow-md w-full max-w-sm space-y-4">
        <div>
          <label className="block mb-1 text-sm">Symbol</label>
          <input
            className="w-full p-2 rounded bg-gray-900 text-white"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="e.g., BTC_USDT"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Side</label>
          <select
            className="w-full p-2 rounded bg-gray-900 text-white"
            value={side}
            onChange={(e) => setSide(e.target.value)}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm">Amount (USD)</label>
          <input
            className="w-full p-2 rounded bg-gray-900 text-white"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 50"
          />
        </div>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded w-full"
          onClick={handleTrade}
        >
          {side === "buy" ? "Buy 🔼" : "Sell 🔽"}
        </button>
        {status && <p className="text-sm text-center mt-2">{status}</p>}
      </div>
    </div>
  );
}
