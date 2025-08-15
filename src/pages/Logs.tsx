import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface Trade {
  id: string;
  coin: string;
  side: "buy" | "sell";
  amount: number;
  price: number;
  created_at: string;
  mode: "paper" | "live";
}

export default function Logs() {
  const [logs, setLogs] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const { data: paper, error: paperErr } = await supabase
        .from("paper_trades")
        .select("*")
        .eq("user_id", userId);

      const { data: live, error: liveErr } = await supabase
        .from("live_trades")
        .select("*")
        .eq("user_id", userId);

      if (!paperErr && !liveErr) {
        const allTrades: Trade[] = [
          ...(paper || []).map((t) => ({ ...t, mode: "paper" })),
          ...(live || []).map((t) => ({ ...t, mode: "live" })),
        ];
        setLogs(allTrades.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)));
      }

      setLoading(false);
    };

    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4 text-center">📜 Trading Logs</h1>

      {loading ? (
        <p className="text-gray-400 text-center">Retrieving battle records...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-400 text-center">No trades forged yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700 text-yellow-300">
              <tr>
                <th className="p-3 text-left">Mode</th>
                <th className="p-3 text-left">Coin</th>
                <th className="p-3 text-left">Side</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((trade) => (
                <tr key={trade.id} className="border-t border-gray-700 hover:bg-gray-700">
                  <td className="p-3">{trade.mode}</td>
                  <td className="p-3 uppercase">{trade.coin}</td>
                  <td className="p-3">{trade.side}</td>
                  <td className="p-3">{trade.amount}</td>
                  <td className="p-3">${trade.price.toFixed(2)}</td>
                  <td className="p-3">{new Date(trade.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
