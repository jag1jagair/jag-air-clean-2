'use client';
import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

function timeOptions30m() {
  const opts:string[] = [];
  for (let h=0; h<24; h++) {
    for (let m=0; m<60; m+=30) {
      const hh = String(h).padStart(2,'0');
      const mm = String(m).padStart(2,'0');
      opts.push(`${hh}:${mm}`);
    }
  }
  return opts;
}

export default function NewFlightPage() {
  const [aircraft, setAircraft] = useState<any[]>([]);
  const [passengers, setPassengers] = useState<any[]>([]);
  const [tail, setTail] = useState('');
  const [dep, setDep] = useState('');
  const [arr, setArr] = useState('');
  const [date, setDate] = useState('');
  const [timeLocal, setTimeLocal] = useState('08:00');
  const [whole, setWhole] = useState(true);
  const [usAddress, setUsAddress] = useState('');
  const [selectedPassengerIds, setSelectedPassengerIds] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('aircraft').select('*').then(({ data }) => setAircraft(data || []));
    supabase.from('passengers').select('*').order('full_name', {ascending:true}).then(({ data }) => setPassengers(data || []));
  }, []);

  const times = useMemo(() => timeOptions30m(), []);

  const togglePassenger = (id: string) => {
    setSelectedPassengerIds(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id]);
  };

  const submit = async () => {
    setStatus(null);
    if (!tail || !dep || !arr || !date || !timeLocal) { setStatus('Please fill all fields.'); return; }
    const { data: ac } = await supabase.from('aircraft').select('*').eq('tail', tail).single();
    if (!ac) { setStatus('Aircraft not found'); return; }
    if (!whole && !ac.seat_sharing_enabled) { setStatus('Seat sharing is only allowed on N208CR/N727EX.'); return; }

    // Build local datetime into ISO
    const isoLocal = new Date(`${date}T${timeLocal}:00`); // local time
    const iso = isoLocal.toISOString();

    const { data: flight, error } = await supabase.from('flights').insert([{
      aircraft_id: ac.id, dep, arr, start_time: iso, end_time: iso,
      whole_aircraft: whole, status: 'REQUESTED', policy_snapshot: {}, us_stay_address: usAddress,
    }]).select('*').single();
    if (error) { setStatus(error.message); return; }

    // Attach passengers (if table exists)
    await supabase.from('flight_passengers').insert(
      selectedPassengerIds.map(pid => ({ flight_id: flight.id, passenger_id: pid }))
    );

    setStatus('Flight requested. Manager will review.');
  };

  return (
    <div>
      <h1>Request a Flight</h1>
      <div className="card">
        <label>Aircraft</label>
        <select value={tail} onChange={e=>setTail(e.target.value)}>
          <option value="">Pick a tail</option>
          {aircraft.map(a => <option key={a.id} value={a.tail}>{a.tail}</option>)}
        </select>

        <label>Departure (ICAO)</label>
        <input value={dep} onChange={e=>setDep(e.target.value)} placeholder="MMAN" />

        <label>Arrival (ICAO)</label>
        <input value={arr} onChange={e=>setArr(e.target.value)} placeholder="KMIA" />

        <label>Start Date</label>
        <input type="date" value={date} onChange={e=>setDate(e.target.value)} />

        <label>Start Time (local)</label>
        <select value={timeLocal} onChange={e=>setTimeLocal(e.target.value)}>
          {times.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <div style={{margin:'8px 0'}}>
          <label><input type="checkbox" checked={whole} onChange={e=>setWhole(e.target.checked)} /> Whole aircraft</label>
        </div>

        <label>US Stay Address (if applicable)</label>
        <input value={usAddress} onChange={e=>setUsAddress(e.target.value)} />

        <div className="card" style={{background:'#fafafa'}}>
          <b>Add saved passengers</b>
          {passengers.length===0 && <div className="small">No saved passengers yet. Add some in the Passengers tab.</div>}
          <div style={{display:'flex', flexDirection:'column', gap:6, maxHeight:200, overflow:'auto'}}>
            {passengers.map(p => (
              <label key={p.id} style={{display:'flex', gap:8, alignItems:'center'}}>
                <input type="checkbox" checked={selectedPassengerIds.includes(p.id)} onChange={()=>togglePassenger(p.id)} />
                <span>{p.full_name} {p.passport_number ? `— ${p.passport_number}` : ''}</span>
              </label>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" onClick={submit}>Submit Request</button>
        {status && <div style={{marginTop:10}} className="small">{status}</div>}
      </div>
    </div>
  );
}
