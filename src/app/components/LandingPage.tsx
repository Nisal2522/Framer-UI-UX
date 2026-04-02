import { Link } from "react-router";
import { useState, useEffect, useCallback } from "react";
import {
  ArrowRight,
  Users,
  UserCog,
  Building2,
  Shield,
  LayoutDashboard,
  Sprout,
  FileText,
  Package,
  Network,
  BookOpen,
  MessageSquare,
  BarChart3,
  CheckCircle,
  TrendingUp,
  Target,
  Database,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  MapPinned,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Leaf,
  Globe,
  Heart,
  Quote,
} from "lucide-react";
const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1920&q=80",
    title: "Empowering Agricultural Cooperatives",
    subtitle: "Through Digital Innovation",
    description: "A unified platform connecting Farmers, Cooperatives, and Government for sustainable agricultural growth in Cambodia.",
  },
  {
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80",
    title: "Building Sustainable Futures",
    subtitle: "For Rural Communities",
    description: "Enabling data-driven decisions, transparent operations, and collaborative growth across the agricultural sector.",
  },
  {
    image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1920&q=80",
    title: "From Farm to Framework",
    subtitle: "Smart Cooperative Management",
    description: "Streamline business plans, track assets, manage members, and monitor crop production — all in one place.",
  },
];

const farmerImages = [
  {
    src: "https://images.unsplash.com/photo-1589923188651-268a9765e432?auto=format&fit=crop&w=600&q=80",
    alt: "Farmer harvesting rice in paddy field",
    caption: "Sustainable rice farming practices",
  },
  {
    src: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80",
    alt: "Farmers working together in field",
    caption: "Cooperative collaboration",
  },
  {
    src: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80",
    alt: "Agricultural landscape with crops",
    caption: "Diverse crop cultivation",
  },
  {
    src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=600&q=80",
    alt: "Green rice terraces",
    caption: "Eco-friendly land management",
  },
];

export function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 700);
  }, [isTransitioning]);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % heroSlides.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const features = [
    { icon: LayoutDashboard, title: "Dashboard & Insights", description: "Real-time analytics and comprehensive overview of cooperative performance" },
    { icon: Users, title: "Farmer & Land Management", description: "Complete member profiles, land registration, and crop tracking" },
    { icon: Sprout, title: "Crop Tracking", description: "Monitor crop types, cultivation areas, and production data" },
    { icon: FileText, title: "Business Plan Management", description: "Submit, review, and track business plan approval workflows" },
    { icon: Package, title: "Asset Management", description: "Track equipment, inventory, and resource allocation efficiently" },
    { icon: Network, title: "Committee Hierarchy", description: "Manage organizational structure and member responsibilities" },
    { icon: BookOpen, title: "Knowledge Hub", description: "Access agricultural resources, best practices, and training materials" },
    { icon: MessageSquare, title: "AI Chatbot Support", description: "24/7 intelligent assistance for queries and guidance" },
    { icon: BarChart3, title: "Reports & Analytics", description: "Generate comprehensive reports and data-driven insights" },
  ];

  const stats = [
    { value: "447+", label: "Registered Farmers", icon: Users },
    { value: "120+", label: "Cooperatives", icon: Building2 },
    { value: "1.2K", label: "Hectares Managed", icon: Globe },
    { value: "15+", label: "Provinces Covered", icon: MapPinned },
  ];

  const steps = [
    { number: "01", title: "Government Registration", description: "Authorities register and verify Agricultural Cooperatives in the system" },
    { number: "02", title: "Resource Management", description: "Cooperatives manage farmers, land, crops, and organizational structure" },
    { number: "03", title: "Business Plan Workflow", description: "Submit business plans for review and approval by government officials" },
    { number: "04", title: "Analytics & Growth", description: "Leverage data insights for informed decision-making and cooperative development" },
  ];

  const featureIconGradients = [
    "from-cyan-500 to-emerald-500",
    "from-emerald-500 to-green-500",
    "from-lime-500 to-green-500",
    "from-sky-500 to-blue-500",
    "from-amber-500 to-orange-500",
    "from-violet-500 to-indigo-500",
    "from-pink-500 to-fuchsia-500",
    "from-purple-500 to-violet-500",
    "from-cyan-500 to-blue-500",
  ];

  const testimonials = [
    {
      quote: "FOMMP has completely transformed how we manage our cooperative. We can now track every farmer and every hectare efficiently.",
      name: "Sok Chanthy",
      role: "Cooperative President, Battambang",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    },
    {
      quote: "The business plan approval process used to take weeks. Now it's streamlined and transparent for everyone involved.",
      name: "Chea Sopheap",
      role: "Provincial Agriculture Officer",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    },
    {
      quote: "Having access to crop data and market information in one place has helped our farmers make better decisions for their land.",
      name: "Meas Sothea",
      role: "Farmer, Siem Reap Province",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#032EA1] border border-blue-100 shadow-md shadow-blue-500/20 flex items-center justify-center">
                <Sprout className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-[#0F2F8F] to-[#3B5FCC] bg-clip-text text-transparent">AgriCoop Portal</h1>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">About</a>
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
              <a href="#impact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Impact</a>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/login"
                className="px-5 py-2 bg-[#0F2F8F] text-white rounded-lg text-sm font-medium hover:bg-[#0D2A7D] transition-all shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Slideshow */}
      <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: currentSlide === index ? 1 : 0, zIndex: currentSlide === index ? 1 : 0 }}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </div>
        ))}

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl relative min-h-[320px] md:min-h-[360px]">
              {heroSlides.map((slide, index) => (
                <div
                  key={index}
                  className="absolute inset-0 transition-all duration-700 ease-in-out"
                  style={{
                    opacity: currentSlide === index ? 1 : 0,
                    transform: currentSlide === index ? "translateY(0)" : "translateY(20px)",
                    pointerEvents: currentSlide === index ? "auto" : "none",
                  }}
                >
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2F8F]/90 text-white text-xs font-medium mb-6">
                    <Leaf className="w-3 h-3" />
                    FAO / PEARL Initiative
                  </span>
                  <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-2xl md:text-3xl font-light text-green-400 mb-6">
                    {slide.subtitle}
                  </p>
                  <p className="text-lg text-gray-300 mb-8 max-w-xl leading-relaxed">
                    {slide.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="absolute bottom-8 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentSlide === index
                      ? "w-10 h-2.5 bg-green-500"
                      : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100 -mt-16 relative z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
            {stats.map((stat, index) => (
              <div key={index} className="px-6 py-8 text-center">
                <stat.icon className="w-6 h-6 text-[#0F2F8F] mx-auto mb-3" />
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About — full-width band, reference layout */}
      <section id="about" className="w-full py-20 lg:py-28 bg-gradient-to-b from-slate-50 via-white to-white border-y border-slate-100/80">
        <div className="w-full max-w-[min(100%,1440px)] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 2xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 xl:gap-20 items-center">
            <div className="lg:col-span-5">
              <span className="text-[#0F2F8F] font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase">
                About the Platform
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[2.35rem] xl:text-4xl font-bold text-[#0c1a3a] leading-[1.15] tracking-tight">
                Bridging Agriculture and Technology for Sustainable Growth
              </h2>
              <p className="mt-5 text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl">
                FOMMP is a comprehensive digital platform developed under the FAO/PEARL initiative
                to modernize agricultural cooperative management in Cambodia. It connects three
                key stakeholders in a unified ecosystem.
              </p>
              <ul className="mt-8 space-y-5">
                {[
                  { icon: Shield, label: "Government", desc: "Oversight, approvals, and nationwide analytics." },
                  { icon: Building2, label: "Cooperatives", desc: "Member management, business plans, and resources." },
                  { icon: UserCog, label: "Farmers", desc: "Profiles, land tracking, and training access." },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-sky-100/90 flex items-center justify-center flex-shrink-0 shadow-sm shadow-sky-900/5">
                      <item.icon className="w-5 h-5 text-[#0F2F8F]" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <h4 className="font-semibold text-[#0c1a3a] text-base">{item.label}</h4>
                      <p className="text-sm text-gray-500 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-7 w-full">
              <div
                className="grid grid-cols-2 gap-3 sm:gap-4 w-full min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] xl:min-h-[480px]"
                style={{ gridAutoRows: "minmax(0, 1fr)" }}
              >
                {farmerImages.map((img, i) => (
                  <div
                    key={i}
                    className={[
                      "relative overflow-hidden rounded-2xl ring-1 ring-black/[0.06] shadow-lg shadow-slate-900/10",
                      i === 0 ? "row-span-2 min-h-[200px] sm:min-h-[260px]" : "min-h-[120px] sm:min-h-[140px]",
                      i === 3 ? "col-span-2 min-h-[140px] sm:min-h-[160px]" : "",
                    ].join(" ")}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                    <p className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 text-white text-xs sm:text-sm font-medium leading-snug drop-shadow-sm">
                      {img.caption}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Farmer Gallery */}
      <section className="py-0 overflow-hidden">
        <div className="flex animate-scroll">
          {[
            "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80",
            "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=400&q=80",
          ].map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Farm scene ${i + 1}`}
              className="w-64 h-40 object-cover flex-shrink-0"
              loading="lazy"
            />
          ))}
        </div>
        <style>{`
          @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .animate-scroll { animation: scroll 40s linear infinite; width: max-content; }
          .animate-scroll:hover { animation-play-state: paused; }
        `}</style>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#0F2F8F] font-semibold text-sm tracking-wide uppercase">Platform Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed for every level of agricultural cooperative management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-emerald-100/70 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${
                    featureIconGradients[index % featureIconGradients.length]
                  } shadow-md`}
                >
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-blue-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#0F2F8F] font-semibold text-sm tracking-wide uppercase">Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A simple, streamlined workflow for effective cooperative management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-b from-white to-blue-50/60 rounded-2xl p-8 h-full border-2 border-[#0F2F8F]/20 hover:border-[#0F2F8F]/35 hover:shadow-md transition-all">
                  <div className="text-5xl font-bold text-[#0F2F8F]/20 mb-4">{step.number}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-500">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ChevronRight className="w-8 h-8 text-[#0F2F8F]/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability / Impact */}
      <section id="impact" className="py-24 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80"
          alt="Sustainable farming"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-gray-900/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-600/20 border border-green-500/30 text-green-400 text-xs font-medium mb-6">
              <Heart className="w-3 h-3" />
              Sustainability & Impact
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Growing Together Towards a Sustainable Future
            </h2>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              By digitalizing cooperative management, FOMMP reduces paperwork, improves resource 
              allocation, and empowers farming communities with the data they need to thrive 
              sustainably.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
              {[
                { icon: CheckCircle, label: "Improved Transparency" },
                { icon: TrendingUp, label: "Better Yield Tracking" },
                { icon: Target, label: "Data-Driven Farming" },
                { icon: Database, label: "Centralized Records" },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mx-auto mb-3 border border-green-500/20">
                    <item.icon className="w-6 h-6 text-green-400" />
                  </div>
                  <p className="text-sm text-white font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-b from-white to-blue-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#0F2F8F] font-semibold text-sm tracking-wide uppercase">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
              Voices from the Field
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hear from the people who use FOMMP every day to manage their cooperatives and farms
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-[#0F2F8F]/15 shadow-sm hover:shadow-md hover:border-[#0F2F8F]/30 transition-all">
                <Quote className="w-8 h-8 text-[#0F2F8F]/25 mb-4" />
                <p className="text-gray-600 leading-relaxed mb-6">{t.quote}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[#0F2F8F]/10">
                  <img src={t.image} alt={t.name} className="w-11 h-11 rounded-full object-cover" loading="lazy" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#0F2F8F] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 800 400" fill="none">
            <circle cx="200" cy="200" r="300" stroke="white" strokeWidth="1" />
            <circle cx="600" cy="300" r="250" stroke="white" strokeWidth="1" />
            <circle cx="400" cy="100" r="200" stroke="white" strokeWidth="1" />
          </svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Cooperative?
          </h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Join hundreds of agricultural cooperatives already using FOMMP to improve transparency,
            efficiency, and sustainable growth.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 rounded-lg text-lg font-semibold hover:shadow-2xl transition-all"
            >
              Register Your Cooperative
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white rounded-lg text-lg font-semibold hover:bg-white/10 transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-400 mb-8 font-medium tracking-wide uppercase">Supported By</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-60 grayscale">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-[#032EA1] flex items-center justify-center">
                <Sprout className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-lg font-bold text-gray-700">FAO</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-8 h-8 text-gray-500" />
              <span className="text-lg font-bold text-gray-700">PEARL Project</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-gray-500" />
              <span className="text-lg font-bold text-gray-700">MAFF Cambodia</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-gray-800">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#032EA1] border border-gray-700 flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold bg-gradient-to-r from-[#6B9FFF] to-[#93BFFF] bg-clip-text text-transparent">AgriCoop Portal</h3>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-6 max-w-md leading-relaxed">
                Empowering agricultural cooperatives in Cambodia through digital innovation and
                transparent management systems. A FAO/PEARL initiative for sustainable development.
              </p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Quick Links</h4>
              <ul className="space-y-2.5 text-sm">
                {["Login", "About Us", "Features", "User Guide", "FAQ"].map((text, i) => (
                  <li key={i}>
                    <Link to={i === 0 ? "/login" : "#"} className="hover:text-white transition-colors">
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Contact Us</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2.5">
                  <MapPinned className="w-4 h-4 flex-shrink-0 text-green-500 mt-0.5" />
                  <span>Ministry of Agriculture, Phnom Penh, Cambodia</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 flex-shrink-0 text-green-500" />
                  <span>+855 23 123 4567</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 flex-shrink-0 text-green-500" />
                  <span>support@fommp.gov.kh</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 text-center text-xs text-gray-500">
            <p>© 2026 FOMMP — Farmer Organizations Management and Monitoring Platform. All rights reserved.</p>
            <p className="mt-1.5">A FAO/PEARL Project Initiative for Cambodia Agricultural Development</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
