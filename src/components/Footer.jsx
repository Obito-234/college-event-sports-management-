import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#011f41] text-gray-100 mt-8">
      <div className="max-w-7xl mx-auto p-6 flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
        <div className="space-y-1">
          <h3 className="font-bold text-lg">NIST University</h3>
          <p>Institute Park, Berhampur, Odisha 761008, India</p>
          <p>Email: @NIST.edu</p>
          <p>Phone: +91-1234567890</p>
        </div>

        {/* Social Links */}
        <div className="flex space-x-4 items-center">
          <a href="https://www.facebook.com/NISTUniversity" target="_blank" rel="noreferrer" title="Facebook" className="hover:text-yellow-400">
            <Facebook size={20} />
          </a>
          <a href="https://twitter.com/NISTUniversity" target="_blank" rel="noreferrer" title="Twitter" className="hover:text-yellow-400">
            <Twitter size={20} />
          </a>
          <a href="https://www.linkedin.com/school/nistuniversity/" target="_blank" rel="noreferrer" title="LinkedIn" className="hover:text-yellow-400">
            <Linkedin size={20} />
          </a>
          <a href="https://www.instagram.com/nistuniversity/" target="_blank" rel="noreferrer" title="Instagram" className="hover:text-yellow-400">
            <Instagram size={20} />
          </a>
        </div>
      </div>
      <div className="bg-[#00162e] py-3 mt-3">
        <div className="text-center text-sm">
          &copy; {new Date().getFullYear()} NIST University. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
