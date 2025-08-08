'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Passenger = { id?: string; full_name: string; dob?: string; passport_number?: string; passport_country?: string; visa_info?: string };

export default function PassengersPage() {
  const [rows, setRows] = useState<Passenger[]>([]);
  const [form, setForm] = useState<Passenger>({ full_name: '' });

  const load = async () => {
    const { data } = await supabase.from('passengers').select('*').order('full_name');
    setRows(data || []);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.full_name) return;
    const { error } = await supabase.from('passengers').insert([form]);
    if (!error) { setForm({ full_name: '' }); load(); }
  };

  const del = async (id: string) => {
    await supabase.from('passengers').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <h1>Passengers</h1>
      <div className="card">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <input placeholder="Full name" value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} />
          <input placeholder="DOB (YYYY-MM-DD)" value={form.dob||''} onChange={e=>setForm({...form, dob:e.target.value})} />
          <input placeholder="Passport #" value={form.passport_number||''} onChange={e=>setForm({...form, passport_number:e.target.value})} />
          <input placeholder="Passport country" value={form.passport_country||''} onChange={e=>setForm({...form, passport_country:e.target.value})} />
          <input placeholder="Visa info" value={form.visa_info||''} onChange={e=>setForm({...form, visa_info:e.target.value})} />
        </div>
        <div style={{marginTop:12}}><button className="btn btn-primary" onClick={save}>Save Passenger</button></div>
      </div>

      {rows.map(p => (
        <div key={p.id} className="card" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <b>{p.full_name}</b>
            <div className="small">DOB: {p.dob || '—'} • Passport: {p.passport_number || '—'} {p.passport_country ? ' ('+p.passport_country+')' : ''}</div>
            <div className="small">Visa: {p.visa_info || '—'}</div>
          </div>
          <button className="btn" onClick={()=>del(p.id!)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
