'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Flight = {
  id: string; dep: string; arr: string;
  start_time: string; end_time: string;
  whole_aircraft: boolean; status: string;
  priority_flag?: string; inside_min_notice?: boolean;
};

export default function Approvals() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    setErr(null);
    const { data, error } = await supabase
      .from('flights')
      .select('id,dep,arr,start_time,end_time,whole_aircraft,status,priority_flag,inside_min_notice')
      .eq('status','REQUESTED').order('start_time',{ascending:true});
    if (error) setErr(error.message); else setFlights(data || []);
  };

  useEffect(() => { refresh(); }, []);

  const updateStatus = async (id: string, status: 'APPROVED'|'DECLINED') => {
    setBusy(true);
    const { error } = await supabase.from('flights').update({ status }).eq('id', id);
    setBusy(false);
    if (error) setErr(error.message); else refresh();
  };

  return (
    <div>
      <h1>Approvals</h1>
      <p className="small">Manager only. Your DB RLS should enforce permissions.</p>
      {err && <div className="card" style={{borderColor:'red', color:'red'}}>{err}</div>}
      {flights.length === 0 && <div className="card">No pending requests.</div>}
      {flights.map(f => (
        <div key={f.id} className="card">
          <div><b>{f.dep}</b> → <b>{f.arr}</b></div>
          <div className="small">{new Date(f.start_time).toLocaleString()} ({f.whole_aircraft ? 'Whole aircraft' : 'Seat-sharing'})</div>
          <div className="small">Priority: {f.priority_flag || 'NONE'} {f.inside_min_notice ? '(Inside 24h)' : ''}</div>
          <div style={{display:'flex', gap:8, marginTop:8}}>
            <button disabled={busy} className="btn btn-primary" onClick={() => updateStatus(f.id, 'APPROVED')}>Approve</button>
            <button disabled={busy} className="btn" onClick={() => updateStatus(f.id, 'DECLINED')}>Decline</button>
          </div>
        </div>
      ))}
    </div>
  );
}
