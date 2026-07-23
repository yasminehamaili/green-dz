import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import { ClientOnly } from "@tanstack/react-router";
import type { RecyclingPoint, WasteType } from "@/components/RecyclingMap";
import { WASTE_LABELS, WILAYA_CENTERS } from "@/components/RecyclingMap";

const RecyclingMap = lazy(() => import("@/components/RecyclingMap"));

export const Route = createFileRoute("/")({
  component: Home,
});

const NAV = [
  { label: "الرئيسية", href: "#top" },
  { label: "الخريطة", href: "#map" },
  { label: "تعلم", href: "#learn" },
  { label: "المبادرات", href: "#events" },
];

const SEED_POINTS: RecyclingPoint[] = [
  { id: "s1", name: "مركز إعادة تدوير الجزائر الوسطى", wilaya: "الجزائر", commune: "الأبيار", waste: "plastic", lat: 36.7688, lng: 3.0466, notes: "مفتوح 6 أيام في الأسبوع" },
  { id: "s2", name: "نقطة تجميع الورق - وهران", wilaya: "وهران", waste: "paper", lat: 35.6971, lng: -0.6337 },
  { id: "s3", name: "حاويات الزجاج - قسنطينة", wilaya: "قسنطينة", waste: "glass", lat: 36.365, lng: 6.6147 },
  { id: "s4", name: "تجميع المعادن - عنابة", wilaya: "عنابة", waste: "metal", lat: 36.9, lng: 7.7667 },
  { id: "s5", name: "نقطة النفايات الإلكترونية - بجاية", wilaya: "بجاية", waste: "ewaste", lat: 36.7509, lng: 5.0567 },
  { id: "s6", name: "مركز الفرز - سطيف", wilaya: "سطيف", waste: "plastic", lat: 36.19, lng: 5.41 },
  { id: "s7", name: "نقطة الورق - تلمسان", wilaya: "تلمسان", waste: "paper", lat: 34.8828, lng: -1.315 },
];

const FILTERS: { key: WasteType | "all"; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "plastic", label: "البلاستيك" },
  { key: "paper", label: "الورق" },
  { key: "glass", label: "الزجاج" },
  { key: "metal", label: "المعادن" },
  { key: "ewaste", label: "النفايات الإلكترونية" },
];

function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("الرئيسية");
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-paper/70 border-b border-black/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4">
        <a href="#top" className="flex items-center gap-2">
          <img src="/logo/logo.png" alt="GreenDZ" className="h-15 w-20" />
        </a>
        <nav className="hidden lg:flex items-center gap-2">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} onClick={() => setActive(n.label)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                active === n.label ? "bg-dark-green text-sage" : "bg-grey text-ink hover:bg-black/5"
              }`}>{n.label}</a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2">
          <a href="#about" className="rounded-full bg-near-black px-5 py-2.5 text-sm font-semibold text-sage hover:bg-black transition">من نحن</a>
          <a href="#map" className="rounded-full bg-dark-green px-5 py-2.5 text-sm font-semibold text-sage hover:bg-forest-green transition">استكشف الخريطة</a>
        </div>
        <button aria-label="القائمة" onClick={() => setOpen((v) => !v)} className="md:hidden grid h-10 w-10 place-items-center rounded-full bg-grey">
          <span className="text-xl">☰</span>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-black/5 bg-paper/95 px-5 py-4 flex flex-col gap-2">
          {NAV.map((n) => (
            <a key={n.label} href={n.href} onClick={() => setOpen(false)}
              className="rounded-full bg-grey px-5 py-2 text-sm font-semibold text-ink">{n.label}</a>
          ))}
          <a href="#about" onClick={() => setOpen(false)} className="rounded-full bg-near-black px-5 py-2.5 text-sm font-semibold text-sage text-center">من نحن</a>
          <a href="#map" onClick={() => setOpen(false)} className="rounded-full bg-dark-green px-5 py-2.5 text-sm font-semibold text-sage text-center">استكشف الخريطة</a>
        </div>
      )}
    </header>
  );
}

function PlaceholderImg({
  src, alt, className, style, imgClassName,
}: { src: string; alt: string; className?: string; style?: CSSProperties; imgClassName?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl ${className ?? ""}`}
      style={style}
    >
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover ${imgClassName ?? ""}`}
        onError={(e) => {
          const img = e.currentTarget;
          img.style.display = "none";
          const cap = img.nextElementSibling as HTMLElement | null;
          if (cap) cap.style.display = "flex";
        }}
      />
     
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative ">
      <div aria-hidden className="pointer-events-none absolute -top-32 right-1/2 translate-x-1/2 h-[640px] w-[640px] rounded-full"
        />
      <div className="relative z-10 mx-auto max-w-7xl px-5 pt-16 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
            <PlaceholderImg
              src="/images/algeria-map.png"
              alt="خريطة الجزائر"
              className="w-full max-w-[550px] aspect-square"
              
            />
          </div>
          <div className="order-1 lg:order-2 text-right">
            
            <h1 className="mt-6 font-display text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] text-ink">
              خلينا نرجعو <span className="text-forest-green">الجزائر</span><br /> أكثر خضرة
            </h1>
            <p className="mt-6 max-w-2xl text-base sm:text-lg text-ink/70 leading-relaxed lg:mr-0 lg:ml-auto">
              اكتشف نقاط إعادة التدوير في ولايتك، وتعلّم كيف تفرز النفايات بطريقة صحيحة، وشارك في المبادرات البيئية المحلية.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-start gap-3">
              <a href="#map" className="rounded-full bg-dark-green px-7 py-3.5 text-sm font-bold text-sage  hover:bg-forest-green transition">استكشف الخريطة الآن</a>
              <a href="#learn" className="rounded-full border-2 border-dark-green/80 px-7 py-3.5 text-sm font-bold text-dark-green hover:bg-dark-green/5 transition">تعلّم كيف تفرز</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const cards = [
    { img: "/images/feature-1.jpg", fg: "#014734", title: "ابحث عن نقاط إعادة التدوير", text: "خريطة تفاعلية بكل نقاط التجميع في الجزائر حسب نوع النفايات.", link: "استكشف الآن", href: "#map", rotate: 3.76 },
    { img: "/images/feature-2.jpg", fg: "#d6e2be", title: "أضف نقطة جديدة", text: "ساهم في تطوير الخريطة عبر إضافة نقاط جديدة في منطقتك.", link: "أضف نقطة", href: "#map", rotate: -4.25 },
    { img: "/images/feature-3.jpg", fg: "#202020", title: "تعلّم أكثر", text: "دلائل بسيطة تشرح كيفية الفرز والتخفيض من النفايات في البيت.", link: "اقرأ الدلائل", href: "#learn", rotate: 6.97 },
    { img: "/images/feature-4.jpg", fg: "#EFEFEF", title: "شارك في فعاليات", text: "انضم لحملات التنظيف، غرس الأشجار وورشات إعادة التدوير.", link: "شاهد الفعاليات", href: "#events", rotate: -3.24 },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <h2 className="mx-auto max-w-3xl text-center font-display text-4xl sm:text-5xl font-black text-ink">
        ماذا يمكنك أن تفعل في <span className="text-forest-green">GreenDZ</span>؟
      </h2>
      <div className="mt-14 flex flex-wrap justify-center items-center gap-y-8 md:gap-y-0 md:flex-nowrap">
        {cards.map((c, i) => (
          <div
            key={i}
            className={`group relative aspect-square w-56 sm:w-60 md:w-64 lg:w-72 shrink-0 transition-transform duration-300 hover:z-10 ${i > 0 ? "md:-mr-10" : ""}`}
            style={{
              transform: `rotate(${c.rotate}deg)`,
              zIndex: 4 - i,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = `rotate(${c.rotate / 2}deg) translateY(-6px) scale(1.04)`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = `rotate(${c.rotate}deg)`; }}
          >
            <PlaceholderImg
              src={c.img}
              alt={c.title}
              className="w-full h-full "
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-3xl"
              
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6" style={{ color: c.fg }}>
              <h3 className="font-display text-base sm:text-lg lg:text-xl font-black leading-snug drop-shadow">{c.title}</h3>
              <p className="mt-2 text-[11px] sm:text-xs leading-relaxed opacity-95 drop-shadow line-clamp-3">{c.text}</p>
              <a href={c.href} className="mt-3 inline-flex items-center gap-1 text-xs font-bold underline-offset-4 hover:underline drop-shadow">
                {c.link} <span aria-hidden>←</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MapSection() {
  const [filter, setFilter] = useState<WasteType | "all">("all");
  const [points, setPoints] = useState<RecyclingPoint[]>(SEED_POINTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [pickedLatLng, setPickedLatLng] = useState<[number, number] | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("greendz.points");
      if (stored) {
        const parsed: RecyclingPoint[] = JSON.parse(stored);
        setPoints([...SEED_POINTS, ...parsed]);
      }
    } catch {}
  }, []);

  const addPoint = (p: RecyclingPoint) => {
    const userPoints = points.filter((x) => !x.id.startsWith("s"));
    const next = [...userPoints, p];
    try { localStorage.setItem("greendz.points", JSON.stringify(next)); } catch {}
    setPoints([...SEED_POINTS, ...next]);
  };

  return (
    <section id="map" className="mx-auto max-w-7xl px-5 py-20">
      <div className="flex flex-col items-center text-center">
        <h2 className="font-display text-4xl sm:text-5xl font-black text-ink">
          اكتشف نقاط إعادة التدوير في ولايتك
        </h2>
        <p className="mt-3 text-ink/70">فلتر حسب نوع النفايات، أو ساهم بإضافة نقطة جديدة</p>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              filter === f.key ? "bg-dark-green text-sage" : "bg-grey text-ink hover:bg-black/5"
            }`}>{f.label}</button>
        ))}
      </div>
      <div className="relative mt-8">
        <ClientOnly fallback={<div className="h-[520px] rounded-3xl bg-grey animate-pulse" />}>
          {
            <Suspense fallback={<div className="h-[520px] rounded-3xl bg-grey animate-pulse" />}>
              <RecyclingMap points={points} filter={filter} pickMode={false} />
            </Suspense>
          }
        </ClientOnly>
        <button onClick={() => { setPickedLatLng(null); setModalOpen(true); }}
          aria-label="أضف نقطة جديدة"
          className="absolute bottom-5 left-5 z-[500] grid h-14 w-14 place-items-center rounded-full bg-dark-green text-sage text-3xl font-black shadow-xl hover:bg-forest-green transition">
          +
        </button>
      </div>

      {modalOpen && (
        <AddPointModal
          onClose={() => setModalOpen(false)}
          onSubmit={(p) => { addPoint(p); setModalOpen(false); }}
          pickedLatLng={pickedLatLng}
          setPickedLatLng={setPickedLatLng}
          allPoints={points}
        />
      )}
    </section>
  );
}

function AddPointModal({
  onClose, onSubmit, pickedLatLng, setPickedLatLng, allPoints,
}: {
  onClose: () => void;
  onSubmit: (p: RecyclingPoint) => void;
  pickedLatLng: [number, number] | null;
  setPickedLatLng: (v: [number, number] | null) => void;
  allPoints: RecyclingPoint[];
}) {
  const [name, setName] = useState("");
  const [waste, setWaste] = useState<WasteType>("plastic");
  const [wilaya, setWilaya] = useState("الجزائر");
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [pickMode, setPickMode] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const center = WILAYA_CENTERS[wilaya] ?? [28.5, 2.8];
    const [lat, lng] = pickedLatLng ?? center;
    onSubmit({
      id: `u-${Date.now()}`,
      name: name.trim() || "نقطة إعادة تدوير",
      waste, wilaya, commune: commune.trim() || undefined,
      address: address.trim() || undefined,
      notes: notes.trim() || undefined,
      lat, lng,
    });
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-3xl bg-paper p-6 sm:p-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-black text-ink">أضف نقطة إعادة تدوير جديدة</h3>
          <button onClick={onClose} aria-label="إغلاق" className="grid h-9 w-9 place-items-center rounded-full bg-grey">✕</button>
        </div>

        <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold sm:col-span-2">
            اسم النقطة
            <input required value={name} onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-border bg-white px-4 py-3 text-base font-normal outline-none focus:border-forest-green" />
          </label>
          <label className="text-sm font-semibold">
            نوع النفايات
            <select value={waste} onChange={(e) => setWaste(e.target.value as WasteType)}
              className="mt-1.5 w-full rounded-2xl border border-border bg-white px-4 py-3 text-base font-normal outline-none focus:border-forest-green">
              {(Object.keys(WASTE_LABELS) as WasteType[]).map((k) => (
                <option key={k} value={k}>{WASTE_LABELS[k]}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            الولاية
            <select value={wilaya} onChange={(e) => setWilaya(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-border bg-white px-4 py-3 text-base font-normal outline-none focus:border-forest-green">
              {Object.keys(WILAYA_CENTERS).map((w) => <option key={w} value={w}>{w}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">
            البلدية
            <input value={commune} onChange={(e) => setCommune(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-border bg-white px-4 py-3 text-base font-normal outline-none focus:border-forest-green" />
          </label>
          <label className="text-sm font-semibold">
            العنوان
            <input value={address} onChange={(e) => setAddress(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-border bg-white px-4 py-3 text-base font-normal outline-none focus:border-forest-green" />
          </label>
          <label className="text-sm font-semibold sm:col-span-2">
            ملاحظات
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              className="mt-1.5 w-full rounded-2xl border border-border bg-white px-4 py-3 text-base font-normal outline-none focus:border-forest-green" />
          </label>

          <div className="sm:col-span-2 rounded-2xl bg-sage/40 p-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="text-sm text-dark-green">
                <div className="font-bold">اختر الموقع على الخريطة (اختياري)</div>
                <div className="opacity-80 text-xs mt-1">
                  {pickedLatLng
                    ? `الموقع المحدد: ${pickedLatLng[0].toFixed(3)}, ${pickedLatLng[1].toFixed(3)}`
                    : "إذا لم تحدد، سنستعمل مركز الولاية"}
                </div>
              </div>
              <button type="button" onClick={() => setPickMode((v) => !v)}
                className={`rounded-full px-4 py-2 text-xs font-bold ${pickMode ? "bg-dark-green text-sage" : "bg-white text-dark-green border border-dark-green/20"}`}>
                {pickMode ? "انقر على الخريطة الآن…" : "حدد موقعًا على الخريطة"}
              </button>
            </div>
            {pickMode && (
              <div className="mt-3">
                <ClientOnly fallback={<div className="h-72 rounded-2xl bg-grey animate-pulse" />}>
                  {
                    <Suspense fallback={<div className="h-72 rounded-2xl bg-grey animate-pulse" />}>
                      <div className="h-72 overflow-hidden rounded-2xl">
                        <RecyclingMap
                          points={allPoints}
                          filter="all"
                          pickMode
                          onPick={(lat, lng) => setPickedLatLng([lat, lng])}
                        />
                      </div>
                    </Suspense>
                  }
                </ClientOnly>
              </div>
            )}
          </div>

          <div className="sm:col-span-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-full bg-grey px-6 py-3 text-sm font-bold text-ink">إلغاء</button>
            <button type="submit" className="rounded-full bg-dark-green px-6 py-3 text-sm font-bold text-sage hover:bg-forest-green transition">أضف النقطة</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Learn() {
  const items = [
    {
      img: "/images/learn-1.jpg",
      title: "كيف تفرز النفايات في المنزل؟",
      reveal: "خطوات بسيطة تساعدك تبدأ من اليوم بدون أي تجهيزات.",
      pillBg: "#202020",
      pillFg: "#d6e2be",
    },
    {
      img: "/images/learn-2.jpg",
      title: "طرق تخفيض استهلاك البلاستيك",
      reveal: "بدائل سهلة ومتوفرة للجميع.",
      pillBg: "#014734",
      pillFg: "#efefef",
    },
    {
      img: "/images/learn-3.jpg",
      title: "أخطاء شائعة في إعادة التدوير",
      reveal: "تعرف على الأشياء اللي لازم نتفادوها.",
      pillBg: "#202020",
      pillFg: "#d6e2be",
    },
  ];
  return (
    <section id="learn" className="mx-auto max-w-7xl px-5 py-24">
      <div className="text-center">
        <h2 className="font-display text-4xl sm:text-5xl font-black text-ink">تعلّم كيف تساهم في حماية البيئة</h2>
        <p className="mt-3 text-ink/70">مقالات ودلائل قصيرة للبدء بشكل سليم</p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {items.map((it, i) => (
          <article
            key={i}
            tabIndex={0}
            className="group relative rounded-[30px] overflow-hidden aspect-[4/5] focus:outline-none focus-visible:ring-4 focus-visible:ring-dark-green/30"
          >
            <PlaceholderImg
              src={it.img}
              alt={it.title}
              className="absolute inset-0 w-full h-full rounded-[30px]"
            />
            <div
              className="absolute bottom-5 right-5 max-w-[85%] rounded-[22px] px-5 py-3 shadow-lg overflow-hidden transition-all duration-[250ms] ease-out"
              style={{ background: it.pillBg, color: it.pillFg }}
            >
              <h3 className="font-display text-base sm:text-lg font-black leading-snug">{it.title}</h3>
              <div
                className="grid transition-all duration-[250ms] ease-out opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-24 group-focus:opacity-100 group-focus:max-h-24 group-focus-within:opacity-100 group-focus-within:max-h-24"
              >
                <p className="text-xs sm:text-sm leading-relaxed mt-2 min-h-0">
                  {it.reveal}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EventsAndAbout() {
  const events = [
    { name: "حملة تنظيف الشاطئ", place: "بجاية", date: "20 مارس" },
    { name: "غرس الأشجار", place: "الجزائر", date: "2 أفريل" },
    { name: "ورشة إعادة التدوير للأطفال", place: "وهران", date: "15 ماي" },
  ];
  return (
    <section id="events" style={{ background: "#d6e2be" }}>
      <div className="mx-auto max-w-6xl px-5 py-24">
        <div className="text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-black" style={{ color: "#014734" }}>فعاليات بيئية قريبة منك!</h2>
          <p className="mt-3" style={{ color: "#202020" }}>يمكنك التسجيل عبر الموقع الرسمي لكل فعالية</p>
        </div>
        <ul className="mt-12 grid gap-4">
          {events.map((e, i) => (
            <li key={i} className="flex items-center justify-between gap-4 rounded-full px-6 py-4 transition hover:shadow-md"
              style={{ background: "#efefef", color: "#014734" }}>
              <div className="min-w-0">
                <div className="font-display text-lg sm:text-xl font-black truncate">{e.name}</div>
                <div className="mt-1 flex items-center gap-2 text-sm opacity-80">
                  <span aria-hidden>📍</span>
                  <span>{e.place}</span>
                  <span className="opacity-50">•</span>
                  <span>{e.date}</span>
                </div>
              </div>
              <button aria-label={`سجّل في ${e.name}`}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-lg font-black transition hover:opacity-90"
                style={{ background: "#014734", color: "#d6e2be" }}>
                ←
              </button>
            </li>
          ))}
        </ul>

        <div id="about" className="mt-24 max-w-3xl mx-auto text-center" style={{background: 'EFEFEF', color:'EFEFEF'}}>
          <h2 className="font-display text-4xl sm:text-5xl font-black" style={{ color: "#014734" }}>من نحن؟</h2>
          <p className="mt-6 text-lg leading-relaxed" style={{ color: "#202020" }}>
            هذه منصة شبابية جزائرية تهدف إلى نشر الثقافة البيئية وتسهيل إعادة التدوير عبر توفير خريطة واضحة، معلومات دقيقة، وفعاليات بيئية للمجتمع.
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-near-black text-grey">
      <div className="mx-auto max-w-5xl px-5 py-20 text-center">
        <p className="font-display text-2xl sm:text-3xl font-black leading-snug text-sage max-w-2xl mx-auto">
          نؤمن أن التغيير يبدأ بخطوة صغيرة… وخطوتك اليوم تصنع فرق!
        </p>
        <div className="mt-14 rounded-3xl bg-white/5 p-8 max-w-xl mx-auto">
          <h3 className="font-display text-2xl font-black text-sage">تواصل معنا</h3>
          <p className="mt-3 text-grey/80">عندك اقتراح؟ حاب تشارك بنقطة؟ أو عندك فكرة تعاون؟</p>
          <div className="mt-5 flex flex-col items-center gap-2 text-sm">
            <a href="mailto:yasmine.hamaili@gmail.com" className="rounded-full bg-sage/10 px-5 py-2 font-semibold text-sage hover:bg-sage/20 transition">yasmine.hamaili@gmail.com</a>
            <a href="in:Yasmine Hamaili" dir="ltr" className="rounded-full bg-sage/10 px-5 py-2 font-semibold text-sage hover:bg-sage/20 transition">LinkedIn: Yasmine Hamaili</a>
          </div>
        </div>
        <div className="mt-14 text-xs text-grey/50">{new Date().getFullYear()} GreenDZ</div>
                <div className="mt-14 text-xs text-grey/50" style={{marginTop: -1}}>©كل الحقوق محفوظة</div>
      </div>
    </footer>
  );
}

function Home() {
  // silence unused import warning
  useMemo(() => WASTE_LABELS, []);
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />
      <main>
        <Hero />
        <Features />
        <MapSection />
        <Learn />
        <EventsAndAbout />
      </main>
      <Footer />
    </div>
  );
}
