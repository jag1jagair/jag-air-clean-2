import Link from 'next/link';

async function fetchAircraft() {
  const res = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/aircraft?select=*', {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' }
  });
  if (!res.ok) return [];
  return res.json();
}

function tailColor(tail:string){
  switch(tail){
    case 'N402FB': return 'bg-tailN402FB';
    case 'N208CR': return 'bg-tailN208CR';
    case 'N727EX': return 'bg-tailN727EX text-white';
    case 'N651CC': return 'bg-tailN651CC text-white';
    case 'N217EC': return 'bg-tailN217EC text-white';
    case 'N132JC': return 'bg-tailN132JC';
    default: return 'bg-gray-200';
  }
}

export default async function AircraftPage() {
  const data = await fetchAircraft();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data?.map((a:any) => (
        <Link key={a.id} href={`/aircraft/${a.tail}`} className="card hover:shadow-md transition">
          <div className="aspect-video w-full bg-gray-100 rounded-xl mb-3 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.photo_url || '/images/placeholder.png'} alt={a.tail} className="w-full h-full object-cover" />
          </div>
          <div className="flex items-center justify-between">
            <div className="font-semibold">{a.tail}</div>
            <span className={`badge ${tailColor(a.tail)}`}>{a.tail}</span>
          </div>
          <div className="text-sm text-gray-600 mt-1">Seats: {a.seats} • Base: {a.base_airport}</div>
          <div className="text-xs text-gray-500 mt-1">Seat sharing: {a.seat_sharing_enabled ? 'Enabled' : 'Disabled'}</div>
        </Link>
      ))}
    </div>
  );
}
