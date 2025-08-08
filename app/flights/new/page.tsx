'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function NewFlightPage() {
  const [aircraft, setAircraft] = useState<any[]>([]);
  const [tail, setTail] = useState('');
  const [dep, setDep] = useState('');
  const [arr, setArr] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [whole, setWhole] = useState(true);
  const [paxName, setPaxName] = useState('');
  const [usAddress, setUsAddress] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('aircraft').select('*').then(({ data }) => setAircraft(data || []));
  }, []);

  const submit = async () => {
    setStatus(null);
    if (!tail || !dep || !arr || !start || !end) { setStatus('Please fill all fields.'); return; }
    const { data: ac } = await supabase.from('aircraft').select('*').eq('tail', tail).single();
    if (!ac) { setStatus('Aircraft not found'); return; }
    if (!whole && !ac.seat_sharing_enabled) { setStatus('Seat sharing is only allowed on N208CR/N727EX.'); return; }

    const { error } = await supabase.from('flights').insert([{
      aircraft_id: ac.id, dep, arr, start_time: start, end_time: end,
      whole_aircraft: whole, status: 'REQUESTED', policy_snapshot: {}, us_stay_address: usAddress,
    }]);
    if (error) setStatus(error.message);
    else setStatus('Flight requested. Manager will review.');
  };

  return (
    <div>
      <h1>Request a Flight</h1>
      <div className="card">
        <label>Aircraft</label><br/>
        <select value={tail} onChange={e=>setTail(e.target.value)} style={{width:'100%', padding:10, margin:'8px 0'}}>
          <option value="">Pick a tail</option>
          {aircraft.map(a => <option key={a.id} value={a.tail}>{a.tail}</option>)}
        </select>
        <label>Departure (ICAO)</label>
        <input value={dep} onChange={e=>setDep(e.target.value)} style={{width:'100%', padding:10, margin:'8px 0'}} />
        <label>Arrival (ICAO)</label>
        <input value={arr} onChange={e=>setArr(e.target.value)} style={{width:'100%', padding:10, margin:'8px 0'}} />
        <label>Start (UTC ISO)</label>
        <input value={start} onChange={e=>setStart(e.target.value)} placeholder="2025-08-10T15:00:00Z" style={{width:'100%', padding:10, margin:'8px 0'}} />
        <label>End (UTC ISO)</label>
        <input value={end} onChange={e=>setEnd(e.target.value)} placeholder="2025-08-10T19:00:00Z" style={{width:'100%', padding:10, margin:'8px 0'}} />
        <div style={{margin:'8px 0'}}>
          <label><input type="checkbox" checked={whole} onChange={e=>setWhole(e.target.checked)} /> Whole aircraft</label>
        </div>
        <label>Lead Passenger Name</label>
        <input value={paxName} onChange={e=>setPaxName(e.target.value)} style={{width:'100%', padding:10, margin:'8px 0'}} />
        <label>US Stay Address (if applicable)</label>
        <input value={usAddress} onChange={e=>setUsAddress(e.target.value)} style={{width:'100%', padding:10, margin:'8px 0'}} />
        <button className="btn btn-primary" onClick={submit}>Submit Request</button>
        {status && <div style={{marginTop:10}} className="small">{status}</div>}
      </div>
    </div>
  );
}
