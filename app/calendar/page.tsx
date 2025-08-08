import Link from 'next/link';

export default function CalendarPage() {
  return (
    <div>
      <h1>Calendar</h1>
      <div className="card">Month view is enabled in the fuller build—this placeholder keeps routes stable. Existing deployments can keep their calendar page.</div>
      <Link className="btn btn-primary" href="/flights/new">Book a Flight</Link>
    </div>
  );
}
