'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Page() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  return (
    <div>
      <div className="card" style={{background:'#e2f2ff', borderColor:'#bae6fd'}}>
        <b>Welcome{email ? `, ${email}` : ''}!</b>
        <div className="small">This is your JAG Air portal. Use the links below to get started.</div>
      </div>
      <div className="grid">
        <div className="card">
          <h3>My Aircraft</h3>
          <p>View tails you own, seat counts, and maintenance blocks.</p>
          <Link className="btn btn-primary" href="/aircraft">Open</Link>
        </div>
        <div className="card">
          <h3>Book a Flight</h3>
          <p>Request whole aircraft or seat-sharing (N208CR/N727EX only).</p>
          <Link className="btn btn-primary" href="/flights/new">Start</Link>
        </div>
        <div className="card">
          <h3>Calendar</h3>
          <p>See all upcoming flights you can access.</p>
          <Link className="btn btn-primary" href="/calendar">Open</Link>
        </div>
        <div className="card">
          <h3>Passengers</h3>
          <p>Save passenger/passport details for quick booking.</p>
          <Link className="btn btn-primary" href="/passengers">Manage</Link>
        </div>
      </div>
    </div>
  );
}
