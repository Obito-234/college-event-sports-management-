import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 p-0 w-full"> {/* Removed padding for edge-to-edge */}
        {children}
      </main>
      <Footer />
    </div>
  );
}
