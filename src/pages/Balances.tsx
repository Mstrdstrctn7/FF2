import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

interface Balance {
  id: string;
  user_id: string;
  coin: string;
  amount: number;
  type: "paper" | "live";
}

export default function Balances() {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const { data, error } = await supabase
        .from("balances")
        .select("*")
        .eq("user_id", userId);

      if (!error && data) {
        setBalances(data);
      }
      setLoading(false);
    };

    fetchBalances();
  }, []);

  const renderTable = (type: "paper" | "live") => {
    const filtered = balances.filter((b) => b.type === type);
    if (filtered.length === 0) return null;

    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-yellow-400 mb-2 capitalize">{type} Balances</h2>
        <div className="overflow-x-auto rounded-xl bg-gray-800 p-4 shadow">
          <table className="min-w-full text-sm text-white">
            <thead className="bg-gray-700">
              <tr>
                <th className="p-3 text-left">Coin</th>
                <th className="p-3 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((bal) => (
                <tr key={bal.id} className="border-t border-gray-600 hover:bg-gray-700">
                  <td className="p-3 uppercase">{bal.coin}</td>
                  <td className="p-3">{bal.amount.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">💰 Your Vault</h1>
      {loading ? (
        <p className="text-center text-gray-400">Gathering treasure...</p>
      ) : balances.length === 0 ? (
        <p className="text-center text-gray-400">No balances found.</p>
      ) : (
        <>
          {renderTable("paper")}
          {renderTable("live")}
        </>
      )}
    </div>
  );
}
