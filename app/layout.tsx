import './globals.css';
import Header from '@/components/Header';

export const metadata = { title: 'JAG Air Management' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
