import React, { useState } from "react";
import axios from "axios";

export default function Trade() {
  const [symbol, setSymbol] = useState("BTC_USDT");
  const [side, setSide] = useState("buy");
  const [amount, setAmount] = useState(10);
  const [message, setMessage] = useState("");

  const handleTrade = async () => {
    try {
      const response = await axios.post("/.netlify/functions/trade", {
        symbol,
        side,
        amount,
      });
      setMessage(response.data.message || "Trade executed.");
    } catch (error: any) {
      console.error("Trade error:", error);
      setMessage("Trade failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">⚔️ Execute Trade</h1>

      <div className="space-y-4 w-full max-w-sm">
        <div>
          <label className="block mb-1 text-gray-300">Symbol</label>
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="BTC_USDT"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Side</label>
          <select
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            value={side}
            onChange={(e) => setSide(e.target.value)}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Amount (USDT)</label>
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>

        <button
          onClick={handleTrade}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded w-full"
        >
          Trade Now
        </button>

        {message && <p className="text-yellow-300 mt-4">{message}</p>}
      </div>
    </div>
  );
}
