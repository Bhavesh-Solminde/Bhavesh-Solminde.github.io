import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-effect border-b border-white border-opacity-20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🐍</span>
            </div>
            <span className="text-white font-bold text-xl">SnakeGame</span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex space-x-8">
              <Link
                to="/game"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/game")
                    ? "text-white bg-white bg-opacity-20"
                    : "text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10"
                }`}
              >
                Play Game
              </Link>
              <Link
                to="/leaderboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/leaderboard")
                    ? "text-white bg-white bg-opacity-20"
                    : "text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-10"
                }`}
              >
                Leaderboard
              </Link>
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-white text-sm">
                  Welcome,{" "}
                  <span className="font-semibold">{user.username}</span>
                </span>
                <span className="text-green-400 text-sm font-semibold">
                  Best: {user.bestScore}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-x-2">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
