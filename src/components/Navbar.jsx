import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// Helper to get page title from path
const getPageTitle = (pathname) => {
  if (pathname === "/") return "Kurukestra";
  if (pathname.startsWith("/events")) return "Events";
  if (pathname.startsWith("/sports")) return "Sports";
  if (pathname.startsWith("/join-sports")) return "Join";
  if (pathname.startsWith("/contact")) return "Contact";
  return "Kurukestra";
};

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);
  const buttonRef = useRef(null);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };
  const linkClasses = (path) =>
    `transition-all duration-300 rounded-full px-4 py-2 transform hover:scale-105 active:scale-95 shadow-sm
    ${location.pathname === path ? "bg-yellow-300 text-black font-bold shadow-md" : "hover:bg-yellow-300 hover:text-black"}`;

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;

    function handleClickOutside(e) {
      if (
        navRef.current &&
        !navRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleScroll() {
      setIsMenuOpen(false);
    }

    // Close on route change (back/forward)
    function handlePopState() {
      setIsMenuOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isMenuOpen]);

  return (
    <nav
      ref={navRef}
      className={`fixed top-3 left-1/2 transform -translate-x-1/2 z-50 flex justify-between items-center w-[95%] max-w-7xl p-3 
    rounded-full h-16 px-8 backdrop-blur transition-colors duration-300 bg-[#001F3F] text-white`}
    >
      <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold transition-colors duration-200 focus:outline-none select-none">
          {getPageTitle(location.pathname)}
        </span>
      </div>

      {/* Hamburger Button */}
      <div className="md:hidden flex items-center">
        <button
          ref={buttonRef}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="focus:outline-none relative w-10 h-10 flex flex-col justify-center items-center"
          aria-label="Toggle menu"
        >
          <div
            className={`w-7 h-1 bg-white rounded transition-all duration-300
              ${isMenuOpen ? "rotate-45 translate-y-2" : ""}
            `}
          />
          <div
            className={`w-7 h-1 bg-white rounded transition-all duration-300 my-1
              ${isMenuOpen ? "opacity-0" : ""}
            `}
          />
          <div
            className={`w-7 h-1 bg-white rounded transition-all duration-300
              ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}
            `}
          />
        </button>
      </div>

      {/* Links */}
      <ul
        className={`
        md:flex md:space-x-4 md:items-center
        ${isMenuOpen 
            ? `flex flex-col space-y-3 absolute top-20 right-4 w-64 p-6
                bg-gradient-to-br from-[#001F3F] via-[#003366] to-[#001F3FCC] text-white 
                shadow-2xl backdrop-blur rounded-3xl animate-fade-in
                border border-white/10 items-stretch`
            : "hidden"
        }
        md:static md:flex-row md:space-y-0 md:p-0 md:w-auto md:items-center
      `}
        style={{
          transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
        }}
      >
        <li className="w-full">
          <Link to="/" onClick={handleLinkClick} className={linkClasses("/") + " w-full block text-center"}>
            Home
          </Link>
        </li>
        <li className="w-full">
          <Link to="/events" onClick={handleLinkClick} className={linkClasses("/events") + " w-full block text-center"}>
            Events
          </Link>
        </li>
        <li className="w-full">
          <Link to="/sports" onClick={handleLinkClick} className={linkClasses("/sports") + " w-full block text-center"}>
            Sports
          </Link>
        </li>
        <li className="w-full">
          <Link to="/join-sports" onClick={handleLinkClick} className={linkClasses("/join-sports") + " w-full block text-center"}>
            Join
          </Link>
        </li>
        <li className="w-full">
          <Link to="/contact" onClick={handleLinkClick} className={linkClasses("/contact") + " w-full block text-center"}>
            Contact
          </Link>
        </li>
      </ul>
      {/* Animation for mobile menu */}
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; transform: translateY(-20px) scale(0.95);}
          100% { opacity: 1; transform: translateY(0) scale(1);}
        }
        .animate-fade-in {
          animation: fade-in 0.4s cubic-bezier(.4,2,.6,1);
        }
      `}</style>
    </nav>
  );
}
