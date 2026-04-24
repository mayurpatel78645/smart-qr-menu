# 🍽️ SmartQR Menu OS (Enterprise Edition)

**Real-Time Digital Menu, Inventory Control & Restaurant Command Center**

SmartQR Menu OS is a live digital menu platform that transforms static QR menus into a real-time operations system for modern restaurants, cafés, bars, and cloud kitchens.

When an item is marked unavailable ("86'd"), it instantly updates across every customer device with no page refresh required. Guests can also request service directly from their phones, helping teams respond faster during busy hours.

---

## 🚀 Why This Project Matters

Traditional QR menus are often static PDFs or outdated webpages. They cannot adapt to live service conditions.

SmartQR Menu OS solves that by connecting the kitchen, floor staff, and guests through one real-time system.

### ✅ Business Benefits

* Prevent orders for sold-out items
* Reduce staff interruptions during rush hours
* Improve kitchen ↔ front-of-house communication
* Faster service with fewer mistakes
* Better guest experience
* Easy to scale across multiple locations

---

## ✨ Core Features

## 📱 Customer Experience

* Mobile-first responsive design
* Premium dark-mode UI
* Table-specific access (`?table=5`)
* Veg / Non-Veg / Spicy / Chef Special indicators
* Live sold-out updates
* One-tap **Call for Service** button
* Fast loading experience

## 👨‍🍳 Admin Command Center

* Toggle item availability instantly
* View incoming service requests in real time
* Manage menu data from dashboard
* Designed for fast-paced operations
* Clean and simple workflow

## 📋 Magic Excel Import

Bulk-create menu items by pasting rows from Excel or Google Sheets:

* Name
  n- Price
* Description
* Image URL

Build or update a full menu in seconds.

## ⚡ Live Sync Engine

* Powered by Supabase Realtime
* Automatic updates across devices
* No manual refresh needed
* Reliable for active service environments

---

## 🛠️ Tech Stack

| Layer    | Technology        |
| -------- | ----------------- |
| Frontend | Next.js, React    |
| Styling  | Tailwind CSS      |
| Icons    | Lucide React      |
| Backend  | Supabase          |
| Database | PostgreSQL        |
| Realtime | Supabase Channels |
| Hosting  | Vercel            |

---

## 📸 Demo Routes

* Customer Menu: `/mayur-bistro`
* Admin Dashboard: `/admin`

---

## ⚙️ Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/yourusername/smart-qr-menu.git
cd smart-qr-menu
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Create Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 4. Database Setup

Run in Supabase SQL Editor:

```sql
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#1a0514',
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

CREATE TABLE service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE service_requests;
```

## 5. Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000`

---

## 🌍 Deployment

```bash
npx vercel
npx vercel --prod
```

Add environment variables in the Vercel dashboard before production deployment.

---

## 🧠 Real Business Use Cases

* **Restaurants:** Instantly disable sold-out dishes
* **Cafés:** Switch breakfast / lunch menus live
* **Bars:** Hide unavailable drinks in real time
* **Cloud Kitchens:** Manage multiple brands from one system
* **Chains:** Standardize menus across locations

---

## 👨‍💻 Why I Built This

I worked in professional kitchens and saw how often service slows down because menus cannot adapt during a rush. This project combines real restaurant operations experience with modern web development to remove friction for both staff and guests.

---

## 🔮 Future Improvements

* Multi-location SaaS version
* Analytics dashboard
* AI upselling suggestions
* Multi-language menus
* Table ordering & payment flow
* Inventory auto-deduction
* Role-based staff permissions

---

## 📄 License

MIT License

---

## ⭐ Support

If you like this project, please star the repository.
