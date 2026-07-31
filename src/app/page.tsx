"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skull, UserPlus, Clock, RefreshCw, MapPin, Map, ShieldAlert } from "lucide-react";

type Player = {
  id: string;
  nick: string;
  expiresAt: string;
  map: string | null;
  coords: string | null;
};

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [nick, setNick] = useState("");
  const [days, setDays] = useState("7");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    fetchPlayers();
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchPlayers = async () => {
    try {
      const res = await fetch("/api/players");
      const data = await res.json();
      setPlayers(data);
    } catch (e) {
      console.error(e);
    }
  };

  const addPlayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nick) return;
    try {
      await fetch("/api/players", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nick, days: Number(days) }),
      });
      setNick("");
      setDays("7");
      fetchPlayers();
    } catch (e) {
      console.error(e);
    }
  };

  const renewPlayer = async (id: string) => {
    try {
      await fetch(`/api/players/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ days: 7 }),
      });
      fetchPlayers();
    } catch (e) {
      console.error(e);
    }
  };

  const removePlayer = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este jogador?")) return;
    try {
      await fetch(`/api/players/${id}`, { method: "DELETE" });
      fetchPlayers();
    } catch (e) {
      console.error(e);
    }
  };

  const activePlayers = players.filter((p) => !isPast(new Date(p.expiresAt)));
  const expiredPlayers = players.filter((p) => isPast(new Date(p.expiresAt)));

  return (
    <div className="min-h-screen relative text-slate-100 flex flex-col items-center py-10 px-4 font-sans selection:bg-red-900/50">
      {/* Background Image with Overlay */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-mu.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px]"></div>
      </div>

      <div className="w-full max-w-5xl">
        <header className="mb-12 text-center flex flex-col items-center">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-800 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)] tracking-widest uppercase mb-4 animate-float font-[family-name:var(--font-cinzel)]" style={{ filter: 'drop-shadow(0 0 50px rgba(220, 38, 38, 0.55)) drop-shadow(0 0 14px rgba(255, 69, 0, 0.35))' }}>
            MU TRACKER
          </h1>
          <p className="text-gray-300 max-w-xl mx-auto text-lg bg-black/40 px-4 py-1 rounded-full border border-red-900/30">
            Painel Avançado de Gerenciamento de Alvos e Imunidades
          </p>
        </header>

        <section className="glass-panel p-6 rounded-xl mb-12 border border-red-900/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900"></div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-400">
            <UserPlus size={20} /> Adicionar Jogador
          </h2>
          <form onSubmit={addPlayer} className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Nick do Personagem"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              className="flex-1 bg-black/50 border border-gray-800 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
              required
            />
            <input
              type="number"
              placeholder="Dias"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              min="1"
              className="w-24 bg-black/50 border border-gray-800 rounded-lg p-3 text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition"
            />
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(21,128,61,0.5)] hover:shadow-[0_0_25px_rgba(34,197,94,0.8)] flex items-center justify-center gap-2"
            >
              <ShieldAlert size={18} /> Cadastrar Imunidade
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!nick) return;
                try {
                  await fetch("/api/players", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nick, days: 0 }),
                  });
                  setNick("");
                  setDays("7");
                  fetchPlayers();
                } catch (e) {
                  console.error(e);
                }
              }}
              className="bg-red-900/50 hover:bg-red-800 text-red-200 border border-red-700/50 px-6 py-3 rounded-lg font-medium transition-all shadow-[0_0_15px_rgba(153,27,27,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] flex items-center justify-center gap-2"
            >
              <Skull size={18} /> Marcar como Alvo
            </button>
          </form>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Active Players */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-green-500 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">
              <ShieldAlert size={24} /> Imunes ({activePlayers.length})
            </h2>
            <div className="space-y-4">
              {activePlayers.map((player) => {
                const expires = new Date(player.expiresAt);
                const totalMs = 7 * 24 * 60 * 60 * 1000; // 7 dias em milissegundos
                const remainingMs = expires.getTime() - now.getTime();
                const progress = Math.max(0, Math.min(100, (remainingMs / totalMs) * 100));

                return (
                  <div key={player.id} className="glass-panel p-5 rounded-xl border border-green-900/30">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white truncate">{player.nick}</h3>
                      <button onClick={() => removePlayer(player.id)} className="text-gray-500 hover:text-red-500 transition">
                        &times;
                      </button>
                    </div>
                    <div className="flex items-center gap-2 text-green-400 mb-1 text-sm font-medium">
                      <Clock size={16} />
                      {formatDistanceToNow(expires, { locale: ptBR })} restantes
                    </div>
                    <div className="w-full bg-gray-900 rounded-full h-1.5 mb-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-600 to-green-400 h-1.5 rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 bg-black/40 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Map size={14} className="text-gray-500" />
                        <span>{player.map || "Aguardando API..."}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-500" />
                        <span>{player.coords || "---"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {activePlayers.length === 0 && (
                <div className="text-gray-500 text-center p-8 border border-dashed border-gray-800 rounded-xl">
                  Nenhum jogador imune no momento.
                </div>
              )}
            </div>
          </section>

          {/* Expired Players */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-red-500 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
              <Skull size={24} /> Alvos / Expirados ({expiredPlayers.length})
            </h2>
            <div className="space-y-4">
              {expiredPlayers.map((player) => (
                <div key={player.id} className="glass-panel p-5 rounded-xl border border-red-900/50 bg-red-950/20">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-red-400 truncate">{player.nick}</h3>
                      <div className="text-sm text-red-500/80 mt-1 uppercase font-bold tracking-widest">
                        Livre para Matar
                      </div>
                    </div>
                    <button onClick={() => removePlayer(player.id)} className="text-gray-500 hover:text-red-500 transition">
                      &times;
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 bg-black/60 p-3 rounded-lg mb-4">
                    <div className="flex items-center gap-2">
                      <Map size={14} className="text-red-900" />
                      <span>{player.map || "Aguardando API..."}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-red-900" />
                      <span>{player.coords || "---"}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => renewPlayer(player.id)}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 border border-gray-700 hover:border-gray-500"
                  >
                    <RefreshCw size={16} /> Renovar 7 Dias
                  </button>
                </div>
              ))}
              {expiredPlayers.length === 0 && (
                <div className="text-gray-500 text-center p-8 border border-dashed border-gray-800 rounded-xl">
                  Nenhum alvo no radar.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
