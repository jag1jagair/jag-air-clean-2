'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [magicSent, setMagicSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    if (error) setError(error.message); else setMagicSent(true);
  };

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-lg font-semibold mb-3">Login</h1>
      {!magicSent ? (
        <form onSubmit={onLogin} className="space-y-3">
          <div>
            <label className="text-sm">Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@jagair.mx"
              className="w-full border rounded-xl p-2 mt-1" />
          </div>
          <button className="btn btn-primary w-full" type="submit">Send Magic Link</button>
        </form>
      ) : (
        <div className="text-sm text-gray-600">Check your inbox for the login link.</div>
      )}
      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
    </div>
  );
}
