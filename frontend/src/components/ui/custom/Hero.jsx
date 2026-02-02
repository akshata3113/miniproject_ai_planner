import React from "react";
import { Button } from "../button";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/create-trip"); // 🔥 Redirect directly to generate-trip
  };

  return (
    <>
      {/* =============== HERO ================= */}
      <section className="max-w-4xl mx-auto mt-16 px-6 text-center">
        <h1 className="font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-4">
          <span className="text-[#f56551]">
            Discover Your Next Adventure with AI:
          </span>
          <br />
          Personalized Itineraries at Your Fingertips
        </h1>

        <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6">
          Your personal trip planner and travel curator, creating custom itineraries tailored to your
          interests and budget.
        </p>

        <Button size="lg" onClick={handleGetStarted}>
          Get Started, It's Free
        </Button>
      </section>

      {/* =============== SERVICES ================= */}
      <section className="max-w-7xl mx-auto mt-20 px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          What We Offer
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { img: "/ai.png", title: "AI Trip Planner", desc: "Plan trips tailored to your preferences using AI." },
            { img: "/budget.png", title: "Smart Budgeting", desc: "Optimize spending and get travel cost suggestions." },
            { img: "/iti.png", title: "Custom Itineraries", desc: "Get day-by-day schedules crafted intelligently." },
            { img: "/hotels.png", title: "Hotel & Destination", desc: "Discover stays, landmarks & must-visit places." },
          ].map((item, i) => (
            <div
              key={i}
              className="
                bg-gradient-to-br from-[#ffe8d6] to-[#fff5ec]
                p-6 rounded-2xl border shadow-md h-72 flex flex-col items-center justify-center
                hover:shadow-xl hover:scale-[1.03] transition duration-300"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-45 h-45 mb-4 object-contain"
              />
              <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.title}</h3>
              <p className="text-gray-700 text-sm text-center">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =============== TRAVEL VIDEOS ================= */}
      <section className="py-20 bg-[#fff7ec] mt-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Travel Stories From Our Explorers
        </h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
          {[
            "https://www.youtube.com/embed/0fYi8SGA20k",
            "https://www.youtube.com/embed/aWzlQ2N6qqg",
            "https://www.youtube.com/embed/Scxs7L0vhZ4",
            "https://www.youtube.com/embed/Z1q4eA1dEzY",
          ].map((src, index) => (
            <div key={index} className="rounded-xl overflow-hidden shadow-md">
              <iframe
                className="w-full h-60"
                src={src}
                title={`travel-video-${index}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      </section>

      {/* =============== FOOTER ================= */}
      <footer className="bg-black text-white py-10 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-xl font-semibold mb-2">SAFARAI</h3>
          <p className="text-gray-300 text-sm mb-4">
            Your trusted AI travel companion for smart, simplified journeys.
          </p>
          <p className="text-gray-500 text-xs">© {new Date().getFullYear()} Safarai. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default Hero;
