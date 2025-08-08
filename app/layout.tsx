import './globals.css';
import Link from 'next/link';

export const metadata = { title: 'JAG Air Management' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white border-b border-gray-200">
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand"></div>
              <b>JAG Air Management LLC</b>
            </div>
            <nav className="nav">
              <Link href="/">Dashboard</Link>
              <Link href="/calendar">Calendar</Link>
              <Link href="/aircraft">Aircraft</Link>
              <Link href="/flights/new" className="btn btn-primary">New Flight</Link>
              <Link href="/auth">Login</Link>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="container text-xs text-gray-500 py-6">© JAG Air Management LLC</footer>
      </body>
    </html>
  );
}
