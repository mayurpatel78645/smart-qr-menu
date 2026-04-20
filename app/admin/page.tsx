'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Power, PowerOff, Edit3 } from 'lucide-react';

export default function AdminDashboard() {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: rest } = await supabase.from('restaurants').select('*').single();
    const { data: menu } = await supabase.from('menu_items').select('*').order('name');
    if (rest) {
      setRestaurant(rest);
      setNewName(rest.name);
    }
    if (menu) setItems(menu);
  }

  async function updateName() {
    await supabase.from('restaurants').update({ name: newName }).eq('id', restaurant.id);
    alert("Restaurant name updated! Refresh the customer menu to see it.");
  }

  async function toggleAvailability(id: string, currentStatus: boolean) {
    // This updates the database, which triggers the realtime change for the customer
    await supabase.from('menu_items').update({ is_available: !currentStatus }).eq('id', id);
    fetchData(); // Refresh admin view
  }

  if (!restaurant) return <div className="p-10 font-bold text-center text-black">Loading Admin Panel...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-slate-50 min-h-screen text-black">
      <header className="flex justify-between items-center border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Edit3 className="text-blue-600" /> SmartQR Admin
        </h1>
        <div className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium shadow-sm">
          Live Connection Active
        </div>
      </header>

      {/* Quick Branding */}
      <section className="mb-8 bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Demo Branding</h2>
        <div className="flex gap-4">
          <input 
            value={newName} 
            onChange={(e) => setNewName(e.target.value)}
            className="flex-1 p-3 border rounded-xl shadow-sm bg-gray-50 focus:bg-white transition"
            placeholder="Restaurant Name"
          />
          <button onClick={updateName} className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition shadow-md">
            <Save size={18} /> Update App Name
          </button>
        </div>
      </section>

      {/* The 86 List */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Live Menu Management</h2>
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition">
              <div>
                <p className="font-bold text-gray-800 text-lg">{item.name}</p>
                <p className="text-sm text-gray-500 font-medium">₹{item.price}</p>
              </div>
              <button 
                onClick={() => toggleAvailability(item.id, item.is_available)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition shadow-sm ${item.is_available ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-100'}`}
              >
                {item.is_available ? <><PowerOff size={18} /> 86 Item</> : <><Power size={18} /> Make Available</>}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}