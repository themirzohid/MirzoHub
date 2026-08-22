import { Link } from 'react-router-dom';
import { Button, Typography, Card, CardBody, Chip } from '@material-tailwind/react';
import {
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  BellAlertIcon,
  FunnelIcon,
  RocketLaunchIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { CATEGORIES } from '../constants/categories.js';

// ---------------------------------------------------------------------------
// YORDAMCHI FUNKSIYA VA MA'LUMOTLAR
// Sahifa ichida qayta-qayta ishlatiladigan narsalar shu yerda, komponentdan
// tashqarida turadi - shunda har safar qayta render bo'lganda qayta
// yaratilmaydi va o'qish osonroq bo'ladi.
// ---------------------------------------------------------------------------

// Rasm URL yasovchi funksiya. Lorem Picsum - bepul, litsenziyasiz tasodifiy
// foto xizmati. "seed" bir xil bo'lsa, rasm ham har doim bir xil chiqadi.
// Productionga chiqarishda buni o'z brendingiz suratlari bilan almashtiring.
function getPlaceholderImage(seed, width = 900, height = 600) {
  return `https://picsum.photos/seed/${seed}/${width}/${height}`;
}

// "Qanday ishlaydi" bo'limidagi 4 qadam
const HOW_IT_WORKS_STEPS = [
  {
    title: "G'oyangizni joylashtiring",
    text: "Startap haqida qisqa yoki batafsil ma'lumot yozing. Kerakli mutaxassislarni ko'rsatish ixtiyoriy.",
    icon: RocketLaunchIcon,
  },
  {
    title: 'Mos odamlarni toping',
    text: "Kategoriya, daraja va texnologiya bo'yicha filtrlab, o'zingizga kerakli dasturchini yoki qiziqarli startapni qidiring.",
    icon: FunnelIcon,
  },
  {
    title: "So'rov yoki taklif yuboring",
    text: "Dasturchi jamoaga qo'shilish uchun so'rov yuboradi, yoki startap egasi mutaxassisga to'g'ridan-to'g'ri taklif jo'natadi.",
    icon: UserGroupIcon,
  },
  {
    title: 'Real vaqtda muloqot qiling',
    text: 'Taklif qabul qilinishi bilan darhol bildirishnoma keladi va shaxsiy chatda muloqotni davom ettirasiz.',
    icon: ChatBubbleLeftRightIcon,
  },
];

// "Platforma imkoniyatlari" bo'limidagi xususiyatlar ro'yxati
const PLATFORM_FEATURES = [
  {
    title: "Startaplar uchun to'liq CRUD",
    text: "G'oyangizni yarating, tahrirlang yoki o'chiring. Bosqich, soha va teglar bo'yicha boshqaruv qo'lingizda.",
  },
  {
    title: "Ikki tomonlama qo'shilish",
    text: "Dasturchi so'rov yuboradi YOKI startap egasi taklif yuboradi — ikkalasi ham qo'llab-quvvatlanadi.",
  },
  {
    title: 'Real-time bildirishnoma',
    text: "Rozi bo'lish yoki rad etish tanlanishi bilanoq socket.io orqali sahifani yangilamasdan xabar boradi.",
  },
  {
    title: 'Shaxsiy xabarlar (chat)',
    text: "Har bir profilda muloqotga o'tish tugmasi bor — real-time yozishma sahifani qayta yuklamasdan ishlaydi.",
  },
  {
    title: '5 + 1 mutaxassislik toifasi',
    text: 'Dizayner, Backend, Frontend, Fullstack, Kiber xavfsizlik va oddiy foydalanuvchilar — hammaga joy bor.',
  },
  {
    title: 'Tex-stek va sertifikatlar',
    text: "Profilingizda bilgan texnologiyalaringiz va sertifikatlaringizni ko'rsating — ishonchni oshiring.",
  },
];

// "Muammo / Yechim" bo'limidagi qisqa afzalliklar ro'yxati
const KEY_BENEFITS = [
  "Startap egasi bo'lib, o'zi dasturchi bo'lmasangiz ham ro'yxatdan o'tasiz",
  "Kerakli mutaxassis haqida ma'lumot to'ldirish shart emas — keyin ham qo'shish mumkin",
  "Har bir so'rov yoki taklifga darhol javob berish imkoniyati bor",
];

// Har bir kategoriya uchun emoji-ikonka. constants/categories.js dagi
// CATEGORIES ro'yxati bilan bir xil "value" qiymatlariga bog'langan.
const CATEGORY_ICONS = {
  'UI/UX Designer': '🎨',
  'Backend Developer': '🛠️',
  'Cyber Security Specialist': '🛡️',
  'Frontend Developer': '💻',
  'Fullstack Developer': '🚀',
  'Regular User': '🙋',
};

// ---------------------------------------------------------------------------
// KICHIK QISM-KOMPONENTLAR
// Har bir bo'lim alohida funksiyaga chiqarilgan - shunda asosiy
// AboutPage komponenti qisqa va o'qish oson bo'ladi.
// ---------------------------------------------------------------------------

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-siyoh-900 text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-20 lg:grid-cols-2">
        <div className="relative z-10">
          <Chip
            value="Jamoa yig'a olmayotganlar uchun"
            className="mb-4 w-fit rounded-full bg-bordo-500/20 text-bordo-300"
          />

          <Typography variant="h1" className="text-4xl font-bold leading-tight text-white sm:text-5xl">
            G'oyangiz bor. <span className="text-bordo-400">Jamoangiz</span> yo'qmi?
          </Typography>

          <Typography className="mt-4 max-w-lg text-lg text-siyoh-100/80">
            MirzoHub — startap g'oyasi bo'lib, uni amalga oshiradigan hamfikr dasturchilarni topa
            olmayotganlar uchun yaratilgan platforma. Kategoriya, daraja va texnologiya bo'yicha
            filtrlab, real vaqtda muloqotga o'ting.
          </Typography>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register">
              <Button className="bg-bordo-500 hover:shadow-lg hover:shadow-bordo-500/30">
                Bepul boshlash
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outlined" className="border-xaki-300 text-xaki-200">
                Startaplarni ko'rish
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative">
          <img
            src={getPlaceholderImage('teamup-hero', 800, 600)}
            alt="Jamoa bo'lib ishlayotgan dasturchilar"
            className="aspect-[4/3] w-full rounded-2xl object-cover shadow-2xl ring-4 ring-xaki-400/20"
          />
          <div className="absolute -bottom-6 -left-6 hidden rounded-xl bg-xaki-100 p-4 text-siyoh-800 shadow-xl sm:block">
            <p className="text-xs font-medium text-xaki-700">Onlayn ulanish</p>
            <p className="text-lg font-bold">Real-time chat</p>
          </div>
        </div>
      </div>

      {/* Fon bezagi - shunchaki dekorativ, funksional emas */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-bordo-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-xaki-500/10 blur-3xl" />
    </section>
  );
}

function ProblemSolutionSection() {
  return (
    <section className="bg-xaki-50 dark:bg-siyoh-800/40">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 lg:grid-cols-2">
        <img
          src={getPlaceholderImage('teamup-problem', 700, 500)}
          alt="G'oyasini yozib o'tirgan tadbirkor"
          className="order-2 aspect-[4/3] w-full rounded-2xl object-cover shadow-lg lg:order-1"
        />

        <div className="order-1 lg:order-2">
          <Typography variant="h3" className="text-siyoh-800 dark:text-white">
            Ko'plab g'oyalar <span className="text-bordo-600">jamoa yo'qligi</span> sabab o'lib ketadi
          </Typography>

          <Typography className="mt-3 text-siyoh-600 dark:text-xaki-200">
            Sizda kod yozadigan qo'l yo'q, dasturchida esa qo'shiladigan loyiha yo'q. MirzoHub aynan
            shu bo'shliqni to'ldiradi — startap egalari va mutaxassislarni bitta joyda uchrashtiradi.
          </Typography>

          <ul className="mt-6 flex flex-col gap-3">
            {KEY_BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-2">
                <CheckBadgeIcon className="mt-0.5 h-5 w-5 shrink-0 text-bordo-600" />
                <span className="text-sm text-siyoh-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 text-center">
        <Typography variant="h3" className="text-siyoh-800 dark:text-white">
          Qanday ishlaydi
        </Typography>
        <Typography className="mt-2 text-siyoh-500 dark:text-xaki-300">Atigi to'rt qadamda jamoangizni yig'ing</Typography>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <Card key={step.title} className="border border-xaki-200 shadow-none dark:border-siyoh-700 dark:bg-siyoh-800">
            <CardBody className="flex flex-col gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-siyoh-800 text-bordo-400">
                <step.icon className="h-6 w-6" />
              </div>
              <Typography variant="h6" className="text-siyoh-800 dark:text-white">
                {index + 1}. {step.title}
              </Typography>
              <Typography variant="small" className="text-siyoh-500 dark:text-xaki-300">
                {step.text}
              </Typography>
            </CardBody>
          </Card>
        ))}
      </div>
    </section>
  );
}

function CategoriesSection() {
  return (
    <section className="bg-siyoh-800 py-16 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 text-center">
          <Typography variant="h3" className="text-white">
            Kimlar uchun?
          </Typography>
          <Typography className="mt-2 text-siyoh-200">
            5 xil mutaxassislik + startap egalari uchun alohida kategoriya
          </Typography>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((category) => (
            <div
              key={category.value}
              className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-center transition-colors hover:border-bordo-400/50 hover:bg-white/10"
            >
              <span className="text-2xl">{CATEGORY_ICONS[category.value]}</span>
              <p className="text-xs font-medium text-siyoh-100">{category.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10 text-center">
        <Typography variant="h3" className="text-siyoh-800 dark:text-white">
          Platforma imkoniyatlari
        </Typography>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PLATFORM_FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-xl border border-xaki-200 p-5 hover:border-bordo-300 dark:border-siyoh-700 dark:hover:border-bordo-500">
            <BellAlertIcon className="mb-3 h-6 w-6 text-bordo-600" />
            <Typography variant="h6" className="text-siyoh-800 dark:text-white">
              {feature.title}
            </Typography>
            <Typography variant="small" className="mt-1 text-siyoh-500 dark:text-xaki-300">
              {feature.text}
            </Typography>
          </div>
        ))}
      </div>
    </section>
  );
}

function CallToActionSection() {
  return (
    <section className="bg-bordo-600 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center text-white">
        <Typography variant="h3" className="text-white">
          Jamoangizni bugun yig'ishni boshlang
        </Typography>
        <Typography className="max-w-xl text-bordo-50">
          Ro'yxatdan o'tish bir daqiqa vaqt oladi — startap egasimisiz yoki mutaxassismisiz, sizga joy bor.
        </Typography>
        <Link to="/register">
          <Button className="mt-2 bg-siyoh-900 hover:bg-siyoh-800">Ro'yxatdan o'tish</Button>
        </Link>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// ASOSIY KOMPONENT
// Yuqoridagi bo'limlarni ketma-ket joylashtiradi, xolos.
// ---------------------------------------------------------------------------

function AboutPage() {
  return (
    <div className="-mx-4 flex flex-col bg-white dark:bg-siyoh-900">
      <HeroSection />
      <ProblemSolutionSection />
      <HowItWorksSection />
      <CategoriesSection />
      <FeaturesSection />
      <CallToActionSection />
    </div>
  );
}

export default AboutPage;
