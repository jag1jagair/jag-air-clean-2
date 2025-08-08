import Link from 'next/link';
export default function Page() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="card">
        <p>Welcome to the JAG Air owner portal.</p>
        <p>Use <Link href="/auth">Login</Link> to access your aircraft, passengers, and book flights.</p>
      </div>
      <div className="grid">
        <div className="card">
          <h3>My Aircraft</h3>
          <p>View your aircraft and photos.</p>
          <Link className="btn btn-primary" href="/aircraft">Open</Link>
        </div>
        <div className="card">
          <h3>Passengers</h3>
          <p>Manage saved passenger profiles (passport & visa).</p>
          <Link className="btn btn-primary" href="/passengers">Manage</Link>
        </div>
      </div>
    </div>
  );
}
