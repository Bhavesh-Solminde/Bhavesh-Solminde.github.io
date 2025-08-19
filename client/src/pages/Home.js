import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="glass-effect rounded-2xl p-12 mb-8">
          <div className="text-8xl mb-6 animate-bounce-slow">🐍</div>
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Snake Game
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Classic snake game with modern twist! Compete with players
            worldwide, track your high scores, and climb the leaderboard.
          </p>

          {user ? (
            <div className="space-y-6">
              <div className="bg-white bg-opacity-10 rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-semibold text-white mb-2">
                  Welcome back, {user.username}!
                </h2>
                <p className="text-green-400 text-lg">
                  Your best score:{" "}
                  <span className="font-bold">{user.bestScore}</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/game"
                  className="btn-primary px-8 py-4 rounded-lg text-white font-semibold text-lg inline-block"
                >
                  🎮 Play Game
                </Link>
                <Link
                  to="/leaderboard"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-8 py-4 rounded-lg text-white font-semibold text-lg inline-block transition-all"
                >
                  🏆 Leaderboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-lg text-gray-300 mb-6">
                Join the community and start playing today!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="btn-primary px-8 py-4 rounded-lg text-white font-semibold text-lg inline-block"
                >
                  🚀 Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 px-8 py-4 rounded-lg text-white font-semibold text-lg inline-block transition-all"
                >
                  🔑 Login
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="glass-effect rounded-xl p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-white mb-2">Compete</h3>
            <p className="text-gray-300">
              Challenge yourself and compete with players from around the world
            </p>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Track Progress
            </h3>
            <p className="text-gray-300">
              Monitor your improvement with detailed score tracking and
              statistics
            </p>
          </div>

          <div className="glass-effect rounded-xl p-6">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Climb Rankings
            </h3>
            <p className="text-gray-300">
              Rise through the leaderboard and become the ultimate snake
              champion
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
