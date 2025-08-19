# Snake Game

A modern, full-stack Snake Game web application with user authentication, leaderboards, and beautiful UI.

## 🎮 Features

- **Classic Snake Gameplay**: Smooth, responsive controls with modern graphics
- **User Authentication**: Secure signup/login system with Passport.js
- **Global Leaderboard**: Compete with players worldwide
- **Beautiful UI**: Glass-morphism design with smooth animations
- **Mobile Friendly**: Responsive design that works on all devices
- **Real-time Scoring**: Live score tracking and submission

## 🚀 Tech Stack

### Backend

- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database and ODM
- **Passport.js** - Authentication with local and Google OAuth strategies
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend

- **React 18** - Frontend framework
- **React Router** - Navigation and routing
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **react-hot-toast** - Toast notifications

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Backend Setup

1. Navigate to the server directory:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the server directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/snakegame
JWT_SECRET=your_jwt_secret_here_make_it_very_long_and_secure
```

4. Start the server:

```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🎯 How to Play

1. **Sign Up/Login**: Create an account or login to start playing
2. **Controls**: Use arrow keys (↑ ↓ ← →) to control the snake
3. **Objective**: Eat the red food to grow your snake and increase your score
4. **Avoid**: Don't hit the walls or the snake's own body
5. **Compete**: Check the leaderboard to see how you rank against other players

## 🏗️ Project Structure

```
snake-game/
├── server/                 # Backend application
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── .env              # Environment variables
│   ├── package.json      # Backend dependencies
│   └── server.js         # Main server file
│
├── client/                # Frontend application
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   ├── App.js        # Main App component
│   │   └── index.js      # Entry point
│   ├── package.json      # Frontend dependencies
│   └── tailwind.config.js # TailwindCSS config
│
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/snakegame
JWT_SECRET=your_very_secure_jwt_secret_key_here
```

### Database Setup

The application uses MongoDB. You can use either:

1. **Local MongoDB**: Install MongoDB locally and use the default connection string
2. **MongoDB Atlas**: Create a free cluster and use the Atlas connection string

## 🎨 Game Features

### Scoring System

- **Food eaten**: +10 points per food item
- **Bonus**: Score multiplier for consecutive food items
- **Best Score**: Automatically tracked and saved

### Difficulty Levels

- Game speed increases as your snake grows longer
- More challenging obstacles and patterns

### Visual Effects

- Smooth snake movement animations
- Particle effects when eating food
- Glass-morphism UI design
- Responsive color schemes

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration

## 📱 Mobile Support

The game is fully responsive and supports:

- Touch controls for mobile devices
- Responsive layout for all screen sizes
- Optimized performance for mobile browsers

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set up environment variables in your hosting platform
2. Connect your GitHub repository
3. Deploy the server directory

### Frontend Deployment (Netlify/Vercel)

1. Build the React app:

```bash
cd client
npm run build
```

2. Deploy the `build` folder to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Enhancements

- [ ] Multiplayer real-time gameplay
- [ ] Power-ups and special items
- [ ] Different game modes (Speed, Survival, etc.)
- [ ] Social features (friend system, sharing scores)
- [ ] Mobile app version
- [ ] Tournaments and competitions

## 📞 Support

If you have any questions or need help with setup, please open an issue on GitHub or contact us.

---

**Enjoy playing Snake Game! 🐍🎮**
