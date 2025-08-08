import Link from 'next/link';

async function fetchAircraft() {
  const res = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/aircraft?select=*', {
    headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '' }
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function AircraftPage() {
  const data = await fetchAircraft();
  return (
    <div>
      <h1>Aircraft</h1>
      {data?.map((a:any) => (
        <div key={a.id} className="card" style={{display:'flex', gap:12, alignItems:'center'}}>
          <img src={a.photo_url || '/placeholder.svg'} alt={a.tail} style={{width:96, height:64, objectFit:'cover', borderRadius:8, border:'1px solid #eee'}} />
          <div style={{flex:1}}>
            <div><b>{a.tail}</b> • Seats: {a.seats} • Base: {a.base_airport}</div>
            <div className="small">Seat sharing: {a.seat_sharing_enabled ? 'Enabled' : 'Disabled'}</div>
          </div>
          <Link className="btn" href={`/flights/new?tail=${a.tail}`}>Book</Link>
        </div>
      ))}
    </div>
  );
}
