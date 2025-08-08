'use client';
import { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

const tailColors: Record<string,string> = {
  'N402FB': 'bg-tailN402FB',
  'N208CR': 'bg-tailN208CR',
  'N727EX': 'bg-tailN727EX text-white',
  'N651CC': 'bg-tailN651CC text-white',
  'N217EC': 'bg-tailN217EC text-white',
  'N132JC': 'bg-tailN132JC',
};

function startOfMonth(d: Date){ const x=new Date(d); x.setDate(1); x.setHours(0,0,0,0); return x; }
function endOfMonth(d: Date){ const x=new Date(d); x.setMonth(x.getMonth()+1,0); x.setHours(23,59,59,999); return x; }

export default function CalendarPage(){
  const [when, setWhen] = useState(new Date());
  const [flights, setFlights] = useState<any[]>([]);
  const [tails, setTails] = useState<string[]>(['ALL']);
  const [selTail, setSelTail] = useState('ALL');
  const [shareFilter, setShareFilter] = useState<'ALL'|'WHOLE'|'SEAT'>('ALL');

  const range = useMemo(()=>{
    const s = startOfMonth(when);
    const e = endOfMonth(when);
    return { s, e };
  }, [when]);

  useEffect(()=>{
    (async () => {
      // fetch aircraft to populate tail filter
      const { data: ac } = await supabase.from('aircraft').select('id, tail').order('tail');
      const list = ['ALL', ...(ac?.map(a=>a.tail) || [])];
      setTails(list);

      // fetch flights for month
      const { data: f } = await supabase
        .from('flights')
        .select('id, aircraft_id, dep, arr, start_time, end_time, whole_aircraft')
        .gte('start_time', range.s.toISOString())
        .lte('start_time', range.e.toISOString())
        .order('start_time', { ascending: true });
      setFlights(f || []);
    })();
  }, [range.s, range.e]);

  // map aircraft_id -> tail
  const [acMap, setAcMap] = useState<Record<string,string>>({});
  useEffect(()=>{
    (async () => {
      const { data } = await supabase.from('aircraft').select('id, tail');
      const m: Record<string,string> = {};
      (data||[]).forEach(a=> m[a.id] = a.tail);
      setAcMap(m);
    })();
  }, []);

  const days = useMemo(()=>{
    const days: Date[] = [];
    const d = new Date(range.s);
    while(d <= range.e){ days.push(new Date(d)); d.setDate(d.getDate()+1); }
    return days;
  },[range]);

  const filtered = flights.filter(f => {
    const tail = acMap[f.aircraft_id];
    if (selTail !== 'ALL' && tail !== selTail) return false;
    if (shareFilter === 'WHOLE' && !f.whole_aircraft) return false;
    if (shareFilter === 'SEAT' && f.whole_aircraft) return false;
    return true;
  });

  function flightsOnDay(day: Date){
    const y = day.getFullYear(), m = day.getMonth(), d = day.getDate();
    return filtered.filter(f => {
      const sd = new Date(f.start_time);
      return sd.getFullYear()===y && sd.getMonth()===m && sd.getDate()===d;
    });
  }

  function moveMonth(delta:number){
    const x = new Date(when);
    x.setMonth(x.getMonth()+delta, 1);
    setWhen(x);
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button className="btn" onClick={()=>moveMonth(-1)}>← Prev</button>
        <div className="font-medium">{when.toLocaleString(undefined,{month:'long', year:'numeric'})}</div>
        <button className="btn" onClick={()=>moveMonth(1)}>Next →</button>
        <div className="flex-1" />
        <select className="border rounded-xl p-2" value={selTail} onChange={e=>setSelTail(e.target.value)}>
          {tails.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="border rounded-xl p-2" value={shareFilter} onChange={e=>setShareFilter(e.target.value as any)}>
          <option value="ALL">All</option>
          <option value="WHOLE">Whole-aircraft</option>
          <option value="SEAT">Seat-sharing</option>
        </select>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map(day => {
          const list = flightsOnDay(day);
          return (
            <div key={day.toISOString()} className="card p-3">
              <div className="text-xs text-gray-500 mb-2">{day.getDate()}</div>
              <div className="grid gap-1">
                {list.map(f => {
                  const tail = acMap[f.aircraft_id];
                  const c = tailColors[tail] || 'bg-gray-200';
                  return (
                    <div key={f.id} className={`text-xs rounded-md px-2 py-1 ${c}`}>
                      <div className="font-medium">{tail}</div>
                      <div>{new Date(f.start_time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} {f.dep}→{f.arr}</div>
                      <div className="opacity-70">{f.whole_aircraft ? 'Whole' : 'Seat-share'}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
