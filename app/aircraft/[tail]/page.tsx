import { notFound } from 'next/navigation';

async function fetchAircraft(tail:string){
  const res = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/aircraft?select=*&tail=eq.'+tail, {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' },
    cache: 'no-store'
  });
  const arr = await res.json();
  return arr?.[0];
}

export default async function AircraftDetail({ params }: { params: { tail: string }}){
  const a = await fetchAircraft(params.tail);
  if(!a) return notFound();

  return (
    <div className="grid gap-6">
      <div className="card">
        <div className="aspect-video w-full bg-gray-100 rounded-xl overflow-hidden mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={a.photo_url || '/images/placeholder.png'} alt={a.tail} className="w-full h-full object-cover" />
        </div>
        <div className="text-2xl font-semibold">{a.tail}</div>
        <div className="text-sm text-gray-600 mt-1">Seats: {a.seats} • Base: {a.base_airport}</div>
        <div className="text-xs text-gray-500 mt-1">Seat sharing: {a.seat_sharing_enabled ? 'Enabled' : 'Disabled'}</div>
      </div>
      <div className="card">
        <div className="font-medium mb-2">Documents & Info</div>
        <div className="text-sm text-gray-600">You can add a photo URL in Supabase → Table Editor → aircraft.photo_url to replace the placeholder image.</div>
      </div>
    </div>
  );
}
