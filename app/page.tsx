import Link from 'next/link';

export default function Page() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="card">
        <h1 className="text-xl font-semibold mb-2">Owner Portal</h1>
        <p className="text-sm text-gray-600">Book flights, manage passengers, and view availability.</p>
      </div>
      <div className="card flex justify-between items-center">
        <div>
          <div className="font-medium">Book a Flight</div>
          <div className="text-sm text-gray-600">Whole-aircraft or seat-sharing (N208CR/N727EX).</div>
        </div>
        <Link className="btn btn-primary" href="/flights/new">Start</Link>
      </div>
      <div className="card">
        <div className="font-medium mb-2">Calendar</div>
        <div className="text-sm text-gray-600">Month view across your aircraft.</div>
        <Link className="btn mt-2" href="/calendar">Open Calendar</Link>
      </div>
      <div className="card">
        <div className="font-medium mb-2">Fleet</div>
        <div className="text-sm text-gray-600">Browse aircraft, photos, and details.</div>
        <Link className="btn mt-2" href="/aircraft">View Aircraft</Link>
      </div>
    </div>
  );
}
