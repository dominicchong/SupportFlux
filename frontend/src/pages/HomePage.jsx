import HomeCards from "../components/HomeCards";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Banner with Background Image */}
      <section
        className="relative text-white py-28 px-6 flex flex-col items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url('/hero-banner.jpg')`, }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Welcome to 
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent pl-2">
            SupportFlux
          </span>
        </h1>
        
        <p className="text-md md:text-xl max-w-4xl drop-shadow">
          Get quick support from our chatbot, live chat with faculty staff, or browse helpful resources.
        </p>
      </section>

      <HomeCards/>
    </div>
  );
};

export default HomePage;
