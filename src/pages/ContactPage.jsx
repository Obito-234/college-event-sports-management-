import React, { useState } from "react";
import { Mail, Phone, Linkedin, Github, Twitter, MapPin } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gradient-to-br from-blue-50 via-yellow-50 to-pink-100">
      <div className="max-w-3xl w-full bg-white/90 backdrop-blur rounded-2xl p-8 shadow-2xl space-y-10 border border-blue-100">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="flex-shrink-0 flex justify-center">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-200 shadow-lg object-cover"
            />
          </div>
          {/* Details */}
          <div className="flex flex-col justify-center items-center sm:items-start text-gray-700 text-lg space-y-2">
            <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight drop-shadow mb-2">Hrushikesh pathy</h1>
            <div>
              <span className="font-semibold">Age:</span> 21
            </div>
            <div>
              <span className="font-semibold">Location:</span> odisha, India
            </div>
            <div>
              <span className="font-semibold">Profession:</span> Student
            </div>
          </div>
        </div>

        {/* About You */}
        <div className="bg-gradient-to-r from-yellow-100 to-pink-100 rounded-xl p-6 space-y-3 text-gray-700 shadow">
          <h2 className="text-2xl font-bold text-blue-800 flex items-center gap-2">
            <span role="img" aria-label="wave">👋</span> About Me
          </h2>
          <p>
            Hi! I'm <span className="font-bold text-blue-900">Hrushikesh pathy</span>, a passionate developer.<br />
            I build interactive, user-friendly websites and love working on innovative projects.<br />
            Let's connect and create something great together!
          </p>
        </div>

        {/* Contact Info & Social Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white/80 rounded-xl p-4 flex flex-col space-y-3 border border-blue-100 shadow">
            <h3 className="text-lg font-semibold text-blue-900">Contact Info</h3>
            <div className="flex items-center space-x-2">
              <Mail className="text-blue-600" />
              <span>youremail@example.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="text-blue-600" />
              <span>+1 (123) 456-7890</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="text-blue-600" />
              <span>Chennai, India</span>
            </div>
          </div>
          <div className="bg-white/80 rounded-xl p-4 flex flex-col space-y-3 border border-blue-100 shadow">
            <h3 className="text-lg font-semibold text-blue-900">Connect with Me</h3>
            <div className="flex space-x-4 justify-center">
              <a
                href="https://www.linkedin.com/in/yourprofile"
                className="hover:text-blue-600 transition"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin size={28} />
              </a>
              <a
                href="https://github.com/yourprofile"
                className="hover:text-gray-800 transition"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github size={28} />
              </a>
              <a
                href="https://twitter.com/yourprofile"
                className="hover:text-blue-400 transition"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <Twitter size={28} />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-xl p-6 space-y-4 border border-yellow-100 shadow">
          <h3 className="text-xl font-semibold text-blue-900">Send a Message</h3>
          
          {submitStatus === 'success' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              Message sent successfully! I'll get back to you soon.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Failed to send message. Please try again.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="flex-1 rounded-xl border-gray-300 p-3 focus:outline-none focus:border-blue-500 shadow"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="flex-1 rounded-xl border-gray-300 p-3 focus:outline-none focus:border-blue-500 shadow"
              />
            </div>
            <textarea
              name="message"
              placeholder="Your Message..."
              rows="4"
              value={formData.message}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl border-gray-300 p-3 focus:outline-none focus:border-blue-500 shadow"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-gradient-to-r from-blue-700 to-blue-900 text-white font-semibold p-3 hover:from-blue-800 hover:to-blue-950 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
