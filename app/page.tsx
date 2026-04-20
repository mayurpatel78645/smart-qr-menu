import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 text-center">
      <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">SmartQR Menu</h1>
      <p className="text-xl text-slate-400 mb-8 max-w-md">
        The ultimate tech upgrade for modern kitchens.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/admin" className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-full font-bold transition">
          Launch Admin Dashboard
        </Link>
        <Link href="/mayur-bistro" className="bg-white text-black hover:bg-gray-200 px-8 py-3 rounded-full font-bold transition">
          View Live Menu Demo
        </Link>
      </div>
    </div>
  );
}