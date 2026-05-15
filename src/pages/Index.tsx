import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/624174c4-a72b-407b-8e2c-917c2c2ee04a/files/032df176-0925-4bdf-b43b-ac56433f1f4e.jpg";

const NAV_LINKS = [
  { label: "Главная", href: "#hero" },
  { label: "Услуги", href: "#services" },
  { label: "Каталог", href: "#catalog" },
  { label: "О компании", href: "#about" },
  { label: "Контакты", href: "#contacts" },
];

const SERVICES = [
  { icon: "Building2", title: "Жилые комплексы", desc: "Проектирование и строительство многоквартирных домов бизнес и премиум класса с полной инфраструктурой." },
  { icon: "Landmark", title: "Коммерческая недвижимость", desc: "Офисные центры, торговые помещения и складские комплексы под ключ." },
  { icon: "Home", title: "Частное строительство", desc: "Индивидуальные загородные дома и коттеджи по авторским проектам." },
  { icon: "Wrench", title: "Девелопмент", desc: "Полный цикл разработки проекта: от анализа земельного участка до сдачи объекта." },
  { icon: "FileText", title: "Юридическое сопровождение", desc: "Оформление документов, согласование проектов и регистрация собственности." },
  { icon: "TrendingUp", title: "Инвестиции", desc: "Консультации по инвестированию в недвижимость и управление активами." },
];

const CATALOG = [
  { id: 1, name: "Резиденции «Северная Звезда»", type: "ЖК Бизнес-класс", area: "от 65 м²", price: "от 12 млн ₽", status: "Строится", statusColor: "#C9A84C", floors: "28 этажей", location: "ул. Северная, 45", lat: 55.780, lng: 37.620 },
  { id: 2, name: "Апартаменты «Высота»", type: "ЖК Премиум", area: "от 90 м²", price: "от 28 млн ₽", status: "Продажи открыты", statusColor: "#4CAF50", floors: "42 этажа", location: "пр. Мира, 12", lat: 55.760, lng: 37.650 },
  { id: 3, name: "Бизнес-центр «Гранит»", type: "Коммерция", area: "от 40 м²", price: "от 8 млн ₽", status: "Сдан", statusColor: "#5B9BD5", floors: "16 этажей", location: "Лесной б-р, 3", lat: 55.800, lng: 37.580 },
  { id: 4, name: "Коттеджный посёлок «Берег»", type: "Загородная недвижимость", area: "от 180 м²", price: "от 35 млн ₽", status: "Строится", statusColor: "#C9A84C", floors: "2–3 этажа", location: "Рублёво-Успенское ш.", lat: 55.730, lng: 37.480 },
  { id: 5, name: "МФК «Атлас»", type: "ЖК Комплекс", area: "от 55 м²", price: "от 18 млн ₽", status: "Проектирование", statusColor: "#FF7043", floors: "35 этажей", location: "Садовое кольцо, 78", lat: 55.755, lng: 37.620 },
];

const TEAM = [
  { name: "Александр Волков", role: "Генеральный директор", years: "20+ лет опыта" },
  { name: "Марина Соколова", role: "Архитектурный директор", years: "15+ лет опыта" },
  { name: "Дмитрий Орлов", role: "Коммерческий директор", years: "12+ лет опыта" },
  { name: "Елена Петрова", role: "Юридический директор", years: "18+ лет опыта" },
];

const STATS = [
  { value: "127", label: "Объектов сдано" },
  { value: "15", label: "Лет на рынке" },
  { value: "4 200", label: "Семей получили ключи" },
  { value: "98%", label: "Положительных отзывов" },
];

const MAP_BOUNDS = { minLat: 55.72, maxLat: 55.81, minLng: 37.47, maxLng: 37.67 };

function latLngToPercent(lat: number, lng: number) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100;
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100;
  return { x, y };
}

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

export default function Index() {
  const [activeSection, setActiveSection] = useState("hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPin, setSelectedPin] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const [filterType, setFilterType] = useState("Все");

  const heroAnim = useInView(0.05);
  const servicesAnim = useInView(0.05);
  const catalogAnim = useInView(0.05);
  const aboutAnim = useInView(0.05);
  const contactsAnim = useInView(0.05);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "services", "catalog", "about", "contacts"];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 80 && rect.bottom > 80) { setActiveSection(id); break; }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filteredCatalog = filterType === "Все"
    ? CATALOG
    : filterType === "ЖК"
    ? CATALOG.filter(o => o.type.startsWith("ЖК"))
    : CATALOG.filter(o => o.type === "Коммерция");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSent(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#EDE8DC] font-body overflow-x-hidden">

      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="glass border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="#hero" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#C9A84C] to-[#9A7A2E] rounded flex items-center justify-center">
                <span className="text-[#0A0A0F] font-display font-bold text-sm">A</span>
              </div>
              <span className="font-display text-xl font-semibold tracking-wide">ALTA <span className="text-[#C9A84C]">Group</span></span>
            </a>

            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map(link => (
                <a key={link.href} href={link.href}
                  className={`text-sm tracking-wide transition-colors duration-200 hover:text-[#C9A84C] ${activeSection === link.href.slice(1) ? "text-[#C9A84C]" : "text-[#EDE8DC]/70"}`}>
                  {link.label}
                </a>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <a href="tel:+74951234567" className="text-sm text-[#EDE8DC]/60 hover:text-[#C9A84C] transition-colors">+7 (495) 123-45-67</a>
              <a href="#contacts" className="px-5 py-2 bg-gradient-to-r from-[#C9A84C] to-[#9A7A2E] text-[#0A0A0F] text-sm font-semibold rounded hover:opacity-90 transition-opacity">
                Консультация
              </a>
            </div>

            <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              <Icon name={menuOpen ? "X" : "Menu"} size={22} className="text-[#EDE8DC]" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden glass border-b border-white/5 px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                className="text-sm text-[#EDE8DC]/70 hover:text-[#C9A84C] transition-colors">{link.label}</a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="ALTA Group" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-[#0A0A0F]/80 to-[#0A0A0F]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-[#0A0A0F]/40" />
        </div>

        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-[#C9A84C]/6 blur-3xl animate-float pointer-events-none" />

        <div ref={heroAnim.ref} className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16">
          <div className="max-w-2xl">
            <div className={`inline-flex items-center gap-2 glass-gold px-4 py-2 rounded-full mb-6 ${heroAnim.inView ? "animate-fade-up" : "opacity-0"}`}>
              <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
              <span className="text-[#C9A84C] text-xs tracking-widest uppercase font-medium">Премиальная недвижимость с 2009 года</span>
            </div>

            <h1 className={`font-display text-5xl md:text-7xl lg:text-8xl font-light leading-[1.05] mb-6 ${heroAnim.inView ? "animate-fade-up animate-delay-200" : "opacity-0"}`}>
              Строим<br />
              <em className="text-gradient-gold not-italic">будущее</em><br />
              вместе
            </h1>

            <p className={`text-[#EDE8DC]/60 text-lg md:text-xl leading-relaxed mb-10 max-w-xl ${heroAnim.inView ? "animate-fade-up animate-delay-300" : "opacity-0"}`}>
              Жилые комплексы, коммерческие объекты и частное строительство высочайшего качества. Мы воплощаем архитектурные амбиции в реальность.
            </p>

            <div className={`flex flex-wrap gap-4 ${heroAnim.inView ? "animate-fade-up animate-delay-400" : "opacity-0"}`}>
              <a href="#catalog" className="px-8 py-4 bg-gradient-to-r from-[#C9A84C] to-[#9A7A2E] text-[#0A0A0F] font-semibold rounded hover:opacity-90 transition-all duration-200 hover:scale-105 active:scale-95">
                Смотреть объекты
              </a>
              <a href="#contacts" className="px-8 py-4 glass text-[#EDE8DC] rounded hover:border-[#C9A84C]/30 transition-all duration-200">
                Получить консультацию
              </a>
            </div>

            <div className={`flex gap-10 mt-16 ${heroAnim.inView ? "animate-fade-up animate-delay-500" : "opacity-0"}`}>
              {STATS.slice(0, 3).map(s => (
                <div key={s.label}>
                  <div className="font-display text-3xl font-semibold" style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</div>
                  <div className="text-[#EDE8DC]/40 text-xs mt-1 tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="flex flex-col items-center gap-2 text-[#EDE8DC]/30">
            <span className="text-xs tracking-widest uppercase">Прокрутите</span>
            <Icon name="ChevronDown" size={16} />
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C9A84C]/2 to-transparent pointer-events-none" />
        <div ref={servicesAnim.ref} className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className={`mb-16 ${servicesAnim.inView ? "animate-fade-up" : "opacity-0"}`}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-[#C9A84C]" />
              <span className="text-[#C9A84C] text-xs tracking-widest uppercase">Наши услуги</span>
            </div>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
              Полный спектр<br />
              <em className="not-italic" style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>строительных услуг</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <div key={s.title}
                className={`group p-8 rounded-xl bg-[#111118] border border-white/5 hover:border-[#C9A84C]/30 transition-all duration-300 hover:-translate-y-1 ${servicesAnim.inView ? "animate-fade-up" : "opacity-0"}`}
                style={{ animationDelay: `${i * 80}ms` }}>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#C9A84C]/20 to-[#C9A84C]/5 flex items-center justify-center mb-6 group-hover:from-[#C9A84C]/30 transition-all">
                  <Icon name={s.icon} size={22} className="text-[#C9A84C]" />
                </div>
                <h3 className="font-display text-xl font-medium mb-3 text-[#EDE8DC]">{s.title}</h3>
                <p className="text-[#EDE8DC]/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="py-24 lg:py-32 bg-[#0D0D14]">
        <div ref={catalogAnim.ref} className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className={`flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 ${catalogAnim.inView ? "animate-fade-up" : "opacity-0"}`}>
            <div>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-px bg-[#C9A84C]" />
                <span className="text-[#C9A84C] text-xs tracking-widest uppercase">Наши объекты</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light">
                Каталог<br />
                <em className="not-italic" style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>недвижимости</em>
              </h2>
            </div>
            <div className="flex gap-2 flex-wrap">
              {["Все", "ЖК", "Коммерция"].map(t => (
                <button key={t} onClick={() => setFilterType(t)}
                  className={`px-5 py-2 rounded text-sm transition-all duration-200 ${filterType === t ? "bg-[#C9A84C] text-[#0A0A0F] font-semibold" : "glass text-[#EDE8DC]/60 hover:text-[#EDE8DC]"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredCatalog.map((obj, i) => (
              <div key={obj.id}
                className={`group rounded-xl overflow-hidden bg-[#111118] border border-white/5 hover:border-[#C9A84C]/30 transition-all duration-300 hover:-translate-y-1 ${catalogAnim.inView ? "animate-fade-up" : "opacity-0"}`}
                style={{ animationDelay: `${i * 80}ms` }}>
                <div className="h-48 bg-gradient-to-br from-[#1E1E2A] to-[#111118] relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/5 to-transparent" />
                  <Icon name="Building2" size={48} className="text-[#C9A84C]/20" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{ background: `${obj.statusColor}20`, color: obj.statusColor, border: `1px solid ${obj.statusColor}40` }}>
                      {obj.status}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="text-[#EDE8DC]/30 text-xs">{obj.floors}</div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-[#C9A84C]/60 text-xs tracking-wide uppercase mb-2">{obj.type}</div>
                  <h3 className="font-display text-xl font-medium mb-1">{obj.name}</h3>
                  <div className="flex items-center gap-1 text-[#EDE8DC]/40 text-xs mb-4">
                    <Icon name="MapPin" size={12} />
                    <span>{obj.location}</span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <div>
                      <div className="text-[#EDE8DC]/40 text-xs">{obj.area}</div>
                      <div className="font-semibold text-[#C9A84C]">{obj.price}</div>
                    </div>
                    <button className="p-2 rounded-lg glass hover:glass-gold transition-all">
                      <Icon name="ArrowRight" size={16} className="text-[#C9A84C]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* INTERACTIVE MAP */}
          <div className={`${catalogAnim.inView ? "animate-fade-up animate-delay-400" : "opacity-0"}`}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-px bg-[#C9A84C]" />
              <span className="text-[#C9A84C] text-xs tracking-widest uppercase">Карта объектов</span>
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-[#0D1117]" style={{ height: 420 }}>
              <div className="absolute inset-0">
                <svg className="w-full h-full opacity-15">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#C9A84C" strokeWidth="0.4"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 420" preserveAspectRatio="none">
                  {/* City blocks */}
                  {[
                    [60,40,80,50],[160,30,60,30],[250,50,100,40],[380,20,70,60],[500,40,90,35],[620,30,60,45],[700,50,70,30],
                    [50,130,90,60],[180,120,70,40],[290,140,110,55],[440,110,80,65],[560,130,95,45],[690,120,80,50],
                    [60,230,100,55],[200,220,80,50],[320,240,120,45],[480,220,90,60],[610,230,75,50],[720,240,60,40],
                    [80,330,90,55],[220,320,75,65],[340,340,130,50],[510,330,85,55],[640,340,80,45]
                  ].map(([x,y,w,h], idx) => (
                    <rect key={idx} x={x} y={y} width={w} height={h} rx="2" fill="#1a2030" stroke="#2a3040" strokeWidth="0.5"/>
                  ))}
                  {/* Roads */}
                  {[100,200,310].map(y => (
                    <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="#C9A84C" strokeWidth="0.8" opacity="0.3"/>
                  ))}
                  {[150,350,550,720].map(x => (
                    <line key={x} x1={x} y1="0" x2={x} y2="420" stroke="#C9A84C" strokeWidth="0.8" opacity="0.3"/>
                  ))}
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117]/50 to-transparent pointer-events-none" />
              </div>

              {/* Pins */}
              {CATALOG.map((obj) => {
                const { x, y } = latLngToPercent(obj.lat, obj.lng);
                const isSelected = selectedPin === obj.id;
                return (
                  <div key={obj.id} className="absolute cursor-pointer"
                    style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -100%)" }}
                    onClick={() => setSelectedPin(isSelected ? null : obj.id)}>
                    <div className="relative flex flex-col items-center">
                      {isSelected && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#C9A84C]/25 animate-ping" />
                      )}
                      <div className={`relative z-10 transition-all duration-200 ${isSelected ? "scale-125" : "hover:scale-110"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-[#C9A84C]/20 ${isSelected ? "bg-[#C9A84C]" : "bg-[#C9A84C]/85"}`}>
                          <Icon name="Building2" size={14} className="text-[#0A0A0F]" />
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0.5 h-3 bg-[#C9A84C]" />
                      </div>
                      {isSelected && (
                        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-52 glass-gold rounded-xl p-3 shadow-xl z-20 pointer-events-none">
                          <div className="text-[#C9A84C] text-xs font-medium tracking-wide mb-1">{obj.type}</div>
                          <div className="font-display text-sm font-medium text-[#EDE8DC] mb-1">{obj.name}</div>
                          <div className="text-[#EDE8DC]/50 text-xs mb-2">{obj.location}</div>
                          <div className="font-semibold text-[#C9A84C] text-sm">{obj.price}</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="absolute bottom-4 left-4 glass rounded-lg px-4 py-2 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#C9A84C]" />
                <span className="text-xs text-[#EDE8DC]/60">Объект ALTA Group</span>
              </div>
              <div className="absolute top-4 right-4 glass rounded-lg px-3 py-2">
                <span className="text-xs text-[#EDE8DC]/40">Москва и МО</span>
              </div>
              <div className="absolute top-4 left-4 glass rounded-lg px-3 py-2">
                <span className="text-xs text-[#EDE8DC]/40">Нажмите на объект</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#C9A84C]/3 to-transparent pointer-events-none" />
        <div ref={aboutAnim.ref} className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className={`${aboutAnim.inView ? "animate-fade-up" : "opacity-0"}`}>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-px bg-[#C9A84C]" />
                <span className="text-[#C9A84C] text-xs tracking-widest uppercase">О компании</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mb-8">
                15 лет создаём<br />
                <em className="not-italic" style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>пространства</em><br />
                для жизни
              </h2>
              <p className="text-[#EDE8DC]/60 leading-relaxed mb-6">
                ALTA Group — ведущий девелопер Москвы и Подмосковья. С 2009 года мы создаём объекты, которые становятся архитектурными landmarks своих районов. Наши проекты объединяют современную архитектуру, передовые технологии строительства и вдумчивое создание жилой среды.
              </p>
              <p className="text-[#EDE8DC]/60 leading-relaxed mb-10">
                Мы убеждены: качественная недвижимость — это инвестиция в качество жизни. Каждый наш проект проходит многоуровневый контроль качества и соответствует высочайшим стандартам.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {STATS.map(s => (
                  <div key={s.label} className="p-6 rounded-xl bg-[#111118] border border-white/5 hover:border-[#C9A84C]/20 transition-all">
                    <div className="font-display text-3xl font-semibold mb-1"
                      style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {s.value}
                    </div>
                    <div className="text-[#EDE8DC]/40 text-xs tracking-wide">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${aboutAnim.inView ? "animate-fade-up animate-delay-200" : "opacity-0"}`}>
              <h3 className="font-display text-2xl font-light mb-6 text-[#EDE8DC]/80">Команда руководителей</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {TEAM.map((member) => (
                  <div key={member.name} className="p-5 rounded-xl bg-[#111118] border border-white/5 hover:border-[#C9A84C]/20 transition-all duration-300">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A84C]/30 to-[#C9A84C]/10 flex items-center justify-center mb-3">
                      <span className="font-display font-bold text-[#C9A84C] text-sm">{member.name[0]}</span>
                    </div>
                    <div className="font-medium text-sm text-[#EDE8DC] mb-0.5">{member.name}</div>
                    <div className="text-[#EDE8DC]/40 text-xs mb-1">{member.role}</div>
                    <div className="text-[#C9A84C]/70 text-xs">{member.years}</div>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-xl glass-gold">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-[#C9A84C]/20 flex items-center justify-center">
                    <Icon name="Award" size={20} className="text-[#C9A84C]" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-medium mb-1">Лауреат премии «Лучший застройщик года»</h4>
                    <p className="text-[#EDE8DC]/50 text-sm">Национальная премия в области недвижимости, 2023 и 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-24 lg:py-32 bg-[#0D0D14]">
        <div ref={contactsAnim.ref} className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className={`${contactsAnim.inView ? "animate-fade-up" : "opacity-0"}`}>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="w-8 h-px bg-[#C9A84C]" />
                <span className="text-[#C9A84C] text-xs tracking-widest uppercase">Контакты</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-light mb-8">
                Обсудим ваш<br />
                <em className="not-italic" style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>проект</em>
              </h2>
              <p className="text-[#EDE8DC]/60 leading-relaxed mb-10">
                Свяжитесь с нами для получения подробной информации об объектах, условиях сотрудничества или индивидуальной консультации.
              </p>

              <div className="space-y-4">
                {[
                  { icon: "Phone", label: "Телефон", value: "+7 (495) 123-45-67" },
                  { icon: "Mail", label: "Email", value: "info@alta-group.ru" },
                  { icon: "MapPin", label: "Офис", value: "Москва, ул. Тверская, 1, офис 501" },
                  { icon: "Clock", label: "Режим работы", value: "Пн–Пт: 9:00–19:00, Сб: 10:00–17:00" },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4 p-4 rounded-xl bg-[#111118] border border-white/5 hover:border-[#C9A84C]/20 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
                      <Icon name={item.icon} size={18} className="text-[#C9A84C]" />
                    </div>
                    <div>
                      <div className="text-[#EDE8DC]/40 text-xs">{item.label}</div>
                      <div className="text-[#EDE8DC] text-sm font-medium">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${contactsAnim.inView ? "animate-fade-up animate-delay-200" : "opacity-0"}`}>
              {formSent ? (
                <div className="h-full flex flex-col items-center justify-center text-center glass-gold rounded-2xl p-12 min-h-[400px]">
                  <div className="w-16 h-16 rounded-full bg-[#C9A84C]/20 flex items-center justify-center mb-6">
                    <Icon name="CheckCircle" size={32} className="text-[#C9A84C]" />
                  </div>
                  <h3 className="font-display text-2xl font-light mb-3">Заявка отправлена!</h3>
                  <p className="text-[#EDE8DC]/60">Наш менеджер свяжется с вами в течение рабочего дня.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="p-8 rounded-2xl bg-[#111118] border border-white/5">
                  <h3 className="font-display text-2xl font-light mb-6">Оставить заявку</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-[#EDE8DC]/40 mb-2 tracking-wide uppercase">Ваше имя</label>
                      <input type="text" required value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Александр Иванов"
                        className="w-full px-4 py-3 rounded-lg bg-[#1E1E2A] border border-white/8 text-[#EDE8DC] placeholder-[#EDE8DC]/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-[#EDE8DC]/40 mb-2 tracking-wide uppercase">Телефон</label>
                      <input type="tel" required value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+7 (___) ___-__-__"
                        className="w-full px-4 py-3 rounded-lg bg-[#1E1E2A] border border-white/8 text-[#EDE8DC] placeholder-[#EDE8DC]/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-[#EDE8DC]/40 mb-2 tracking-wide uppercase">Сообщение</label>
                      <textarea rows={4} value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Интересует квартира в ЖК бизнес-класса..."
                        className="w-full px-4 py-3 rounded-lg bg-[#1E1E2A] border border-white/8 text-[#EDE8DC] placeholder-[#EDE8DC]/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors text-sm resize-none" />
                    </div>
                    <button type="submit"
                      className="w-full py-4 bg-gradient-to-r from-[#C9A84C] to-[#9A7A2E] text-[#0A0A0F] font-semibold rounded-lg hover:opacity-90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]">
                      Отправить заявку
                    </button>
                    <p className="text-center text-[#EDE8DC]/30 text-xs">
                      Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-[#C9A84C] to-[#9A7A2E] rounded flex items-center justify-center">
              <span className="text-[#0A0A0F] font-display font-bold text-xs">A</span>
            </div>
            <span className="font-display text-lg">ALTA <span className="text-[#C9A84C]">Group</span></span>
          </div>
          <div className="flex gap-6">
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} className="text-xs text-[#EDE8DC]/30 hover:text-[#C9A84C] transition-colors">{link.label}</a>
            ))}
          </div>
          <div className="text-xs text-[#EDE8DC]/20">© 2024 ALTA Group. Все права защищены.</div>
        </div>
      </footer>
    </div>
  );
}