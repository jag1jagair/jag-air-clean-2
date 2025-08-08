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
    <div>
      <h1>Login</h1>
      {!magicSent ? (
        <form onSubmit={onLogin} className="card">
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@jagair.mx" style={{width:'100%', padding:10, margin:'8px 0'}} />
          <button className="btn btn-primary" type="submit">Send Magic Link</button>
        </form>
      ) : (
        <div className="card">Check your inbox for the login link.</div>
      )}
      {error && <div className="card" style={{borderColor:'red', color:'red'}}>{error}</div>}
    </div>
  );
}
