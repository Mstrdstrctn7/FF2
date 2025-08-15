import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Settings() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email || "");

        const { data } = await supabase
          .from("profiles")
          .select("bio")
          .eq("id", user.id)
          .single();

        if (data) {
          setBio(data.bio || "");
        }
      }

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const updateProfile = async () => {
    setMessage("Saving...");
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("profiles").upsert({
      id: user?.id,
      bio,
      updated_at: new Date().toISOString(),
    });

    setMessage(error ? "Error saving profile." : "Profile updated.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-yellow-400 mb-6">⚙️ Account Settings</h1>

      <div className="space-y-4 w-full max-w-sm">
        <div>
          <label className="block mb-1 text-gray-300">Email</label>
          <input
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            type="text"
            value={email}
            disabled
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-300">Bio</label>
          <textarea
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <button
          onClick={updateProfile}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded w-full"
          disabled={loading}
        >
          Save Changes
        </button>

        {message && <p className="text-yellow-300 mt-4">{message}</p>}
      </div>
    </div>
  );
}
