const mongoose = require('mongoose');
require('dotenv').config();

const Sport = require('./models/Sport');
const Match = require('./models/Match');
const Event = require('./models/Event');
const Gallery = require('./models/Gallery');

const connectDB = require('./config/database');

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await Sport.deleteMany({});
    await Match.deleteMany({});
    await Event.deleteMany({});
    await Gallery.deleteMany({});
    
    console.log('Cleared existing data');
    
    // Seed Sports
    const sports = [
      {
        name: "Football",
        title: "Football",
        slug: "football",
        category: "Outdoor",
        description: "Annual football match featuring top college teams.",
        image: "https://picsum.photos/seed/football/600/300",
        date: "October 5, 2025",
        venue: "Stadium A",
        registerLink: "https://example.com/register/football",
        moreDetailsLink: "https://example.com/details/football",
        minPlayers: 11,
        arrivalTime: "9:30 AM",
        fixture: "Knockout Rounds starting from 10 AM",
        gameTiming: "10 AM - 4 PM"
      },
      {
        name: "Basketball",
        title: "Basketball",
        slug: "basketball",
        category: "Indoor",
        description: "A thrilling basketball competition for students.",
        image: "https://picsum.photos/seed/basketball/600/300",
        date: "October 20, 2025",
        venue: "Basketball Court",
        registerLink: "https://example.com/register/basketball",
        moreDetailsLink: "https://example.com/details/basketball",
        minPlayers: 5,
        arrivalTime: "8:30 AM",
        fixture: "League-style matches",
        gameTiming: "9 AM - 5 PM"
      },
      {
        name: "Cricket",
        title: "Cricket",
        slug: "cricket",
        category: "Outdoor",
        description: "Annual Cricket match featuring top college teams.",
        image: "https://picsum.photos/seed/cricket/600/300",
        date: "October 5, 2025",
        venue: "Stadium B",
        registerLink: "https://example.com/register/cricket",
        moreDetailsLink: "https://example.com/details/cricket",
        minPlayers: 11,
        arrivalTime: "9 AM",
        fixture: "Knockout Matches",
        gameTiming: "9 AM - 6 PM"
      },
      {
        name: "Chess",
        title: "Chess",
        slug: "chess",
        category: "Indoor",
        description: "Annual Chess match featuring top college teams.",
        image: "https://picsum.photos/seed/chess/600/300",
        date: "October 5, 2025",
        venue: "Sports Hall 1",
        registerLink: "https://example.com/register/chess",
        moreDetailsLink: "https://example.com/details/chess",
        minPlayers: 1,
        arrivalTime: "9:30 AM",
        fixture: "Round-robin with best of 3",
        gameTiming: "10 AM - 3 PM"
      },
      {
        name: "Kabaddi",
        title: "Kabaddi",
        slug: "kabaddi",
        category: "Outdoor",
        description: "Traditional kabaddi tournament with modern rules.",
        image: "https://picsum.photos/seed/kabaddi/600/300",
        date: "November 5, 2025",
        venue: "Kabaddi Ground",
        registerLink: "https://example.com/register/kabaddi",
        moreDetailsLink: "https://example.com/details/kabaddi",
        minPlayers: 7,
        arrivalTime: "8:30 AM",
        fixture: "League matches",
        gameTiming: "9:00 AM - 5:30 PM"
      }
    ];
    
    await Sport.insertMany(sports);
    console.log('Sports seeded successfully');
    
    // Seed Matches
    const matches = [
      {
        sport: "football",
        match: "Team A vs Team B",
        slug: "team-a-vs-team-b",
        teams: { home: "Team A", away: "Team B" },
        scores: { home: 2, away: 1 },
        date: "October 5, 2025",
        status: "Completed",
        details: {
          homePlayers: [
            { name: "John Doe", goals: 1 },
            { name: "Mike Stone", goals: 1 }
          ],
          awayPlayers: [
            { name: "Chris Lane", goals: 1 }
          ]
        }
      },
      {
        sport: "cricket",
        match: "Team India vs Team Australia",
        slug: "india-vs-australia",
        teams: { home: "Team India", away: "Team Australia" },
        scores: { home: 285, away: 280 },
        date: "October 5, 2025",
        status: "Completed",
        details: {
          homePlayers: [
            { name: "Virat Kohli", runs: 85, wickets: 0 },
            { name: "Rohit Sharma", runs: 45, wickets: 0 }
          ],
          awayPlayers: [
            { name: "Steve Smith", runs: 78, wickets: 0 },
            { name: "David Warner", runs: 52, wickets: 0 }
          ]
        }
      },
      {
        sport: "chess",
        match: "Magnus Carlsen vs Hikaru Nakamura",
        slug: "game-1",
        teams: { white: "Magnus Carlsen", black: "Hikaru Nakamura" },
        result: "1-0",
        date: "October 25, 2025",
        status: "Completed",
        moves: 42,
        players: ["Magnus Carlsen", "Hikaru Nakamura"]
      },
      {
        sport: "kabaddi",
        match: "Team Alpha vs Team Beta",
        slug: "alpha-vs-beta",
        teams: { home: "Team Alpha", away: "Team Beta" },
        scores: { home: 35, away: 28 },
        date: "November 5, 2025",
        status: "Completed",
        details: {
          homePlayers: [
            { name: "Rahul Kumar", points: 8 },
            { name: "Amit Singh", points: 6 }
          ],
          awayPlayers: [
            { name: "Arjun Reddy", points: 7 },
            { name: "Kiran Kumar", points: 5 }
          ]
        }
      }
    ];
    
    await Match.insertMany(matches);
    console.log('Matches seeded successfully');
    
    // Seed Events
    const events = [
      {
        title: "Cultural Night",
        date: "2025-10-10",
        venue: "Main Hall",
        description: "A night of music and dance.",
        imageUrl: "https://picsum.photos/id/1021/600/400",
        registrationLink: "https://example.com/register",
        category: "Cultural"
      },
      {
        title: "Tech Expo 2025",
        date: "2025-11-15",
        venue: "Engineering Block",
        description: "Showcase of innovative projects and technologies.",
        imageUrl: "https://picsum.photos/id/1022/600/400",
        registrationLink: "https://example.com/register/tech",
        category: "Technology"
      }
    ];
    
    await Event.insertMany(events);
    console.log('Events seeded successfully');
    
    // Seed Gallery
    const gallery = [
      { url: "https://picsum.photos/id/1011/600/400", caption: "Sports Event" },
      { url: "https://picsum.photos/id/1012/600/400", caption: "Cultural Fest" },
      { url: "https://picsum.photos/id/1013/600/400", caption: "Tech Expo" },
      { url: "https://picsum.photos/id/1014/600/400", caption: "Team Spirit" }
    ];
    
    await Gallery.insertMany(gallery);
    console.log('Gallery seeded successfully');
    
    console.log('Database seeded successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData(); 