import './globals.css';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

async function getUserEmail() {
  // We cannot read server-side session easily with anon key; show placeholder
  return null;
}

export const metadata = { title: 'JAG Air Management' };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // In a real app you'd read the auth cookie to show user; for MVP we hint to check /auth
  return (
    <html lang="en">
      <body>
        <header>
          <div><b>JAG Air Management LLC</b></div>
          <nav style={{display:'flex', gap:12}}>
            <Link href="/">Dashboard</Link>
            <Link href="/aircraft">Aircraft</Link>
            <Link href="/flights/new">New Flight</Link>
            <Link href="/passengers">Passengers</Link>
            <Link href="/approvals">Approvals</Link>
            <Link href="/auth">Login</Link>
          </nav>
          <div className="user">Logged in via magic link (see /auth)</div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
