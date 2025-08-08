'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function Header() {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    location.href = '/auth';
  };

  return (
    <header className="header">
      <div className="header-inner container">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <Image src="/logo_jag.svg" alt="JAG Air" width={120} height={28} />
          <strong>JAG Air Management LLC</strong>
        </div>
        <nav className="nav">
          <Link href="/">Dashboard</Link>
          <Link href="/aircraft">Aircraft</Link>
          <Link href="/calendar">Calendar</Link>
          <Link href="/flights/new">New Flight</Link>
          <Link href="/passengers">Passengers</Link>
          <Link href="/approvals">Approvals</Link>
          {!loading && (email ? (
            <button className="btn btn-ghost" onClick={logout}>Log Out</button>
          ) : (
            <Link href="/auth">Log In</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
