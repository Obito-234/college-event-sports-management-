import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EventsSection() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => setEvents([]));
  }, []);

  return (
    <section>
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4 mb-4">
        <h2 className="text-3xl font-bold text-gray-800">Upcoming Events</h2>
        <Link
          to="/events"
          className="text-blue-600 font-semibold px-3 py-1 rounded-full hover:bg-blue-100 transition text-base sm:text-lg self-start sm:self-auto"
        >
          More →
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 shadow hover:shadow-xl transition-transform transform hover:-translate-y-1"
          >
            <h3 className="text-2xl font-bold text-gray-800">{event.title}</h3>
            <p className="text-gray-600 font-semibold mt-1">{event.date}</p>
            <p className="text-gray-500 mt-3">{event.description}</p>
            <Link
              to="/events"
              className="text-blue-600 mt-3 inline-block hover:underline"
            >
              Read more →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
