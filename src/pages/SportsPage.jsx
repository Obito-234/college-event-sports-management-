import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const categories = ['All', 'Indoor', 'Outdoor'];

export default function SportsPage() {
	const [sportsList, setSportsList] = useState([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [categoryFilter, setCategoryFilter] = useState('All');

	useEffect(() => {
		fetch('/api/sports')
			.then((res) => res.json())
			.then((data) => setSportsList(data))
			.catch(() => setSportsList([]));
	}, []);

	const filteredSports = sportsList.filter((sport) => {
		const matchesSearch = (sport.title || sport.name || '').toLowerCase().includes(searchTerm.toLowerCase());
		const matchesCategory = categoryFilter === 'All' || sport.category === categoryFilter;
		return matchesSearch && matchesCategory;
	});

	return (
		<div className="pt-4 p-8 space-y-6">
			{/* Enhanced Search & Filter Bar */}
			<div className="flex flex-col md:flex-row justify-center items-center gap-4">
				<div className="relative w-full md:w-1/3">
					<input
						type="text"
						placeholder="Search sports..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full border border-blue-200 rounded-full py-2 pl-10 pr-4 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
					/>
					<span className="absolute left-3 top-2.5 text-blue-400 pointer-events-none">
						<svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
							<circle cx="11" cy="11" r="8" />
							<line x1="21" y1="21" x2="16.65" y2="16.65" />
						</svg>
					</span>
				</div>
				<div>
					<select
						value={categoryFilter}
						onChange={(e) => setCategoryFilter(e.target.value)}
						className="border border-blue-200 rounded-full py-2 px-6 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-blue-700 font-semibold transition"
					>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category === 'All'
									? ' All'
									: category === 'Indoor'
									? ' Indoor'
									: ' Outdoor'}
							</option>
						))}
					</select>
				</div>
			</div>

			{filteredSports.length > 0 ? (
				<div className="grid gap-6 md:grid-cols-3">
					{filteredSports.map((sport) => (
						<Link
							key={sport.slug || sport.id}
							to={`/sports/${sport.slug || sport.id}`}
							className="relative rounded-lg shadow hover:shadow-lg transition-transform hover:scale-105 block group overflow-hidden"
							style={{
								backgroundImage: `url(${sport.image || 'https://picsum.photos/400/300'})`,
								backgroundSize: 'cover',
								backgroundPosition: 'center',
								minHeight: '18rem',
							}}
						>
							{/* Stronger overlay for text visibility */}
							<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-95"></div>
							<div className="relative z-10 p-4 h-full flex flex-col justify-end space-y-2">
								<h2 className="text-xl font-bold text-white drop-shadow-lg">{sport.title || sport.name}</h2>
								<p className="text-gray-100 font-semibold drop-shadow">{sport.date}</p>
								<p className="text-gray-100 drop-shadow">{sport.description}</p>
								<div className="flex justify-end">
									<span className="inline-flex items-center text-blue-200 font-semibold drop-shadow">
										More <span className="ml-2">→</span>
									</span>
								</div>
							</div>
						</Link>
					))}
				</div>
			) : (
				<p className="text-center text-gray-500 mt-6">No sports found matching your criteria.</p>
			)}
		</div>
	);
}
