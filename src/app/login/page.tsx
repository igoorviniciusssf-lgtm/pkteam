'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Skull, Lock, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        router.push('/');
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || 'Credenciais inválidas');
      }
    } catch (err) {
      setError('Erro ao tentar conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 selection:bg-red-900/50">
      {/* Background idêntico ao painel */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-mu.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/85 backdrop-blur-[2px]"></div>
      </div>

      <div className="glass-panel w-full max-w-md p-8 rounded-xl border border-red-900/60 shadow-[0_0_40px_rgba(220,38,38,0.15)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900 via-red-500 to-red-900 opacity-50"></div>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full bg-red-950/50 flex items-center justify-center border border-red-800/50 mb-4 shadow-[0_0_15px_rgba(220,38,38,0.3)]">
            <ShieldAlert size={32} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-700 font-[family-name:var(--font-cinzel)] uppercase tracking-wider text-center" style={{ filter: 'drop-shadow(0 0 10px rgba(220, 38, 38, 0.4))' }}>
            Acesso Restrito
          </h1>
          <p className="text-red-500/80 text-sm mt-2 font-light">Painel de Gerenciamento MU Tracker</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-950/80 border border-red-800/50 text-red-400 px-4 py-3 rounded text-sm text-center flex items-center justify-center gap-2">
              <Skull size={16} />
              {error}
            </div>
          )}

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wide">Login</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-red-900/30 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-600"
              placeholder="Digite seu login"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2 uppercase tracking-wide">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-red-900/30 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder-gray-600"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-900 to-red-800 hover:from-red-800 hover:to-red-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all border border-red-700/50 shadow-[0_0_15px_rgba(220,38,38,0.3)] disabled:opacity-50 disabled:cursor-not-allowed mt-4 uppercase tracking-widest text-sm"
          >
            <Lock size={18} />
            {loading ? 'Conectando...' : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}
