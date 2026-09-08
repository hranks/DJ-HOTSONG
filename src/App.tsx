import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import ShaderBackground from "./components/ShaderBackground";
import AudioPlayer from "./components/AudioPlayer";
import GalleryModal from "./components/GalleryModal";
import BookingForm from "./components/BookingForm";

function ParallaxSection({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Slow parallax vertical translation of the background overlay
  const bgY = useTransform(scrollYProgress, [0, 1], [-70, 70]);

  return (
    <section ref={ref} className={`relative overflow-hidden ${className}`} id={id}>
      {/* Parallax background overlay moving independently */}
      <motion.div 
        style={{ y: bgY }} 
        className="absolute inset-0 pointer-events-none z-0 opacity-40"
      >
        <div className="absolute top-[15%] left-[5%] w-[45vw] h-[45vw] rounded-full bg-primary/5 filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[15%] right-[5%] w-[45vw] h-[45vw] rounded-full bg-secondary-container/5 filter blur-[100px] pointer-events-none" />
      </motion.div>
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </section>
  );
}

function SlowFadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1, margin: "-50px" }}
      transition={{
        duration: 1.4, // Slow premium fade
        delay,
        ease: [0.16, 1, 0.3, 1], // Luxury smooth bezier curve
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Define the gallery images list using the original high-res hosted URLs from Google Stitch
// Define the gallery images list using the original high-res hosted URLs from Google Stitch
const GALLERY_IMAGES = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuApmOMF-w9ifrERSBCJYy3R6sRfaMYURf5sNNJ7yFAgkGdFYjRfRjIElsZq5zYSXo8Jl0qTXZOGW4MTPaMzvwSE17RaS1RtNk3ZuveLF1FWEAe4hb6OzOQI2ufyuD4fmDkgp9ZuxUjyx5XWa7jxZnfhnHkv-IsC7a1ymLjdXWtybpPeKgjiEnm_4pYB8XI8x6Wd7Y37jrPP1tEPkCv0o_biHeL78Z2H4a_u8YPCZ3nwiblKUmnHEpe4tLVuJB4ycDgOoLQ",
    alt: "High-Energy Crowd Response",
    spanClass: "col-span-2 row-span-2",
    category: "gigs",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCqCkpGx_c8VH1TZZJAIii9LL2z__uYvr19fE7q7l0oeM69XNRs4R2vmlHCLLX6iRCojDXyz0RpLElAKeyJ0XIf7Q0HkbGuV_HoCzZYAIU7Q9RyYXSV1LKrToPsIzDNCnkVigwBVzG502BqBhLsveTIaPK5pl7xHhjscIFNQyPZulq4_FyRGr-j7h7t4KdwvBpLXXv0JV9ssxb6YgL9jfrX2iidmuYa0PdX2l6t8-HjsHtGdZWavUmDm7x9RVp668b-5TU",
    alt: "Professional Deck Control Detail",
    spanClass: "col-span-1 row-span-1",
    category: "gear",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWlDmi_WupAyZw4lO9RZ2UzTFUR0K4-ijZXJI8f-OjQ_-8ZZszFmdqnBejcLR7p2CYWiMDCIHLJGw0aZcoi-aHOouDFwalALgrVYNf7ymeBNsslneA_D9Uu4N0EuCGvGjMYj0kVOWmFZeBxeesL-yowwOza319mfS38ggky78p1PRFmHrBwAbDaHDrnvW29stoFQSuqCyUhI7fmmnYxNxixYL6YqjxGAJQd0MNk49m3E5ae91EPBNT0g4l2KsdALk0zfk",
    alt: "Emilio Live Performance",
    spanClass: "col-span-1 row-span-2",
    category: "portraits",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-zYvtF4BzPhsyUkqbuR0A1ngMEyL6Yq7wgHw00ovWESEJdx0kq36Wh2ZkkdaW_fBjVmX-0NjzwESHcZt0hdtD96Zu3Y4-zRkWafFPSHlQUY_Z9FfobEi3JIHKKCAcKDyE-yqTDu7IPdZ8WrhV-woaxZrrfiQ--ZW4iMTlEF_Tk-5bfA1wVrK8SyxfypusJz4dPWSWf33vBJP4dKh_qfBzgp4QrZOE1m9ls-8fSXwE04VRzQEPg8J1gUirfvzrT8oeKd8",
    alt: "Immersive Club Lighting Setup",
    spanClass: "col-span-1 row-span-1",
    category: "gigs",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6WXzg-hyD7tapyYNpLssBxylTRQgbUqSJt_Oole07lLqxgzN5AP0KKCeiqocNsk6ZfA-leoRnLgvNbRTWtYoE2OyXoNaV8bqjZKFYXtxSzBICdaQIdUVtcrzp4hFZqvrfltu_Gl43BIatCkXCVWHexj1e4GeRuKu4I_t26egNwZORENZqAOdl0JX8dBhUuFI7yKDUA-_2Ht48FeXh18cMiYMUjH9M9MHrKKNOE4-ApYiELSbJpp4I6pS7xlvQjI1qziE",
    alt: "Irish Clubbers Jamming",
    spanClass: "col-span-1 row-span-1",
    category: "gigs",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDBM24X_6yhHFqsF66QlF9i_p2rBdd8e8aOPqirnNq1HUzp_yWajeyBMXXc52AMyTeZ15ynfJqVtmVtA-YeYIw13owxCnC2PK3Gvl-U8Xfif0GdpaN_FhBOECqHtHTtoW4PZRbniH3HsNUI0KkLf3TbJuyZ8eN1hJXRkMH1k8rCc8QRq52nedNseBQlqlUjbUZWfzSyV71fyVW4AB_UZs3hP_WDpi_SadD5uibzNYvHQNTOckwJdWtCuFWvJpIeLnhkt-Y",
    alt: "Wide Shot Main Stage",
    spanClass: "col-span-2 row-span-1",
    category: "gigs",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB_C_q7U9XtDx58jWhbnf4iYB0chi55C8HH8dKrUWEEq4CBw5hn9LlufdTUGk_jhFIf7hUhjFg2FXoG0KeCslQevJCPykD9rXU4Vk5qrz3Zsh6ubP7GvqO5amVCVN-E-GcyRaRyZ4ZhwSNcJa7tdwIlgEPZCDVkKnEeZ-pzSemelXDcY58ZGZ5YHJt2Mueo_Jp4fLEzu1sIdZEMLW7w4kGMIwbXtukCWD9foh50J96xSjoytfbuABovp0WtSqtvM_gkyI0",
    alt: "DJ Headphones Closeup",
    spanClass: "col-span-1 row-span-1",
    category: "gear",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBHv1qxi1B4vQYeTEwafamii5s6b2ZF7ejm16vMpW-UGFv33iJ3gZcasj8sPYckOT6MAfHdmMiaj4vvhmyTh2ZJD2nGEphbv51FOY_FzPx2dtitRqXTaCPeIfXrVJuSOze7HP6IZO79ajKFYOEGCIowIW4hOv6ud2wwbnb48wOxXfBTQqGG_HMpCunHFkYrRn7I_myGAJoDkPnrSsCtnbYoHzSYkC_i8cNujQOQDyFFeOKX3DkOWT3hq3slRm6_wHcJ2Pc",
    alt: "Mix Transitions Live Feedback",
    spanClass: "col-span-1 row-span-1 hidden md:block",
    category: "gear",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCt6h2PzOUZPDo7PKyg85LCPHOqpQECV_I8oivcaezy6K4Kn6OMkZZ2SMrVf_hWDw32L0nSwtGkAsyP55OA3-9yiPoiUMVGvUsGs4RANAd_mYjc7Y81PyC7ufFyNWbDEGQo8RtY7di96H7IpgCs1jYTkwsmaU72pwfOX3C_td-KosWoGvmn25LLPrcMHUl9wFvejqMN4fTAJQOiW_0j2uVAO5K9-BhqzLUVBjjTK1FBgSI1mo_DXIcaQ_vk6asbVpvw9pM",
    alt: "Emilio Studio Portrait",
    spanClass: "col-span-1 row-span-1 hidden md:block",
    category: "portraits",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuChd7c4gL42lGwni_CKNGOixug9Uzy7blP8cDkEMEN0QteEQR1KhtQD1_JvvvLTcJh8JM7t-7rZNPUnseLq1bzANhnMjNUAu7Ai9phF5atQ-n-lejPwf9TjkHAbb1TbhCtyaHg0gcYFKrsqzZyre0Z2Ojyq-UaftcRoOSsgc3Wk9fQ0aa7vpwXTlx4PwxrROzM4x2eS5uR9aj07vvdOLxSIl0G2Z0ewDlCP0hB21Z8SD4UF5g_BFIPwOl8xZoQ91Ek3HvI",
    alt: "Nicaraguan DJ Silhouette",
    spanClass: "col-span-1 row-span-1 hidden md:block",
    category: "portraits",
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuATr2ngpHlimYdgWY5vwpFgRnLgpOxy6I-k5IUVtJFH2Ge3U-k5bmEVgZPXI3eFzKv2r6Y3Uu0RP6kUljwA6xsh4NgBLPiTx4dlcrZze7z3Vm-ubP4nlEYpbEvIQDQMOr6GgZE0OXjS1ie4t522EyovmaI16ItUxZvCDUMrvGH_stTwhckQFHVb0qlnPURSJYogNSlIemowBHDLy4hkpUGaXHm3WFmPLbTV7XKL65X7VnHfeXfqEXi4S3n9iZXTQ_VPMZI",
    alt: "Mainstage Hands Up Energy",
    spanClass: "col-span-1 row-span-1 hidden md:block",
    category: "gigs",
  },
];

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Parallax mouse variables for hero profile image
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // Filtered images list based on selected category option
  const filteredImages = selectedCategory === "all"
    ? GALLERY_IMAGES
    : GALLERY_IMAGES.filter((img) => img.category === selectedCategory);

  // Handle scrolling effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Simple active link tracker on scroll
      const sections = ["about", "music", "gallery", "booking"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle parallax hover movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      setParallax({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNextImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
  };

  const handlePrevImage = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <div className="bg-background text-on-surface font-body-md overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      {/* Top Navigation Bar */}
      <nav
        id="top-nav-bar"
        className={`fixed top-0 w-full z-50 border-b transition-all duration-300 ${
          scrolled
            ? "bg-background/90 shadow-lg border-white/10 backdrop-blur-md py-4"
            : "bg-transparent border-transparent py-6"
        }`}
      >
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop py-1 max-w-7xl mx-auto w-full">
          <a href="#hero" className="flex items-center gap-2 cursor-pointer">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqvdlmZ0-BZxJuVO0MlRKpYLNVzVJAhkyRwW24wkp9EfjgwF-J-GVoZKbuQ_b65b2KmL6YhXNAa3LzqN1Gp9ZCJ1VkMXCzQ0ZKT2MvfWLKs7CKDtR4drtNilOMOdOk1XFPXSXcxxeRngHqxdH5VGKClJtVhjZ4ZOIlAgEkANrS_EmjzRAkgDykb20LDirVZjo3xhX4BzwoYgwGBmuKtSaH6JjOfrSBiPncXDdXaJ5NKWTq9muRH6hPbnuV0SfNrdHX26s"
              alt="DJ HOTSONG Logo"
              referrerPolicy="no-referrer"
              className="h-10 md:h-12 object-contain filter invert brightness-200"
            />
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex gap-gutter items-center">
            {["about", "music", "gallery"].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className={`text-body-md font-medium transition-all duration-200 uppercase tracking-widest text-[13px] ${
                  activeSection === section
                    ? "text-primary border-b-2 border-primary pb-1 font-bold"
                    : "text-on-surface-variant hover:text-primary hover:scale-105"
                }`}
              >
                {section}
              </a>
            ))}
          </div>

          <a
            className="hidden md:inline-flex bg-primary text-on-primary px-6 py-3 rounded-full font-label-sm text-label-sm uppercase tracking-widest hover:scale-105 transition-transform duration-200 glow-primary font-bold"
            href="#booking"
          >
            Book Now
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-primary focus:outline-none flex items-center justify-center p-2 rounded-full hover:bg-white/5 cursor-pointer z-50"
            id="mobile-menu-btn"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[32px]">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/95 backdrop-blur-xl z-40 flex flex-col justify-center items-center gap-stack-lg"
          >
            {["about", "music", "gallery"].map((section) => (
              <a
                key={section}
                href={`#${section}`}
                onClick={closeMenu}
                className="font-display-lg text-4xl text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest"
              >
                {section}
              </a>
            ))}
            <a
              onClick={closeMenu}
              className="mt-8 bg-primary text-on-primary px-8 py-4 rounded-full font-label-sm text-label-sm uppercase tracking-widest glow-primary font-bold"
              href="#booking"
            >
              Book Now
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Section 1: Hero */}
        <section
          className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden"
          id="hero"
        >
          {/* WebGL Animated Background Shader */}
          <div className="absolute inset-0 w-full h-full opacity-60 z-0">
            <ShaderBackground />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-12 gap-gutter items-center py-12">
            <div className="md:col-span-7 flex flex-col gap-stack-md">
              <SlowFadeIn delay={0.1}>
                <h1 className="font-display-lg text-5xl md:text-7xl lg:text-8xl text-primary uppercase tracking-tighter leading-none font-extrabold">
                  Latino Vibes <br />
                  <span className="text-on-surface">DJ</span>
                </h1>
              </SlowFadeIn>
              <SlowFadeIn delay={0.3}>
                <p className="font-body-lg text-lg md:text-xl text-on-surface-variant max-w-xl leading-relaxed">
                  Just pure rhythm, smooth mixes, and high-energy vibes to keep everyone dancing all night.
                </p>
              </SlowFadeIn>
              <SlowFadeIn delay={0.5} className="flex flex-wrap gap-4 pt-4">
                <a
                  className="bg-primary-container text-on-primary-container px-8 py-4 rounded-full font-label-sm text-sm uppercase tracking-widest hover:scale-105 transition-transform duration-200 glow-primary inline-flex items-center gap-2 font-bold"
                  href="#booking"
                >
                  Book Now{" "}
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </SlowFadeIn>
            </div>

            {/* Parallax Hero Image Container */}
            <SlowFadeIn delay={0.4} className="md:col-span-5 relative mt-stack-lg md:mt-0">
              <div
                style={{
                  transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0) rotateX(${-parallax.y / 2}deg) rotateY(${parallax.x / 2}deg)`,
                  transition: "transform 0.1s ease-out",
                }}
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[2/3] image-hover glow-primary">
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6UyZMrL490q-4zRy--_NADt_9MRegFuVCVkLD2gJ_SxAH5TQXCDiWafbP8d8UG97Ge19sOlk4jtZU1GM7-WWEHEGyGEcEvdcUFlcNxSrRkfatesmKonqbiCQNKCnX6509USEiTOZ57en_7Y9vRjAIS76F1Jqv4EtmyicwyYBZ3kr_Rv4Rayy0BuNpJze9duM6gnJY5OyuVYE7eC3uBDE9-eaxhvD3Nm-IQFDcfRlhGuUuooY34ZJ3ZPsKDGoLfuw-dVQ"
                    alt="Emilio Performing Live on Stage"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none"
                  />
                </div>
                {/* Decorative Blur Orb */}
                <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-primary rounded-full filter blur-[100px] opacity-20 z-0 pointer-events-none" />
              </div>
            </SlowFadeIn>
          </div>
        </section>

        {/* Section 2: Bio */}
        <ParallaxSection className="py-28 bg-surface-container-lowest" id="about">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center">
              <SlowFadeIn className="grid grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden aspect-[2/3] image-hover border border-white/5">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCq_p-7tSmxeQ_2SZIDT2AfKytmb6nPN6RNO1DnP9X0Z4tnry_j7cNgQpHRkSFPyEIiBOq28-9TywokU3476AWKr2532pXP8LtC75y_bwvJBTllxifSZ2jsDipSWFfLGs3MeynM0WFiBc2aegNxietoeuaS_-8ACK6cySLbUG-Za-F--fY0MZu9NJrbW6tqotrYV9tjmHpVw9gH5-RUuQ2F5hL4lwNNjWOxdqzietE3jZnaRqkKJ0ZM97ixM7vI0AyG_A8"
                    alt="Emilio Closeup Portrait"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 select-none"
                  />
                </div>
                <div className="rounded-xl overflow-hidden aspect-[2/3] mt-12 image-hover border border-white/5">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOgppKzzxgLzNcBHqAGcyx61fqeUCA57h426muCvUVXijQvzjuM6qrhv5L0t7PlhyXXYfc8ZpTC5EfV-FEZVFYk3kXumqxbRUCfoM4urK0KfPPPe5kPM7kw-4-KLQpCTY6L_qZO_Sap3WF0OwRIkjjfqiQqHnNwF1jSD5-RErgpsDVhJSx9rLMfjej2B-avR4vaeNCjs7SWe8CzY0q_a7nB3Tcx8z7_P_j0PbfwQPgNbufrJnZgwbw1uISS_-wkIsWBZM"
                    alt="Emilio DJ Deck Mix Action"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 select-none"
                  />
                </div>
              </SlowFadeIn>

              <SlowFadeIn className="flex flex-col gap-stack-md" delay={0.2}>
                <h2 className="font-headline-lg text-3xl md:text-5xl text-on-surface font-extrabold">
                  Meet Hotsong: <br />
                  <span className="text-primary">Professional Latin DJ</span>
                </h2>
                <p className="font-body-lg text-lg text-on-surface-variant leading-relaxed">
                  Are you planning your next event and want to exceed expectations with excellent music to make it truly unforgettable?
                </p>
                <p className="font-body-md text-base text-on-surface-variant/80 leading-relaxed">
                  My name is <strong>Emilio</strong>, well known as <strong>DJ Hotsong</strong>. With over 6 years of experience as an open-format professional DJ, my signature sound blends the best of <strong>New and Old School Reggaeton, Tropical sounds, Moombathon, Dancehall, Caribbean mixes, and all House variants</strong>.
                </p>
                <p className="font-body-md text-base text-on-surface-variant/80 leading-relaxed">
                  I am renowned for my smooth and spicy transitions between tracks, keeping the crowd vibing, moving, and dancing all night long. My career began in my home country, Nicaragua, and has expanded across the Irish and UK territories, serving <strong>Dublin, Belfast, Cork, Galway, and Limerick</strong>.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {["Dublin", "Belfast", "Cork", "Galway", "Limerick", "Nicaragua", "Reggaeton", "Moombathon", "Dancehall", "House Music"].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-full border border-white/10 font-label-sm text-xs font-semibold text-on-surface-variant bg-surface-container select-none"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </SlowFadeIn>
            </div>
          </div>
        </ParallaxSection>

        {/* Section 3: Mixes & Sounds */}
        <ParallaxSection className="py-28" id="music">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
            <SlowFadeIn className="text-center mb-16">
              <h2 className="font-headline-lg text-3xl md:text-5xl text-on-surface font-extrabold">
                Check <span className="text-primary">Some Mixes</span>
              </h2>
            </SlowFadeIn>

            {/* Interactive Custom Web Audio Player Component */}
            <SlowFadeIn delay={0.2}>
              <AudioPlayer />
            </SlowFadeIn>

            {/* Genres Badges */}
            <SlowFadeIn delay={0.4} className="flex flex-wrap justify-center gap-3 mt-8">
              {["Reggaeton", "Tropical", "Moombathon", "Dancehall", "House"].map((genre) => (
                <span
                  key={genre}
                  className="px-6 py-3 rounded-full border border-white/25 font-label-sm text-xs text-on-surface uppercase tracking-widest hover:border-primary hover:text-primary hover:scale-110 transition-all duration-300 cursor-default select-none font-bold"
                >
                  {genre}
                </span>
              ))}
            </SlowFadeIn>
          </div>
        </ParallaxSection>

        {/* Section 4: Gallery (Masonry Bento Grid with Filters) */}
        <ParallaxSection className="py-28 bg-surface-container-lowest" id="gallery">
          <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
            <SlowFadeIn className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
              <div>
                <span className="text-xs text-primary font-mono tracking-widest uppercase block mb-2">// DIARY</span>
                <h2 className="font-headline-lg text-3xl md:text-5xl text-on-surface font-extrabold">
                  Photo <span className="text-primary">Dump</span>
                </h2>
              </div>
              <span className="text-xs text-on-surface-variant/60 font-mono hidden sm:inline-block">
                • CLICK IMAGE TO ZOOM •
              </span>
            </SlowFadeIn>

            {/* Gallery Category Filter Choice Tabs */}
            <SlowFadeIn delay={0.1} className="flex flex-wrap gap-2.5 mb-10 justify-start">
              {[
                { id: "all", label: "Show All", count: GALLERY_IMAGES.length },
                { id: "gigs", label: "Live Gigs", count: GALLERY_IMAGES.filter(img => img.category === "gigs").length },
                { id: "gear", label: "DJ Life & Gear", count: GALLERY_IMAGES.filter(img => img.category === "gear").length },
                { id: "portraits", label: "Portraits", count: GALLERY_IMAGES.filter(img => img.category === "portraits").length }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setLightboxIndex(null); // Reset lightbox index to prevent mismatch
                  }}
                  className={`px-5 py-2.5 rounded-full font-label-sm text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                    selectedCategory === cat.id
                      ? "bg-primary text-on-primary shadow-lg scale-105"
                      : "bg-surface-container border border-white/10 text-on-surface-variant hover:text-primary hover:border-primary/50"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedCategory === cat.id
                      ? "bg-white/20 text-white"
                      : "bg-white/10 text-on-surface-variant/70"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </SlowFadeIn>

            {/* Bento / Masonry Hybrid Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
              <AnimatePresence mode="popLayout">
                {filteredImages.map((img, i) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    key={img.src}
                    onClick={() => setLightboxIndex(i)}
                    className={`${img.spanClass} rounded-xl overflow-hidden image-hover relative group cursor-pointer border border-white/5 shadow-inner`}
                  >
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-white text-3xl">zoom_in</span>
                      <span className="text-[10px] text-white/80 font-mono tracking-wider px-2 text-center">
                        {img.alt}
                      </span>
                    </div>
                    <img
                      src={img.src}
                      alt={img.alt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover select-none"
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </ParallaxSection>

        {/* Section 5: Booking Form */}
        <ParallaxSection className="py-28" id="booking">
          <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop">
            <SlowFadeIn>
              <BookingForm />
            </SlowFadeIn>
          </div>
        </ParallaxSection>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 bg-surface-container-lowest flex flex-col items-center justify-center gap-8 border-t border-white/5">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfRnOvuLAgigmNrAb6JcInvBkkJeYqcyoYy2Tm6vLnW9lgSXQ0l41goGTi2Et_3nDcs0TiLNSunswFLIZsf0w8xkEuFF0GLrkp7WmUV1uuBI64uXgvT-OJu0E_7rjATP2LjsYwe8n7ldf7ilCbQXb73sAhFDG9KS1NeqS0xmNcPnS7gXFUU9sDoCx2sGerDiCMSONUyLudjEgfDXEu-OcfaAyslvPYHQrsO--Lfziwi2CA9-moeSp9ey3Q9QB2DdqLS8Q"
          alt="DJ HOTSONG Footer Logo"
          referrerPolicy="no-referrer"
          className="h-10 md:h-12 object-contain filter invert brightness-200"
        />

        <div className="flex gap-6 flex-wrap justify-center">
          <a
            className="font-label-sm text-xs text-on-surface-variant hover:text-secondary-container transition-colors opacity-80 hover:opacity-100 uppercase tracking-widest font-bold"
            href="https://www.instagram.com/ehotsong?igsh=YTV5YnJlaDl6ejE2&igsi=YTV5YnJlaDl6ejE2&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
          <a
            className="font-label-sm text-xs text-on-surface-variant hover:text-secondary-container transition-colors opacity-80 hover:opacity-100 uppercase tracking-widest font-bold"
            href="https://m.youtube.com/watch?v=P1xBohYyMpU&ra=m"
            target="_blank"
            rel="noopener noreferrer"
          >
            YouTube
          </a>
          <a
            className="font-label-sm text-xs text-on-surface-variant hover:text-secondary-container transition-colors opacity-80 hover:opacity-100 uppercase tracking-widest font-bold"
            href="https://podcasts.apple.com/ni/podcast/adn-radio-nicaragua/id1453976591?i=1000578476205"
            target="_blank"
            rel="noopener noreferrer"
          >
            Podcasts
          </a>
          <a
            className="font-label-sm text-xs text-on-surface-variant hover:text-secondary-container transition-colors opacity-80 hover:opacity-100 uppercase tracking-widest font-bold"
            href="#"
          >
            Privacy Policy
          </a>
        </div>

        <div className="font-label-sm text-xs text-secondary-fixed-dim uppercase tracking-widest font-mono text-center px-4">
          © {new Date().getFullYear()} DJ HOTSONG. ALL RIGHTS RESERVED. Nicaragua • Ireland
        </div>
      </footer>

      {/* Full screen high-fidelity lightbox modal */}
      <GalleryModal
        images={filteredImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />
    </div>
  );
}
