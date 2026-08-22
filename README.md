# TeamUp — Frontend

Startap g'oyasi bor, lekin jamoa yig'a olmayotganlar uchun platforma. React + Vite.

## ⚙️ O'rnatish

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Server **http://localhost:3005** manzilida ochiladi (backend esa `http://localhost:5000` da ishlashi kerak).

## 🧭 Route'lar

| Route | Sahifa | Kirish |
|---|---|---|
| `/` | Startaplar ro'yxati + filtr | Ochiq |
| `/login`, `/register` | Kirish / Ro'yxatdan o'tish | Ochiq |
| `/startups/:id` | Startap tafsiloti — "Qo'shilish" tugmasi | Ochiq |
| `/startups/new` | Startap yaratish | Login kerak |
| `/startups/:id/edit` | Tahrirlash (faqat egasi) | Login kerak |
| `/developers` | Dasturchilar ro'yxati + filtr | Ochiq |
| `/developers/:id` | Profil — "Chatga o'tish" / "Taklif yuborish" | Ochiq |
| `/profile/me` | Profilni tahrirlash | Login kerak |
| `/requests` | So'rov/takliflar — Rozi/Yo'q | Login kerak |
| `/messages`, `/messages/:userId` | Real-time chat | Login kerak |
| `*` | 404 | Ochiq |

## 🔑 Muhim biznes qoidalar (talabga ko'ra)

- **Ro'yxatdan o'tishda** "Oddiy foydalanuvchi" kategoriyasi bor — daraja (Junior/Senior) faqat haqiqiy mutaxassislar uchun so'raladi.
- **Startap yaratishda** "Kerakli mutaxassislar" bo'limi to'liq ixtiyoriy — bo'sh qoldirish mumkin.
- **Startap sahifasida** "Jamoaga qo'shilish" tugmasi har doim ko'rinadi (egasi bo'lmasa) — xabar yozish shart emas.
- **Startap egasiga** — agar u "kerakli mutaxassis" kiritgan bo'lsa, mos dasturchilarni ko'rish uchun ixtiyoriy filtr chiqadi (tanlash shart emas). Tanlangan dasturchining profili ochiladi, u yerda "Chatga o'tish" tugmasi bor.
- **Real-time**: xabarlar va bildirishnomalar socket.io orqali sahifani yangilamasdan keladi.

## 🔌 Backend bilan bog'lash

`.env` faylida:
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Backendda `CLIENT_URL=http://localhost:3005` deb sozlanganiga ishonch hosil qiling (CORS uchun).
