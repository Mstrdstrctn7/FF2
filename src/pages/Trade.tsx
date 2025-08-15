import React, { useState } from "react";
import axios from "axios";

export default function Trade() {
  const [symbol, setSymbol] = useState("BTC_USDT");
  const [side, setSide] = useState("buy");
  const [amount, setAmount] = useState("0.01");
  const [mode, setMode] = useState("paper"); // paper or live
  const [message, setMessage] = useState("");

  const handleTrade = async () => {
    try {
      const response = await axios.post("/.netlify/functions/trade", {
        symbol,
        side,
        amount,
        mode,
      });

      if (response.data.success) {
        setMessage("✅ Trade placed successfully.");
      } else {
        setMessage(`❌ ${response.data.message}`);
      }
    } catch (err: any) {
      setMessage(`❌ Trade failed: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">⚔️ Trade Arena</h1>
      <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Coin Pair</label>
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full bg-gray-700 border-none rounded p-2 text-white"
          >
            <option value="BTC_USDT">BTC / USDT</option>
            <option value="ETH_USDT">ETH / USDT</option>
            <option value="SOL_USDT">SOL / USDT</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Trade Type</label>
          <select
            value={side}
            onChange={(e) => setSide(e.target.value)}
            className="w-full bg-gray-700 border-none rounded p-2 text-white"
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-gray-700 border-none rounded p-2 text-white"
            placeholder="e.g. 0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full bg-gray-700 border-none rounded p-2 text-white"
          >
            <option value="paper">Paper</option>
            <option value="live">Live</option>
          </select>
        </div>

        <button
          onClick={handleTrade}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded mt-4 transition-all duration-200"
        >
          Submit Trade
        </button>

        {message && <p className="mt-4 text-sm text-center">{message}</p>}
      </div>
    </div>
  );
}
