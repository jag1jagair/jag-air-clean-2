'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Flight = {
  id: string;
  dep: string;
  arr: string;
  start_time: string;
  end_time: string;
  whole_aircraft: boolean;
  status: string;
  aircraft_id: string;
  priority_flag?: string;
  inside_min_notice?: boolean;
};

export default function Approvals() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    setErr(null);
    const { data, error } = await supabase
      .from('flights')
      .select('id,dep,arr,start_time,end_time,whole_aircraft,status,aircraft_id,priority_flag,inside_min_notice')
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
    <div className="grid gap-3">
      <h1 className="text-lg font-semibold">Approvals</h1>
      {err && <div className="card border-red-300 text-red-700">{err}</div>}
      {flights.length === 0 && <div className="card">No pending requests.</div>}
      {flights.map(f => (
        <div key={f.id} className="card">
          <div className="flex items-center justify-between">
            <div className="font-medium">{f.dep} → {f.arr}</div>
            <div className="text-xs text-gray-500">{new Date(f.start_time).toLocaleString()} – {new Date(f.end_time).toLocaleString()}</div>
          </div>
          <div className="text-xs text-gray-600 mt-1">Type: {f.whole_aircraft ? 'Whole aircraft' : 'Seat-sharing'}</div>
          <div className="text-xs text-gray-600">Priority: {f.priority_flag || 'NONE'} {f.inside_min_notice ? '(Inside 24h)' : ''}</div>
          <div className="flex gap-2 mt-3">
            <button disabled={busy} className="btn btn-primary" onClick={() => updateStatus(f.id, 'APPROVED')}>Approve</button>
            <button disabled={busy} className="btn" onClick={() => updateStatus(f.id, 'DECLINED')}>Decline</button>
          </div>
        </div>
      ))}
    </div>
  );
}
