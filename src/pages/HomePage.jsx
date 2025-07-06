import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import EventsSection from "../components/EventsSection";
import SportsSection from "../components/SportsSection";

function InfiniteGalleryRow({ images, reverse = false, duration = 40 }) {
  // Responsive image size for mobile/desktop
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const imageWidth = isMobile ? 160 : 280;
  const imageHeight = isMobile ? 100 : 200;
  const imageGap = isMobile ? 16 : 36; // gap-4 or gap-9

  // Duplicate images for seamless infinite scroll
  const allImages = [...images, ...images];
  const totalWidth = allImages.length * imageWidth + (allImages.length - 1) * imageGap;

  return (
    <div className="overflow-hidden w-full relative">
      <div
        className={`flex ${isMobile ? "gap-4" : "gap-9"}`}
        style={{
          minWidth: "100vw",
          width: totalWidth,
          animation: `${reverse ? "scrollLeft" : "scrollRight"} ${duration}s linear infinite`,
        }}
      >
        {allImages.map((src, idx) => (
          <div
            key={idx}
            className="rounded-2xl overflow-hidden shadow-md border-2 border-white bg-white transition-transform duration-300 hover:scale-105"
            style={{ width: imageWidth, height: imageHeight }}
          >
            <img
              src={src}
              alt={`Gallery ${idx + 1}`}
              className="w-full h-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function HomePage() {
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then(res => res.json())
      .then(data => setGalleryImages(data.map(img => img.url)))
      .catch(() => setGalleryImages([]));
  }, []);

  return (
    <div className="bg-gray-100 flex flex-col">
      <Helmet>
        <title>Kurukshetra - Home</title>
      </Helmet>

      {/* Header / Introduction Section */}
      <div className="flex flex-col items-center justify-center text-center pt-12 pb-6 px-4 mb-7">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 mb-6 drop-shadow-lg tracking-tight">
            Welcome to <span className="text-blue-600">Kurukshetra</span>
          </h1>
          <p className="text-gray-700 mt-4 text-xl md:text-2xl font-medium">
            Experience the vibrance of <span className="text-blue-500 font-semibold">events</span> and <span className="text-blue-500 font-semibold">sports</span> that unite our campus community.
          </p>
        </div>
      </div>

      {/* Infinite Scrolling Photo Gallery */}
      <div className="py-10 px-2 w-full max-w-full">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-900">Photo Gallery</h2>
        <div className="space-y-6 w-full">
          <InfiniteGalleryRow images={galleryImages} reverse={false} duration={40} />
          <InfiniteGalleryRow images={galleryImages} reverse={true} duration={50} />
        </div>
      </div>

      {/* Main content area */}
      <main className="flex-1 p-8 space-y-12 max-w-7xl mx-auto">
        <SportsSection />
        <EventsSection />
      </main>

      {/* Animation keyframes */}
      <style>
        {`
          @keyframes scrollRight {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scrollLeft {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
}

export default HomePage;
