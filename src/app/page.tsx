"use client";


import { Mail, MessageCircle, Camera, Menu, X}from 'lucide-react';
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "motion/react";
import { ArrowUp } from "lucide-react";


export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  const [visibleProjectCount, setVisibleProjectCount] = useState(4);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [activeSection, setActiveSection] = useState("home");

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [selectedProject, setSelectedProject] = useState<{
    id: number;
    title: string;
    category: string;
    software: string;
    image: string;
    description?: string;
  } | null>(null);

  useEffect(() => {
    const navSections = ['home', 'about', 'projects', 'contact'];
    
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Find which section is currently in view based on scroll position
      // Use the top portion of the viewport for detection
      let foundSection = null;
      
      for (let i = navSections.length - 1; i >= 0; i--) {
        const sectionId = navSections[i];
        const section = document.getElementById(sectionId);
        if (section) {
          const sectionTop = section.offsetTop;
          
          // If scroll position has passed this section's top
          if (scrollTop >= sectionTop - windowHeight / 2) {
            foundSection = sectionId;
            break;
          }
        }
      }
      
      // If no section found (at very top) or scroll is near top, default to home
      if (!foundSection || scrollTop < 100) {
        setActiveSection("home");
      } else {
        setActiveSection(foundSection);
      }
    };

    handleScroll(); // Check initial position
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // TIME LOGIC
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      };
      setCurrentTime(now.toLocaleTimeString("en-GB", options) + " WIB");
    };

    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  // SCROLL TO TOP
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // EMAIL FORM LOGIC
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setLoading(true);

    emailjs
      .sendForm(
        "service_vo9n7wa", // Ganti dengan Service ID EmailJS kamu
        "template_o5vlgb6", // Ganti dengan Template ID EmailJS kamu
        formRef.current,
        "pGv__Avyhhq8QNdJ0" // Ganti dengan Public Key EmailJS kamu
      )
      .then(() => {
        alert("✅ Message sent!");
        formRef.current?.reset();
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        alert("❌ Failed to send message");
        setLoading(false);
      });
  };

  const projectsData = [
    {
      id: 1,
      title: "Ads Design",
      category: "Ads Design",
      software: "CorelDraw",
      image: "/BANNER RAMADAN SALE 2.jpg"
    },
    {
      id: 2,
      title: "Ads Design",
      category: "Apparell",
      software: "CorelDraw",
      image: "/BANNER RUGBY AEROSPORT 2.png"
    },
    {
      id: 3,
      title: "Ads Design",
      category: "Ads Design",
      software: "CorelDraw",
      image: "/BANNER KICKSTART BIKIN JERSEY.jpg"
    },
    {
      id: 4,
      title: "Ads Design",
      category: "Ads Design",
      software: "CorelDraw",
      image: "/BANNER OPTIMO.jpg"
    },
    {
      id: 5,
      title: "Ads Design",
      category: "Ads Design",
      software: "CorelDraw",
      image: "/BANNER OPTIMO 2.jpg"
    },
    {
      id: 6,
      title: "Ads Design",
      category: "Ads Design",
      software: "CorelDraw",
      image: "/BANNER JERSEY 8.8.png"
    },
    {
      id: 7,
      title: "Jersey Design",
      category: "Apparell",
      software: "CorelDraw",
      image: "/29 LIVERPOOL HOME.png"
    },
    {
      id: 8,
      title: "Jearsey Design",
      category: "Apparell",
      software: "CorelDraw",
      image: "/188 POSEIDON.png"
    },
    {
      id: 9,
      title: "Jersey Design",
      category: "Apparell",
      software: "CorelDraw",
      image: "/225 MALONE 1.png"
    },
    {
      id: 10,
      title: "Jersey Design",
      category: "Carousel",
      software: "CorelDraw",
      image: "/BATIK KALIMANTAN 1.jpg"
    },
    {
      id: 11,
      title: "Carousel",
      category: "Carousel",
      software: "CorelDraw",
      image: "/GULE MANTAP SIAP SANTAP.png"
    },
    {
      id: 12,
      title: "T-Shirt Design",
      category: "Apparell",
      software: "CorelDraw",
      image: "/K1 MOCKUP.png"
    },
    {
      id: 13,
      title: "Jersey Design",
      category: "Carousel",
      software: "CorelDraw",
      image: "/LUSH VERDE 1.jpg"
    },
    {
      id: 14,
      title: "Carousel",
      category: "Carousel",
      software: "Photoshop",
      image: "/APA KATA MEREKA SLIDE 1.png"
    }
  ];

  // Load more increment
  const LOAD_MORE_COUNT = 4;

  // 3. Logika Filter
  const filteredProjects = activeCategory === "All" 
    ? projectsData.slice(0, visibleProjectCount)
    : projectsData.filter(p => p.category === activeCategory);

  // Check if there are more projects to load (for All category)
  const hasMoreProjects = activeCategory === "All" && visibleProjectCount < projectsData.length;

  // Reset visible count when category changes
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setIsLoadingMore(false);
    if (category === "All") {
      setVisibleProjectCount(4);
    }
  };

  const loadMoreProjects = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleProjectCount(prev => prev + LOAD_MORE_COUNT);
      setIsLoadingMore(false);
    }, 300);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition duration-500 font-sans">

      
{/* NAVBAR */}
<motion.nav 
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
  className={`fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-10 py-6 backdrop-blur-md transition-colors duration-300 ${
    activeSection === "home" 
      ? "bg-black/50 border-b border-neutral-800/50" 
      : "bg-white/90 border-b border-neutral-200"
  }`}
>
  
  {/* LOGO (Tetap di Kiri) */}
  <a href="#" className="group">
    <h1 className={`text-2xl font-bold tracking-tighter group-hover:text-neutral-400 transition ${
      activeSection === "home" ? "text-white" : "text-black"
    }`}>
      Gabriel.
    </h1>
  </a>
  
  {/* CONTAINER KANAN (Menu & Button) */}
  <div className="flex items-center gap-8 md:gap-12">
    
{/* MENU LINKS - DESKTOP */}
<div className="hidden md:flex gap-8 text-[10px] font-bold uppercase tracking-[0.2em]">
  {['home', 'about', 'projects', 'contact'].map((item) => (
    <a
      key={item}
      href={`#${item}`}
      onClick={(e) => {
        if (item === 'home') {
          e.preventDefault();
          scrollToTop();
        }
      }}
      className={`relative transition-all duration-300 pb-1 ${
        activeSection === "home"
          ? item === activeSection ? "text-white" : "text-neutral-500 hover:text-white"
          : item === activeSection ? "text-black" : "text-neutral-500 hover:text-black"
      }`}
    >
      {item}
      
      {/* Garis Bawah Animasi */}
      {activeSection === item && (
        <motion.div
          layoutId="nav-underline"
          className={`absolute bottom-0 left-0 right-0 h-[1px] ${
            activeSection === "home" ? "bg-white" : "bg-black"
          }`}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </a>
  ))}
</div>

          {/* CTA BUTTON - DESKTOP */}
          <motion.a 
            href="#contact" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`hidden md:block px-6 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full transition ${
              activeSection === "home"
                ? "bg-white text-black hover:bg-neutral-200"
                : "bg-black text-white hover:bg-neutral-800"
            }`}
          >
            Let&apos;s Talk
          </motion.a>

          {/* HAMBURGER BUTTON - MOBILE */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 hover:text-neutral-400 transition ${
              activeSection === "home" ? "text-white" : "text-black"
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`fixed top-[72px] left-0 right-0 z-40 backdrop-blur-md border-b md:hidden transition-colors duration-300 ${
            activeSection === "home"
              ? "bg-black/95 border-neutral-800/50"
              : "bg-white/95 border-neutral-200"
          }`}
        >
          <div className="flex flex-col py-6 px-6">
            {['home', 'about', 'projects', 'contact'].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={(e) => {
                  if (item === 'home') {
                    e.preventDefault();
                    scrollToTop();
                  }
                  setIsMobileMenuOpen(false);
                }}
                className={`py-4 text-2xl font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeSection === "home"
                    ? item === activeSection ? "text-white" : "text-neutral-500 hover:text-white"
                    : item === activeSection ? "text-black" : "text-neutral-500 hover:text-black"
                }`}
              >
                {item}
              </a>
            ))}
            <motion.a 
              href="#contact" 
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`mt-6 text-center px-6 py-3 text-sm font-bold uppercase tracking-widest rounded-full transition ${
                activeSection === "home"
                  ? "bg-white text-black hover:bg-neutral-200"
                  : "bg-black text-white hover:bg-neutral-800"
              }`}
            >
              Let&apos;s Talk
            </motion.a>
          </div>
        </motion.div>
      )}

{/* HERO SECTION */}
      <section id="home" className="relative h-screen flex flex-col justify-center items-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 flex justify-center items-center -z-10"
        >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-[300px] h-[300px] md:w-[550px] md:h-[550px] bg-neutral-900 rounded-full overflow-hidden border border-neutral-800 relative"
        >
          <Image 
            src="/profil.jpg"
            alt="Profile"
            fill
            unoptimized
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        </motion.div>
        </motion.div>

        <div className="relative text-center z-10 px-4">
          <motion.h2 
            className="text-6xl md:text-[8rem] font-bold leading-none tracking-tighter mb-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          >
            Visualizing<span className="text-neutral-500"> Ideas </span>
          </motion.h2>
          <motion.h2 
            className="text-6xl md:text-[8rem] font-bold leading-none tracking-tighter mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          >
            Into Reality. 
          </motion.h2>
          <motion.div 
            className="max-w-2xl mx-auto space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
             <motion.p 
               className="text-base md:text-2xl text-neutral-400 font-light tracking-tight"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.6, delay: 1.1 }}
             >
               I build personal portfolio websites that stand out.
             </motion.p>
             <motion.p 
               className="inline-block bg-white text-black px-6 py-2 text-xs font-bold uppercase tracking-[0.3em] rounded-full"
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.5, delay: 1.3 }}
               whileHover={{ scale: 1.05 }}
             >
               Modern & Minimalist.
             </motion.p>
          </motion.div>
        </div>
      </section>


{/* ABOUT SECTION */}
<section id="about" className="relative py-24 md:py-32 px-6 md:px-20 bg-white text-black overflow-hidden">
  
  {/* Dot Pattern Background */}
  <div className="absolute inset-0 z-0 opacity-[0.15]" style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
    backgroundSize: '24px 24px'
  }}></div>

  <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 items-center relative z-10">
    
    {/* KOLOM KIRI: Teks & Info (7 Kolom) */}
    <div className="md:col-span-7 flex flex-col justify-center">
      <motion.h2 
        className="text-black text-6xl md:text-8xl font-bold tracking-tighter mb-4"
        initial={{ opacity: 0, x: -80 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        Who I Am
      </motion.h2>
      
      <motion.div 
        className="mb-10"
        initial={{ opacity: 0, x: -60 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
      >
        <p className="text-2xl md:text-3xl font-medium text-neutral-800 tracking-tight">
          Gabriel Christanto
        </p>
        <motion.div 
          className="w-16 h-1 bg-black mt-2"
          initial={{ width: 0 }}
          whileInView={{ width: 64 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
      </motion.div>

      <motion.p 
        className="text-neutral-700 leading-relaxed text-lg md:text-xl max-w-xl"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        I am a <strong className="font-bold text-black">Graphic Designer & Frontend Developer</strong> based in Jember. I specialize in building modern web interfaces with <strong className="font-bold text-black">Next.js, React,</strong> and <strong className="font-bold text-black">Tailwind CSS</strong>. With a background in visual design, I focus on creating digital solutions that are both functional and aesthetically pleasing.
      </motion.p>

{/* Container Angka & Tombol */}
      <motion.div 
        className="mt-10 flex flex-wrap items-center gap-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <motion.div 
          className="flex flex-col"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <strong className="font-bold text-black leading-none text-[60px]">2+</strong>
          <span className="text-neutral-500 text-sm uppercase tracking-widest mt-1">year exp.</span>
        </motion.div>

        <motion.a 
          href="https://drive.google.com/file/d/1jgyCgH6P8s2wiLPyCF5kbeELK3gACwd0/view" 
          target="_blank" 
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className="group flex items-center gap-4 px-8 py-4 bg-black text-white rounded-full hover:bg-neutral-800 transition-all shadow-lg"
        >
          <div className="flex flex-col items-start">
            <span className="text-sm font-bold tracking-widest">Download CV</span>
          </div>
          <motion.div 
            className="p-2 bg-neutral-800 md:rounded-full group-hover:bg-neutral-700 transition"
            animate={{ rotate: [0, -45, 0] }}
            transition={{ duration: 0.5, repeat: 0 }}
          >
            <ArrowUp className="w-4 h-4 rotate-180" />
          </motion.div>
        </motion.a>
      </motion.div>
    </div>

    {/* KOLOM KANAN: Foto Profil (5 Kolom) */}
    <motion.div 
      className="md:col-span-5 relative aspect-[4/5] bg-neutral-100 rounded-3xl overflow-hidden border border-neutral-200 shadow-2xl"
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
    >
      <Image 
        src="/profil.jpg" 
        alt="Gabriel Christanto Profile" 
        fill
        unoptimized
        className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
      />
    </motion.div>

  </div>
</section>


{/* EXPERIENCE SECTION */}
<section id="experience" className="py-24 md:py-32 px-6 md:px-20 bg-white text-black relative overflow-hidden">
  
  {/* Dot Pattern Background (Sama dengan About agar konsisten) */}
  <div className="absolute inset-0 z-0 opacity-[0.15]" style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
    backgroundSize: '24px 24px'
  }}></div>

  <div className="max-w-7xl mx-auto relative z-10">
    {/* Header Section */}
    <motion.div 
      className="text-center mb-20"
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <motion.span 
        className="text-[10px] uppercase tracking-[0.4em] font-bold text-neutral-400 block mb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Career Path
      </motion.span>
      <motion.h2 
        className="text-6xl md:text-8xl font-black tracking-tighter"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        Experience
      </motion.h2>
    </motion.div>

    {/* Timeline Container */}
    <div className="relative border-l border-neutral-200 ml-4 md:ml-12 pl-8 md:pl-16 space-y-16">
      
      {/* Item Experience 1 */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative"
      >
        {/* Dot on Timeline */}
        <motion.div 
          className="absolute -left-[41px] md:-left-[73px] top-2 w-4 h-4 rounded-full bg-black border-4 border-white shadow-sm z-20"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 }}
        />
        
        <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12">
          {/* Year Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="px-4 py-1.5 bg-black text-white text-[10px] font-bold rounded-full tracking-widest">
              2023 - 2025
            </span>
          </motion.div>

          {/* Content */}
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-2">
              Graphic Designer
            </h3>
            
            <motion.div 
              className="flex items-center gap-2 text-neutral-500 text-sm mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-7h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Aerosport Apparell • Jember, Indonesia</span>
            </motion.div>

            <ul className="space-y-4">
              {[
                "Creating Customer Orders Shopee Marketplace.",
                "Designing Jerseys",
                "Interact with Customers.",
                "Create Shopee and Instagram ads designs."
              ].map((point, idx) => (
                <motion.li 
                  key={idx} 
                  className="flex gap-3 text-neutral-600 leading-relaxed text-sm md:text-base"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 + idx * 0.1 }}
                >
                  <motion.span 
                    className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-2 shrink-0"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.7 + idx * 0.1 }}
                  />
                  {point}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* Anda bisa menambahkan Item Experience berikutnya di sini dengan struktur yang sama */}

    </div>
  </div>
</section>

{/* SKILLS SECTION (Technical Arsenal) */}
<div id="skills" className="py-24 md:py-32 px-6 md:px-20 bg-white text-black relative overflow-hidden">
  
  {/* Dot Pattern Background */}
  <div className="absolute inset-0 z-0 opacity-[0.15]" style={{
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
    backgroundSize: '24px 24px'
  }}></div>

  <div className="max-w-7xl mx-auto relative z-10">
    {/* Header */}
    <motion.div 
      className="text-center mb-20"
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2 
        className="text-6xl md:text-8xl font-black tracking-tighter mb-4"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        Software
      </motion.h2>
      <motion.div 
        className="w-24 h-1 bg-black mx-auto mb-6"
        initial={{ width: 0 }}
        whileInView={{ width: 96 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />
      <motion.p 
        className="text-neutral-500 tracking-widest text-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        My Software Of Choice
      </motion.p>
    </motion.div>

      {/* Mobile & Design Card */}
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7, delay: 0.3 }}
        whileHover={{ y: -10, scale: 1.02 }}
        className="bg-white p-10 rounded-[2.5rem] border border-neutral-100 shadow-xl shadow-neutral-100/50 flex flex-col items-center text-center"
      >
        <motion.h3 
          className="text-xl font-bold mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Tools & Design
        </motion.h3>
        <motion.div 
          className="grid grid-cols-2 gap-6 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {[
            { name: "Figma", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" },
            { name: "Photoshop", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg" },
            { name: "CorelDRAW", src: "/coreldraw_icon_132464.svg" },
            { name: "Illustrator", src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg" }
          ].map((tech, idx) => (
            <motion.div 
              key={tech.name}
              className="w-14 h-14 bg-neutral-50 rounded-2xl flex items-center justify-center p-3 grayscale hover:grayscale-0 transition-all"
              whileHover={{ scale: 1.1, rotate: 5 }}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
            > 
              <Image src={tech.src} alt={tech.name} width={56} height={56} className="object-contain" />
            </motion.div>
          ))}
        </motion.div>
        <motion.p 
          className="text-neutral-400 text-xs font-medium"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          Figma, Photoshop, CorelDraw, Ilustrator
        </motion.p>
      </motion.div>

    </div>
  </div>

{/* PROJECTS SECTION */}
      <section id="projects" className="py-32 px-6 md:px-20 bg-white">
        <div className="flex flex-col justify-between items-start mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-neutral-500 uppercase tracking-[0.3em] text-sm mb-4">03 / Selected Works</h3>
            <h2 className="text-5xl md:text-7xl font-bold text-black font-sans tracking-tighter">Projects.</h2>
          </motion.div>
          <motion.p 
            className="text-neutral-500 ml-auto max-w-xs italic"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Beberapa karya pilihan yang menunjukkan kemampuan teknis dan estetika desain saya.
          </motion.p>
        </div>

        {/* CATEGORY FILTER */}
        <motion.div 
          className="flex flex-wrap gap-2 md:gap-8 mb-12 md:mb-16 pb-4 md:pb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {['All', 'Ads Design', 'Carousel', 'UI UX', 'Apparell'].map((category) => (
            <motion.button 
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`text-xs md:text-sm uppercase tracking-widest font-bold transition-all duration-300 relative group px-2 py-1 ${
                activeCategory === category ? "text-black" : "text-neutral-400 hover:text-black"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
              {/* Garis Bawah Aktif - Responsive */}
              <motion.div 
                className={`absolute -bottom-1 md:-bottom-2 left-0 right-0 md:h-[2px] h-[1px] bg-black ${
                  activeCategory === category ? "w-full" : "w-0 group-hover:w-full"
                } transition-all duration-300`}
              />
            </motion.button>
          ))}
        </motion.div>

<motion.div 
  layout
  className="grid md:grid-cols-2 gap-12"
>
  {filteredProjects.map((project, index) => (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      key={project.id}
      onClick={() => setSelectedProject(project)}
      className="group cursor-pointer relative z-10"
      whileHover={{ y: -10 }}
    >
      <motion.div 
        className="relative aspect-video bg-neutral-900 overflow-hidden mb-6 rounded-2xl"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <Image 
          src={project.image} 
          alt={project.title} 
          fill 
          className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-80" 
        />
      </motion.div>
      <motion.h4 
        className="text-2xl font-bold mb-2 text-black"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {project.title}
      </motion.h4>
      <motion.p 
        className="text-neutral-500 text-sm"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {project.category} • {project.software}
      </motion.p>
    </motion.div>
  ))}
</motion.div>

        {/* Load More Button - Only for All category */}
        {hasMoreProjects && (
          <motion.div 
            className="flex flex-col items-center mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.button
              onClick={loadMoreProjects}
              disabled={isLoadingMore}
              className="group px-10 py-4 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-neutral-800 transition-all shadow-lg flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              whileHover={!isLoadingMore ? { scale: 1.05, y: -3 } : {}}
              whileTap={!isLoadingMore ? { scale: 0.95 } : {}}
            >
              {isLoadingMore ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <span>Load More</span>
                  <span className="text-neutral-400 group-hover:text-white transition-colors">
                    ({projectsData.length - visibleProjectCount} remaining)
                  </span>
                </>
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <motion.div 
            className="text-center py-20 text-neutral-400 tracking-widest uppercase text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Belum ada proyek untuk kategori ini.
          </motion.div>
        )}
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-32 px-6 md:px-20 bg-white dark:bg-black text-white dark:text-white transition-colors duration-500">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Let&apos;s Talk.
            </motion.h2>
            <motion.p 
              className="text-neutral-500 mb-10 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Punya project, ide, atau ingin kerja sama? Hubungi saya melalui platform berikut atau kirim pesan langsung.
            </motion.p>

            <motion.div 
              className="space-y-6 text-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.a 
                href="mailto:gabrielchristanto15@gmail.com" 
                className="flex items-center gap-4 hover:opacity-60 transition group"
                whileHover={{ x: 10 }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 10 }}
                >
                  <Mail className="w-5 h-5 text-black dark:text-white" />
                </motion.div>
                <span className="text-black dark:text-white font-medium">gabrielchristanto15@gmail.com</span>
              </motion.a>

              <motion.a 
                href="https://wa.me/6289659001010" 
                target="_blank" 
                className="flex items-center gap-4 hover:opacity-60 transition group"
                whileHover={{ x: 10 }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: -10 }}
                >
                  <MessageCircle className="w-5 h-5 text-black dark:text-white" />
                </motion.div>
                <span className="text-black dark:text-white font-medium">WhatsApp</span>
              </motion.a>

              <motion.a 
                href="https://www.instagram.com/_gabrielchr/" 
                target="_blank" 
                className="flex items-center gap-4 hover:opacity-60 transition group"
                whileHover={{ x: 10 }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center group-hover:scale-110 transition-transform"
                  whileHover={{ rotate: 10 }}
                >
                  <Camera className="w-5 h-5 text-black dark:text-white" />
                </motion.div>
                <span className="text-black dark:text-white font-medium">Instagram</span>
              </motion.a>
            </motion.div>
          </motion.div>

           {/* RIGHT SIDE - FORM */}
           <motion.form 
            ref={formRef} 
            onSubmit={sendEmail} 
            className="space-y-6 bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm"
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            
            <motion.div 
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Your Name</label>
                <motion.input 
                  name="user_name"
                  type="text" 
                  required
                  className="w-full mt-2 p-3 bg-transparent border-b border-neutral-300 dark:border-neutral-700 focus:outline-none focus:border-black dark:focus:border-white transition"
                  whileFocus={{ scale: 1.02, borderColor: "#000" }}
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Your Email</label>
                <motion.input 
                  name="user_email"
                  type="email" 
                  required
                  className="w-full mt-2 p-3 bg-transparent border-b border-neutral-300 dark:border-neutral-700 focus:outline-none focus:border-black dark:focus:border-white transition"
                  whileFocus={{ scale: 1.02, borderColor: "#000" }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Subject</label>
              <motion.input 
                name="subject"
                type="text" 
                required
                className="w-full mt-2 p-3 bg-transparent border-b border-neutral-300 dark:border-neutral-700 focus:outline-none focus:border-black dark:focus:border-white transition"
                whileFocus={{ scale: 1.02, borderColor: "#000" }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <label className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">Your Message</label>
              <motion.textarea 
                name="message"
                rows={4}
                required
                className="w-full mt-2 p-3 bg-transparent border-b border-neutral-300 dark:border-neutral-700 focus:outline-none focus:border-black dark:focus:border-white transition resize-none"
                whileFocus={{ scale: 1.02, borderColor: "#000" }}
              />
            </motion.div>

            <motion.button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition uppercase tracking-widest text-xs font-bold rounded-xl disabled:opacity-50"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {loading ? "Sending..." : "Send Message"}
            </motion.button>
          </motion.form>

        </div>
      </section>


      {/* FOOTER */}
      <footer className="relative bg-black text-white pt-24 pb-12 px-6 md:px-12 lg:px-24 overflow-hidden">
        {/* Background Large Text */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          initial={{ opacity: 0, scale: 1.1 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          <span className="text-[25vw] font-bold text-neutral-900/40 leading-none tracking-tighter uppercase">
            GABRIEL
          </span>
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Availability Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm mb-12"
          >
            <motion.span 
              className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-xs font-medium text-green-500 titlecase tracking-wider">
              Available For New Projects
            </span>
          </motion.div>

          {/* Footer Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
            {/* Left Column: Heading */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter">
                {"Let's make ".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.02 }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
                <br />
                {"something ".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 + i * 0.02 }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
                <br />
                {"amazing ".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.9 + i * 0.02 }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
                <br />
                {"together.".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 1.2 + i * 0.02 }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </h2>
            </motion.div>

            {/* Right Column: Links */}
            <motion.div
              className="flex flex-col items-end justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }} 
            >
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 mb-6">Menu</h3>
              <ul className="space-y-4">
                {['home', 'about', 'projects', 'contact'].map((item, index) => (
                  <motion.li 
                    key={item}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  >
                    <motion.a 
                      href={item === 'home' ? '#' : `#${item}`} 
                      onClick={(e) => {
                        if (item === 'home') {
                          e.preventDefault();
                          scrollToTop();
                        }
                      }}
                      className="text-xl md:text-2xl font-medium hover:text-neutral-400 transition-colors duration-300 block capitalize"
                      whileHover={{ x: -10 }}
                    >
                      {item}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </footer>

      {/* BOTTOM FOOTER */}
      <motion.footer 
        className="bg-black text-white py-12 px-6 md:px-20 border-t border-neutral-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-4xl font-bold tracking-tighter">Gabriel.</h2>
            <p className="text-neutral-500 max-w-xs">
              Crafting digital experiences with precision and passion.
            </p>
            <motion.div 
              className="flex items-center gap-6 text-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-2">
                <motion.span 
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-neutral-400">Jember, Indonesia</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neutral-600" />
                <span className="text-neutral-400">{currentTime}</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.button 
            onClick={scrollToTop}
            className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-300 group cursor-pointer ${
              activeSection === "home"
                ? "border-neutral-800 hover:bg-white hover:text-black"
                : "border-neutral-200 hover:bg-black hover:text-white"
            }`}
            whileHover={{ scale: 1.1, rotate: 360 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, rotate: -180 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
          >
            <ArrowUp className={`w-6 h-6 group-hover:-translate-y-1 transition-transform ${
              activeSection === "home" ? "" : "text-black group-hover:text-white"
            }`} />
          </motion.button>
        </div>
        <motion.div 
          className="max-w-7xl mx-auto mt-12 pt-8 border-t border-neutral-900/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <p className="text-xs text-neutral-600">
            © 2026 Gabriel Christanto. All rights reserved.
          </p>
        </motion.div>
      </motion.footer>
      
{/* MODAL LIGHTBOX */}
{selectedProject && (
  <motion.div 
    className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-6 md:px-6 md:py-10 bg-black/90 backdrop-blur-xl"
    onClick={() => setSelectedProject(null)}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 50 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 25 }}
      className="relative max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Tombol Close Pojok Kanan */}
      <motion.button 
        onClick={() => setSelectedProject(null)}
        className="absolute top-4 right-4 z-[110] p-2 bg-black/20 hover:bg-black/50 text-white rounded-full transition-all backdrop-blur-md"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </motion.button>

      <div className="flex flex-col">
        {/* Bagian Gambar */}
        <motion.div 
          className="relative w-full bg-neutral-100 flex items-center justify-center p-4 md:p-8 min-h-[300px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div 
            className="relative w-full h-full min-h-[300px] md:min-h-[450px] aspect-video"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Image 
              src={selectedProject.image} 
              alt={selectedProject.title} 
              fill 
              className="object-contain"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Bagian Teks */}
        <motion.div 
          className="p-8 md:p-12 bg-white text-black border-t border-neutral-100"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.span 
            className="text-xs font-bold uppercase tracking-[0.3em] text-neutral-400 mb-4 block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            Project Detail
          </motion.span>
          <motion.h3 
            className="text-3xl md:text-5xl font-bold mb-8 tracking-tighter"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {selectedProject?.title}
          </motion.h3>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2">Category</h4>
              <p className="text-lg font-medium">{selectedProject?.category}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.9 }}
            >
              <h4 className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2">Software Used</h4>
              <p className="text-lg font-medium">{selectedProject?.software || 'Photoshop'}</p>
            </motion.div>
            <motion.div 
              className="md:col-span-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.0 }}
              >
            </motion.div>
          </motion.div>

          <motion.button 
            onClick={() => setSelectedProject(null)}
            className="mt-12 w-full py-4 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            Close Project
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  </motion.div>
)}
</main>
  );
}
