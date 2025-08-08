'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Passenger = {
  id?: string;
  full_name: string;
  dob?: string;
  passport_number?: string;
  passport_country?: string;
  visa_info?: string;
};

export default function PassengersPage() {
  const [rows, setRows] = useState<Passenger[]>([]);
  const [form, setForm] = useState<Passenger>({ full_name: '' });
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    const { data, error } = await supabase.from('passengers').select('*').order('full_name');
    if (error) setError(error.message); else setRows(data || []);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setError(null);
    if (!form.full_name) { setError('Full name is required'); return; }
    const { error } = await supabase.from('passengers').insert([form as any]);
    if (error) setError(error.message); else { setForm({ full_name:'' }); load(); }
  };

  const del = async (id: string) => {
    const { error } = await supabase.from('passengers').delete().eq('id', id);
    if (error) setError(error.message); else load();
  };

  return (
    <div>
      <h1>Passengers</h1>
      <div className="card">
        <h3>Add Passenger</h3>
        <label>Full name</label>
        <input value={form.full_name} onChange={e=>setForm({...form, full_name:e.target.value})} />
        <label>Date of birth (YYYY-MM-DD)</label>
        <input value={form.dob||''} onChange={e=>setForm({...form, dob:e.target.value})} />
        <label>Passport number</label>
        <input value={form.passport_number||''} onChange={e=>setForm({...form, passport_number:e.target.value})} />
        <label>Passport country</label>
        <input value={form.passport_country||''} onChange={e=>setForm({...form, passport_country:e.target.value})} />
        <label>Visa info</label>
        <input value={form.visa_info||''} onChange={e=>setForm({...form, visa_info:e.target.value})} />
        <button className="btn btn-primary" onClick={save}>Save</button>
        {error && <div className="small" style={{color:'red', marginTop:8}}>{error}</div>}
      </div>

      <div className="card">
        <h3>Saved passengers</h3>
        {rows.length===0 && <div className="small">No passengers yet.</div>}
        {rows.length>0 && (
          <table>
            <thead>
              <tr><th>Name</th><th>Passport</th><th>DOB</th><th>Visa</th><th></th></tr>
            </thead>
            <tbody>
              {rows.map(p => (
                <tr key={p.id}>
                  <td>{p.full_name}</td>
                  <td>{p.passport_number} {p.passport_country && <span className="small">({p.passport_country})</span>}</td>
                  <td>{p.dob||''}</td>
                  <td className="small">{p.visa_info||''}</td>
                  <td><button className="btn" onClick={()=>del(p.id!)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
