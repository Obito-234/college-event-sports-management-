import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SportsSection() {
  const [sports, setSports] = useState([]);

  useEffect(() => {
    fetch("/api/sports")
      .then((res) => res.json())
      .then((data) => setSports(data))
      .catch(() => setSports([]));
  }, []);

  // It only shows Cricket, Kabaddi, and Basketball on the home page
  const homeSports = sports.filter(
    (sport) =>
      (sport.name && ["Cricket", "Kabaddi", "Basketball"].includes(sport.name)) ||
      (sport.title && ["Cricket", "Kabaddi", "Basketball"].includes(sport.title))
  );

  return (
    <section className="px-2 sm:px-0">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-4 mb-4">
        <h2 className="text-3xl font-bold text-gray-800">Sports Highlights</h2>
        <Link
          to="/sports"
          className="text-yellow-500 font-semibold px-3 py-1 rounded-full hover:bg-yellow-100 transition text-base sm:text-lg self-start sm:self-auto"
        >
          More →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {homeSports.map((sport, index) => (
          <div
            key={index}
            className="relative rounded-2xl h-60 sm:h-64 flex flex-col justify-end p-0 shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-transform min-h-[15rem] overflow-hidden"
            style={{
              backgroundImage: `url(${
                sport.image || "https://picsum.photos/600/400"
              })`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
            <div className="relative z-10 text-white p-5 pb-4">
              <h3 className="text-2xl font-bold mb-1 drop-shadow">
                {sport.title || sport.name}
              </h3>
              <p className="mb-3 text-base drop-shadow">
                {sport.description || ""}
              </p>
              <Link
                to={`/sports/${sport.slug || sport.id}`}
                className="inline-block text-yellow-300 font-semibold hover:underline text-base"
              >
                All Games →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
