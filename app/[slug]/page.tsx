'use client';
import { useEffect, useState, use } from 'react'; // Added 'use' here
import { supabase } from '@/lib/supabase';
import { Utensils } from 'lucide-react';

// Updated the type here to Promise<{ slug: string }>
export default function PublicMenu({ params }: { params: Promise<{ slug: string }> }) {
  // We use React's new `use` hook to unwrap the params safely
  const { slug } = use(params);

  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      // Changed params.slug to just slug
      const { data: rest } = await supabase.from('restaurants').select('*').eq('slug', slug).single();
      const { data: items } = await supabase.from('menu_items').select('*').order('name');
      setRestaurant(rest);
      setMenuItems(items || []);
    }
    loadData();

    const channel = supabase.channel('menu-updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'menu_items' }, 
      (payload) => {
        setMenuItems((prev) => 
          prev.map((item) => item.id === payload.new.id ? { ...item, ...payload.new } : item)
        );
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [slug]); // Changed the dependency here from params.slug to slug

  if (!restaurant) return <div className="p-10 font-bold text-center">Loading Menu...</div>;

  return (
    <main className="max-w-md mx-auto min-h-screen bg-gray-50 pb-20 text-black">
      <div style={{ backgroundColor: restaurant.primary_color || '#e11d48' }} className="p-8 text-white rounded-b-3xl shadow-lg">
        <h1 className="text-3xl font-bold">{restaurant.name}</h1>
        <p className="opacity-90">Live Digital Menu</p>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        {menuItems.map((item) => (
          <div key={item.id} className={`bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center transition-all ${!item.is_available ? 'opacity-40 grayscale' : ''}`}>
            <div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${item.is_veg ? 'bg-green-500' : 'bg-red-500'}`} />
                <h3 className="font-bold text-gray-800">{item.name}</h3>
              </div>
              <p className="text-sm text-gray-500">{item.description}</p>
              <p className="font-bold text-lg mt-1 text-rose-600">₹{item.price}</p>
            </div>
            {!item.is_available && <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-lg">SOLD OUT</span>}
          </div>
        ))}
      </div>

      <button onClick={() => alert("Waiter notified for Table 1!")} className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-2xl flex gap-2 hover:scale-105 transition">
        <Utensils size={20} /> Call Waiter
      </button>
    </main>
  );
}