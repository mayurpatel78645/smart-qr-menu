'use client';
import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { BellRing, Sparkles } from 'lucide-react';

export default function PremiumMenu({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [tableNum, setTableNum] = useState<string>('General');
  const [calling, setCalling] = useState(false);

  async function loadData() {
    const { data: rest } = await supabase.from('restaurants').select('*').eq('slug', slug).single();
    const { data: items } = await supabase.from('menu_items').select('*').order('name');
    if (rest) setRestaurant(rest);
    if (items) setMenuItems(items);
  }

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setTableNum(searchParams.get('table') || 'General');

    loadData();
    const pollInterval = setInterval(loadData, 2000); 
    return () => clearInterval(pollInterval);
  }, [slug]);

  async function callWaiter() {
    setCalling(true);
    await supabase.from('service_requests').insert([
      { restaurant_id: restaurant?.id, table_number: tableNum, status: 'pending' }
    ]);
    setTimeout(() => {
      alert(`Staff notified for Table ${tableNum}. We will be right with you!`);
      setCalling(false);
    }, 500);
  }

  if (!restaurant) return <div className="min-h-screen bg-[#1a0514] text-white flex items-center justify-center font-serif tracking-widest text-sm uppercase">Loading Experience...</div>;

  return (
    <main className="max-w-md mx-auto min-h-screen bg-[#1a0514] text-fuchsia-50 pb-28 font-sans selection:bg-fuchsia-500/30">
      
      {/* Immersive Brand Header */}
      <div className="relative pt-12 pb-10 w-full overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-[#4a0b35] via-[#2d051e] to-black shadow-2xl border-b border-fuchsia-900/30">
        {/* Background Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-3xl mix-blend-screen"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl mix-blend-screen"></div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          {/* Using the Official Logo you uploaded */}
          <div className="w-28 h-28 mb-4 rounded-full bg-white shadow-[0_0_30px_rgba(217,70,239,0.15)] flex items-center justify-center p-2 border border-fuchsia-100/10">
             <img 
              src={restaurant.logo_url} 
              alt={`${restaurant.name} Logo`} 
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-fuchsia-400" size={14} />
            <p className="text-fuchsia-300 font-bold tracking-[0.2em] text-[10px] uppercase">100% Natural Premium</p>
            <Sparkles className="text-fuchsia-400" size={14} />
          </div>
          
          <div className="inline-block bg-black/40 backdrop-blur-md border border-fuchsia-500/20 px-5 py-1.5 rounded-full mt-2 shadow-inner">
            <p className="text-sm font-medium text-fuchsia-100/70">Table <span className="font-bold text-white text-base ml-1">{tableNum}</span></p>
          </div>
        </div>
      </div>

      {/* Premium Visual Menu Grid */}
      <div className="px-5 mt-8 space-y-8 relative z-10">
        <div>
           <h2 className="text-xl font-black tracking-widest uppercase mb-5 text-fuchsia-300/80 flex items-center gap-3">
             Signature Menu
             <div className="h-px bg-gradient-to-r from-fuchsia-900/80 to-transparent flex-1"></div>
           </h2>

          <div className="grid grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <div 
                key={item.id} 
                className={`group relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-white/[0.08] to-black/40 border border-white/5 backdrop-blur-md transition-all duration-500 shadow-xl flex flex-col ${
                  !item.is_available ? 'opacity-40 grayscale' : 'hover:border-fuchsia-500/40 hover:bg-white/[0.12]'
                }`}
              >
                {/* Image Container */}
                <div className="h-44 w-full overflow-hidden relative bg-black">
                  {item.image_url && (
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 mix-blend-lighten"
                    />
                  )}
                  {/* Soft top gradient to blend image into the card */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0514] via-transparent to-transparent"></div>
                  
                  {/* Veg Indicator */}
                  <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/10">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.is_veg ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-red-500'}`}></div>
                  </div>

                  {/* Sold Out Overlay */}
                  {!item.is_available && (
                    <div className="absolute inset-0 bg-[#1a0514]/80 flex items-center justify-center backdrop-blur-sm">
                      <span className="bg-red-600/20 text-red-400 font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] shadow-2xl border border-red-500/30">Sold Out</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between -mt-4 relative z-10">
                  <div>
                    <h3 className="font-bold text-white leading-tight mb-1">{item.name}</h3>
                    <p className="text-[10px] text-fuchsia-100/50 line-clamp-2 leading-relaxed mb-3">{item.description}</p>
                  </div>
                  <p className="font-black text-lg text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-pink-300">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 left-0 w-full px-6 flex justify-center z-50">
        <button 
          onClick={callWaiter}
          disabled={calling}
          className="bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white w-full max-w-sm py-4 rounded-2xl shadow-[0_10px_40px_rgba(192,38,211,0.3)] flex items-center justify-center gap-3 font-black text-lg hover:from-fuchsia-500 hover:to-purple-500 transition-all disabled:opacity-50 border border-fuchsia-400/50"
        >
          <BellRing size={22} className={calling ? "animate-spin" : "animate-bounce"} />
          {calling ? "Notifying Staff..." : "Call For Service"}
        </button>
      </div>
    </main>
  );
}