'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Trash2, PowerOff, Power, Search, Bell, LayoutDashboard, Database, UploadCloud, CheckCircle2 } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'live' | 'engine'>('live');
  const [restaurant, setRestaurant] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  
  // Bulk Import State
  const [bulkText, setBulkText] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    fetchData();
    const pollInterval = setInterval(fetchData, 3000); 
    return () => clearInterval(pollInterval);
  }, []);

  async function fetchData() {
    const { data: rest } = await supabase.from('restaurants').select('*').single();
    const { data: menu } = await supabase.from('menu_items').select('*').order('name');
    const { data: reqs } = await supabase.from('service_requests').select('*').eq('status', 'pending').order('created_at', { ascending: false });
    
    if (rest) setRestaurant(rest);
    if (menu) setItems(menu);
    if (reqs) setRequests(reqs);
  }

  async function toggleAvailability(id: string, currentStatus: boolean) {
    await supabase.from('menu_items').update({ is_available: !currentStatus }).eq('id', id);
    fetchData();
  }

  async function deleteItem(id: string) {
    if(confirm("Permanently delete this item?")) {
      await supabase.from('menu_items').delete().eq('id', id);
      fetchData();
    }
  }

  async function clearRequest(id: string) {
    await supabase.from('service_requests').update({ status: 'resolved' }).eq('id', id);
    fetchData();
  }

  // THE MAGIC EXCEL PASTE FEATURE
  async function handleBulkImport() {
    if (!bulkText.trim()) return alert("Paste data first!");
    setIsImporting(true);
    
    try {
      // Get the first category to assign these to (fallback)
      const { data: cat } = await supabase.from('categories').select('id').limit(1).single();
      
      const rows = bulkText.split('\n');
      const newItems = [];

      for (const row of rows) {
        // Splitting by Tab (Excel paste) or Comma
        const cols = row.split(/\t|,/); 
        if (cols.length >= 2 && cols[0].trim() !== '') {
          newItems.push({
            category_id: cat?.id,
            name: cols[0].trim(),
            price: parseFloat(cols[1].replace(/[^0-9.]/g, '')) || 0,
            description: cols[2] ? cols[2].trim() : "New menu addition",
            image_url: cols[3] ? cols[3].trim() : null, // 👈 NEW: Grabs the image link!
            is_available: true
          });
        }
      }

      if (newItems.length > 0) {
        await supabase.from('menu_items').insert(newItems);
        setBulkText('');
        alert(`Successfully imported ${newItems.length} items!`);
        fetchData();
      } else {
        alert("Could not read the data. Make sure it is 'Name, Price'");
      }
    } catch (error) {
      console.error(error);
      alert("Import failed. Check formatting.");
    }
    setIsImporting(false);
  }

  const filteredItems = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  if (!restaurant) return <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center font-bold tracking-widest uppercase">Initializing Command Center...</div>;

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Top Navigation Bar */}
      <nav className="bg-[#1e293b] border-b border-slate-700/50 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {restaurant.logo_url && <img src={restaurant.logo_url} alt="Logo" className="h-8 w-8 rounded-full bg-white p-0.5" />}
            <h1 className="text-xl font-black text-white tracking-tight">{restaurant.name} <span className="text-indigo-400 font-medium ml-2">POS OS</span></h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">System Live</span>
          </div>
        </div>
      </nav>

      {/* Main Layout Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('live')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-bold transition-all ${activeTab === 'live' ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <LayoutDashboard size={20} /> Live Floor Service
          </button>
          <button 
            onClick={() => setActiveTab('engine')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl font-bold transition-all ${activeTab === 'engine' ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'hover:bg-slate-800 text-slate-400'}`}
          >
            <Database size={20} /> Menu Data Engine
          </button>
        </div>

        {/* Dynamic Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* TAB 1: LIVE FLOOR (Operations) */}
          {activeTab === 'live' && (
            <>
              {/* Notifications Bar */}
              {requests.length > 0 && (
                <div className="bg-gradient-to-r from-rose-500 to-orange-500 p-6 rounded-2xl shadow-lg border border-rose-400/50 flex flex-col md:flex-row justify-between items-center gap-4 animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-center gap-4 text-white">
                    <Bell className="animate-bounce" size={28} />
                    <div>
                      <h2 className="text-xl font-black uppercase tracking-wider text-white">Action Required</h2>
                      <p className="text-rose-100 font-medium">{requests.length} table(s) requesting immediate assistance.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {requests.map(req => (
                      <button key={req.id} onClick={() => clearRequest(req.id)} className="bg-white text-rose-600 px-4 py-2 rounded-lg font-black shadow-md hover:scale-105 transition-transform flex items-center gap-2">
                        Table {req.table_number} <CheckCircle2 size={16} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 86 Station */}
              <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-700/50 flex flex-col sm:flex-row justify-between gap-4 items-center bg-slate-800/30">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2"><PowerOff className="text-rose-400" size={20}/> 86 Station (Availability)</h2>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Quick search..." className="w-full pl-10 p-2.5 bg-[#0f172a] border border-slate-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition" />
                  </div>
                </div>
                
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {filteredItems.map(item => (
                    <div key={item.id} className={`p-4 rounded-xl border flex justify-between items-center transition-all ${item.is_available ? 'bg-slate-800/50 border-slate-700/50' : 'bg-rose-950/20 border-rose-900/50 opacity-60'}`}>
                      <div>
                        <h3 className="font-bold text-white">{item.name}</h3>
                        <p className="text-emerald-400 font-medium text-sm">₹{item.price}</p>
                      </div>
                      <button onClick={() => toggleAvailability(item.id, item.is_available)} className={`w-14 h-8 rounded-full relative transition-colors ${item.is_available ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                        <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${item.is_available ? 'right-1' : 'left-1'}`}></div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* TAB 2: MENU ENGINE (Bulk & Delete) */}
          {activeTab === 'engine' && (
            <div className="space-y-6">
              
              {/* Magic Paste Box */}
              <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-indigo-500/20 rounded-lg"><UploadCloud className="text-indigo-400" size={24} /></div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Magic Excel Import</h2>
                    <p className="text-slate-400 text-sm">Paste directly from Excel or Google Sheets (Name, Price, Description).</p>
                  </div>
                </div>
                <textarea 
                  value={bulkText}
                  onChange={e => setBulkText(e.target.value)}
                  placeholder={"Signature Jamun Shot\t60\tFresh jamun\nCold Coco\t110\tRich chocolate blend"}
                  className="w-full h-32 bg-[#0f172a] border border-slate-700 rounded-xl p-4 text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none mb-4"
                />
                <div className="flex justify-end">
                  <button onClick={handleBulkImport} disabled={isImporting} className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 transition disabled:opacity-50">
                    {isImporting ? "Importing..." : "Run Import"} <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Danger Zone: Menu Deletion Grid */}
              <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
                 <div className="p-6 border-b border-slate-700/50 bg-slate-800/30 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2"><Database className="text-slate-400" size={20}/> Database Editor</h2>
                  <p className="text-slate-400 text-sm">Total Items: {items.length}</p>
                 </div>
                 <div className="p-4 space-y-2 max-h-[500px] overflow-y-auto">
                   {items.map(item => (
                     <div key={item.id} className="flex justify-between items-center p-3 bg-slate-800/30 hover:bg-slate-800/80 rounded-lg group transition border border-transparent hover:border-slate-700">
                       <span className="text-slate-300 font-medium">{item.name}</span>
                       <button onClick={() => deleteItem(item.id)} className="text-slate-500 hover:text-rose-500 p-2 rounded-md hover:bg-rose-500/10 transition opacity-0 group-hover:opacity-100">
                         <Trash2 size={18} />
                       </button>
                     </div>
                   ))}
                 </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}