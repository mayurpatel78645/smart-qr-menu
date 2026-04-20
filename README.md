# 🍽️ SmartQR Menu

### Real-Time QR Menu + Inventory Control for Modern Restaurants

SmartQR Menu is a live digital menu system that helps restaurants prevent wrong orders, reduce staff interruptions, and instantly update sold-out items across all customer devices.

When the kitchen marks an item as unavailable ("86'd"), it updates on every customer menu in real-time — no page refresh needed.

---

## 🚀 Why This Project Matters

Traditional QR menus are static PDFs or outdated webpages. SmartQR Menu turns menus into a dynamic operations tool.

### ✅ Benefits

* Prevent customers from ordering unavailable items
* Reduce staff interruptions during rush hours
* Improve communication between kitchen and front-of-house
* Better guest experience
* Faster service and fewer mistakes

---

## ✨ Features

### 📱 Customer QR Menu

* Mobile-first responsive design
* Category-based layout
* Veg / spicy / chef special indicators
* Fast loading experience
* Real-time availability updates

### 👨‍🍳 Admin Dashboard

* Toggle item availability instantly
* Built for fast-paced restaurant operations
* Clean and simple interface

### ⚡ Live Sync Engine

* Supabase Realtime subscriptions
* Automatic updates across devices
* Polling fallback for restricted networks

### 🌍 Production Ready

* Deployed on Vercel
* Fast global performance
* Easy to scale for multiple restaurants

---

## 🛠️ Tech Stack

| Layer    | Technology        |
| -------- | ----------------- |
| Frontend | Next.js 16, React |
| Styling  | Tailwind CSS      |
| Icons    | Lucide React      |
| Backend  | Supabase          |
| Database | PostgreSQL        |
| Realtime | Supabase Channels |
| Hosting  | Vercel            |

---

## 📸 Demo Routes

```bash
a Customer Menu: /mayur-bistro
Admin Dashboard: /admin
```

---

## ⚙️ Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/smart-qr-menu.git
cd smart-qr-menu
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Environment Variables

Create `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Database Setup

Run in Supabase SQL Editor:

```sql
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#e11d48',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  display_order INT DEFAULT 0
);

CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  is_veg BOOLEAN DEFAULT true,
  spicy_level INT DEFAULT 0,
  is_chef_special BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;
```

### 5. Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000`

---

## 🚀 Deploy to Vercel

```bash
npx vercel
npx vercel --prod
```

Add your environment variables in the Vercel dashboard before production deploy.

---

## 🧠 Real Business Use Cases

* Restaurants: Instantly disable sold out dishes
* Cafes: Switch breakfast/lunch menus
* Bars: Hide unavailable drinks live
* Cloud Kitchens: Manage multiple brands

---

## 👨‍💻 Why I Built This

I worked in professional kitchens and saw how often service gets delayed because menus cannot adapt in real-time. This project combines restaurant operations experience with modern web development.

---

## 🔮 Future Improvements

* Multi-restaurant SaaS version
* Analytics dashboard
* AI upselling suggestions
* Multi-language menus
* Table ordering integration
* Inventory auto deduction

---

## 🤝 Contributing

Pull requests and suggestions are welcome.

---

## 📄 License

MIT License

---

## ⭐ Support

If you like this project, star the repository.
