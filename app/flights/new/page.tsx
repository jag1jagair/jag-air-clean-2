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
    <div className="max-w-xl mx-auto card space-y-3">
      <h1 className="text-lg font-semibold">Request a Flight</h1>
      <div>
        <label className="text-sm">Aircraft</label>
        <select value={tail} onChange={e=>setTail(e.target.value)} className="w-full border rounded-xl p-2 mt-1">
          <option value="">Pick a tail</option>
          {aircraft.map(a => <option key={a.id} value={a.tail}>{a.tail}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Departure (ICAO)</label>
          <input value={dep} onChange={e=>setDep(e.target.value)} className="w-full border rounded-xl p-2 mt-1" />
        </div>
        <div>
          <label className="text-sm">Arrival (ICAO)</label>
          <input value={arr} onChange={e=>setArr(e.target.value)} className="w-full border rounded-xl p-2 mt-1" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm">Start (UTC ISO)</label>
          <input value={start} onChange={e=>setStart(e.target.value)} placeholder="2025-08-10T15:00:00Z" className="w-full border rounded-xl p-2 mt-1" />
        </div>
        <div>
          <label className="text-sm">End (UTC ISO)</label>
          <input value={end} onChange={e=>setEnd(e.target.value)} placeholder="2025-08-10T19:00:00Z" className="w-full border rounded-xl p-2 mt-1" />
        </div>
      </div>
      <label className="inline-flex items-center gap-2">
        <input type="checkbox" checked={whole} onChange={e=>setWhole(e.target.checked)} /> Whole aircraft
      </label>
      <div>
        <label className="text-sm">Lead Passenger Name</label>
        <input value={paxName} onChange={e=>setPaxName(e.target.value)} className="w-full border rounded-xl p-2 mt-1" />
      </div>
      <div>
        <label className="text-sm">US Stay Address (if applicable)</label>
        <input value={usAddress} onChange={e=>setUsAddress(e.target.value)} className="w-full border rounded-xl p-2 mt-1" />
      </div>
      <button className="btn btn-primary w-full" onClick={submit}>Submit Request</button>
      {status && <div className="text-sm text-gray-600">{status}</div>}
    </div>
  );
}
