'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { Utensils } from 'lucide-react';

export default function PublicMenu({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);

  // We define this outside so we can call it repeatedly
  async function loadData() {
    const { data: rest } = await supabase.from('restaurants').select('*').eq('slug', slug).single();
    const { data: items } = await supabase.from('menu_items').select('*').order('name');
    
    if (rest) setRestaurant(rest);
    if (items) setMenuItems(items);
  }

  useEffect(() => {
    // 1. Initial Load
    loadData();

    // 2. The Bulletproof "Demo Saver" (Checks every 2 seconds silently)
    const pollInterval = setInterval(() => {
      loadData();
    }, 2000);

    // 3. Try Realtime anyway (best of both worlds)
    const channel = supabase
      .channel('public:menu_items')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'menu_items' }, 
        (payload) => {
          console.log("🔥 REALTIME EVENT:", payload);
          loadData(); // Force a fresh sync
        }
      )
      .subscribe((status) => {
        console.log("📡 Connection Status:", status);
      });

    // Cleanup when you leave the page
    return () => { 
      clearInterval(pollInterval);
      supabase.removeChannel(channel); 
    };
  }, [slug]);

  if (!restaurant) return <div className="p-10 font-bold text-center text-black">Loading Menu...</div>;

  return (
    <main className="max-w-md mx-auto min-h-screen bg-gray-50 pb-20 text-black">
      <div style={{ backgroundColor: restaurant.primary_color || '#e11d48' }} className="p-8 text-white rounded-b-3xl shadow-lg transition-colors duration-500">
        <h1 className="text-3xl font-bold">{restaurant.name}</h1>
        <p className="opacity-90">Live Digital Menu</p>
      </div>

      <div className="p-4 space-y-4 -mt-4">
        {menuItems.map((item) => (
          <div key={item.id} className={`bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center transition-all duration-500 ${!item.is_available ? 'opacity-40 grayscale scale-95' : 'scale-100'}`}>
            <div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${item.is_veg ? 'bg-green-500' : 'bg-red-500'}`} />
                <h3 className="font-bold text-gray-800">{item.name}</h3>
              </div>
              <p className="text-sm text-gray-500">{item.description}</p>
              <p className="font-bold text-lg mt-1 text-rose-600">₹{item.price}</p>
            </div>
            {!item.is_available && <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider">Sold Out</span>}
          </div>
        ))}
      </div>

      <button onClick={() => alert("Waiter notified for Table 1!")} className="fixed bottom-6 right-6 bg-black text-white p-4 rounded-full shadow-2xl flex gap-2 hover:scale-105 transition">
        <Utensils size={20} /> Call Waiter
      </button>
    </main>
  );
}