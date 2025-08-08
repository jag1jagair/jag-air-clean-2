'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

function timesIn30Min() {
  const list:string[] = [];
  for (let h=0; h<24; h++) {
    for (let m of [0,30]) {
      const hh = h.toString().padStart(2,'0');
      const mm = m.toString().padStart(2,'0');
      list.push(`${hh}:${mm}`);
    }
  }
  return list;
}

export default function NewFlightPage() {
  const [aircraft, setAircraft] = useState<any[]>([]);
  const [tail, setTail] = useState('');
  const [dep, setDep] = useState('');
  const [arr, setArr] = useState('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [whole, setWhole] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('aircraft').select('*').then(({ data }) => setAircraft(data || []));
  }, []);

  const submit = async () => {
    setStatus(null);
    if (!tail || !dep || !arr || !date || !time) { setStatus('Please fill all fields.'); return; }
    const { data: ac } = await supabase.from('aircraft').select('*').eq('tail', tail).single();
    if (!ac) { setStatus('Aircraft not found'); return; }
    if (!whole && !ac.seat_sharing_enabled) { setStatus('Seat sharing is only allowed on N208CR/N727EX.'); return; }

    // Build local datetime to ISO
    const startLocal = new Date(`${date}T${time}:00`);
    const startIso = startLocal.toISOString(); // server stores UTC, user chooses local
    const { error } = await supabase.from('flights').insert([{
      aircraft_id: ac.id, dep, arr, start_time: startIso, end_time: startIso,
      whole_aircraft: whole, status: 'REQUESTED', policy_snapshot: {},
    }]);
    if (error) setStatus(error.message);
    else setStatus('Flight requested. Manager will review.');
  };

  const times = useMemo(timesIn30Min, []);

  return (
    <div>
      <h1>Request a Flight</h1>
      <div className="card">
        <label>Aircraft</label><br/>
        <select value={tail} onChange={e=>setTail(e.target.value)} style={{width:'100%', padding:10, margin:'8px 0'}}>
          <option value="">Pick a tail</option>
          {aircraft.map(a => <option key={a.id} value={a.tail}>{a.tail}</option>)}
        </select>
        <label>Departure Airport (ICAO)</label>
        <input value={dep} onChange={e=>setDep(e.target.value)} placeholder="MMAN" style={{width:'100%', padding:10, margin:'8px 0'}} />
        <label>Arrival Airport (ICAO)</label>
        <input value={arr} onChange={e=>setArr(e.target.value)} placeholder="KMIA" style={{width:'100%', padding:10, margin:'8px 0'}} />
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <div>
            <label>Departure Date</label>
            <input type="date" value={date} onChange={e=>setDate(e.target.value)} style={{width:'100%', padding:10, margin:'8px 0'}} />
          </div>
          <div>
            <label>Departure Time (local)</label>
            <select value={time} onChange={e=>setTime(e.target.value)} style={{width:'100%', padding:10, margin:'8px 0'}}>
              <option value="">Select time</option>
              {times.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div style={{margin:'8px 0'}}>
          <label><input type="checkbox" checked={whole} onChange={e=>setWhole(e.target.checked)} /> Whole aircraft</label>
        </div>
        <button className="btn btn-primary" onClick={submit}>Submit Request</button>
        {status && <div style={{marginTop:10}} className="small">{status}</div>}
      </div>
    </div>
  );
}
