import Link from 'next/link';
export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="card">
        <p>Welcome to the JAG Air owner portal (mobile web MVP).</p>
        <p>Use <Link href="/auth">Login</Link> to access your aircraft and book flights.</p>
      </div>
      <div className="grid">
        <div className="card">
          <h3>My Aircraft</h3>
          <p>View tails you own, seat counts, documents, and maintenance blocks.</p>
          <Link className="btn btn-primary" href="/aircraft">Open</Link>
        </div>
        <div className="card">
          <h3>Book a Flight</h3>
          <p>Request whole aircraft or seat-sharing (N208CR/N727EX only).</p>
          <Link className="btn btn-primary" href="/flights/new">Start</Link>
        </div>
      </div>
    </div>
  );
}
