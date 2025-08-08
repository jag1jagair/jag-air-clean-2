import './globals.css';
import Link from 'next/link';
export const metadata = { title: 'JAG Air Management' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{borderBottom:'1px solid #eee', padding:'10px 16px', display:'flex', justifyContent:'space-between'}}>
          <div><b>JAG Air Management LLC</b></div>
          <nav style={{display:'flex', gap:12}}>
            <Link href="/">Dashboard</Link>
            <Link href="/aircraft">Aircraft</Link>
            <Link href="/flights/new">New Flight</Link>
            <Link href="/approvals">Approvals</Link>
            <Link href="/auth">Login</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
