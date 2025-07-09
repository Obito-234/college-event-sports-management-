# Sports Management Application

A full-stack web application for managing sports events, matches, and user administration.

## Features

- **User Management**: Multi-role authentication system (main admin, sport admin)
- **Sports Management**: CRUD operations for different sports
- **Event Management**: Create and manage sports events
- **Match Management**: Track matches and results
- **Gallery**: Image management for sports and events
- **Contact System**: User contact form and management
- **Admin Panel**: Comprehensive admin dashboard

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose

## Project Structure

```
p1/
├── backend/           # Backend API server
│   ├── api/          # API routes
│   ├── config/       # Database configuration
│   ├── middleware/   # Authentication middleware
│   ├── models/       # MongoDB schemas
│   └── server.js     # Main server file
├── frontend/         # Frontend React application
│   └── src/
│       ├── components/   # React components
│       └── pages/        # Page components
└── src/              # Main React application
    ├── components/   # UI components
    ├── pages/        # Page components
    └── data/         # Static data
```

## Installation

### Prerequisites
- Node.js 
- MongoDB
- Git

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
npm install
npm start
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Sports
- `GET /api/sports` - Get all sports
- `POST /api/sports` - Create new sport
- `PUT /api/sports/:id` - Update sport
- `DELETE /api/sports/:id` - Delete sport

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Matches
- `GET /api/matches` - Get all matches
- `POST /api/matches` - Create new match
- `PUT /api/matches/:id` - Update match
- `DELETE /api/matches/:id` - Delete match

## User Roles

1. **Main Admin**: Full access to all features
2. **Sport Admin**: Limited access to assigned sports only

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
