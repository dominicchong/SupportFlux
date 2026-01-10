import { Zap, ArrowDown } from "lucide-react"
import HomeCards from "../components/HomeCards";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-foreground pt-5">
      {/* 1. COMPACT HERO SECTION */}
      <section className="relative min-h-[60vh] flex items-center justify-center text-white text-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(15, 23, 42, 0.8)), url('/hero-banner.jpg')`
          }}
        />
        <div className="z-10 max-w-6xl animate-in fade-in slide-in-from-top-4 duration-1000 backdrop-blur-[2px]">
          <h1 className="text-2xl md:text-4xl font-extrabold mb-6 tracking-tight">
            Fast Track Your
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent pl-3">
              Student Support
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get instant answers to your campus questions, anytime you need them.
            Empowering your academic journey in Universiti Malaya.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => document.getElementById('resolution-path')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Subtle scroll indicator to bridge the gap */}
        <div className="absolute bottom-16 text-white/50 animate-bounce">
          <ArrowDown className="size-6" />
        </div>
      </section>

      {/* */}
      <section className="relative z-10 px-6 -mt-10">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-4 md:p-4 text-center">
          <div className="inline-flex items-center gap-2 bg-purple-50 px-4 py-1.5 rounded-full text-purple-600 text-xs font-black uppercase tracking-widest mt-4 mb-6">
            <Zap className="size-4 fill-purple-600" />Resolution Path
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            One query. Three ways to resolve.
          </h2>

          <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg">
            Don't let an issue stall your study session. Whether you need an
            instant answer from our smart bot, a quick guide from the library, or
            a real-time chat with our faculty staff, we’ve got you covered.
          </p>

          <div id="resolution-path" className="text-center mt-16 mb-4">
            <h3 className="text-2xl font-bold text-gray-800">Your Path to Resolution</h3>
            <p className="text-gray-500">We recommend following these steps for the quickest assistance.</p>
          </div>

          {/* ACTION CARDS */}
          <HomeCards />
        </div>
      </section>

      <div className="py-12 text-center text-gray-500 text-sm">
        <p>© 2026 SupportFlux</p>
        <span>Faculty of Computer Science & Information Technology, Universiti Malaya</span>
      </div>
    </div>
  );
};

export default HomePage;