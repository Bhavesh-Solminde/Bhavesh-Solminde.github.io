import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

const Leaderboard = () => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userScore, setUserScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get("/api/leaderboard");
      setLeaderboardData(response.data.leaderboard);
      setUserRank(response.data.userRank);
      setUserScore(response.data.userScore);
    } catch (error) {
      toast.error("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return "🏅";
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return "text-yellow-400";
      case 2:
        return "text-gray-300";
      case 3:
        return "text-orange-400";
      default:
        return "text-blue-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-effect rounded-xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="text-white mt-4">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🏆 Leaderboard</h1>
          <p className="text-gray-300 text-lg">
            Top players from around the world
          </p>
        </div>

        {/* User's Current Rank */}
        {user && (
          <div className="glass-effect rounded-xl p-6 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Your Statistics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <p className="text-gray-300 text-sm">Your Rank</p>
                  <p className="text-3xl font-bold text-blue-400">
                    #{userRank}
                  </p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <p className="text-gray-300 text-sm">Best Score</p>
                  <p className="text-3xl font-bold text-green-400">
                    {userScore}
                  </p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <p className="text-gray-300 text-sm">Username</p>
                  <p className="text-2xl font-bold text-white">
                    {user.username}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="glass-effect rounded-xl overflow-hidden">
          <div className="bg-white bg-opacity-10 px-6 py-4 border-b border-white border-opacity-20">
            <h2 className="text-2xl font-semibold text-white">
              Top 10 Players
            </h2>
          </div>

          <div className="p-6">
            {leaderboardData.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-300 text-lg">
                  No scores yet. Be the first to play!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {leaderboardData.map((player, index) => (
                  <div
                    key={index}
                    className={`leaderboard-item flex items-center justify-between p-4 rounded-lg ${
                      user && player.username === user.username
                        ? "bg-blue-500 bg-opacity-20 border border-blue-400"
                        : "bg-white bg-opacity-5"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{getRankIcon(player.rank)}</div>
                      <div>
                        <p
                          className={`text-2xl font-bold ${getRankColor(
                            player.rank
                          )}`}
                        >
                          #{player.rank}
                        </p>
                      </div>
                      <div>
                        <p className="text-xl font-semibold text-white">
                          {player.username}
                          {user && player.username === user.username && (
                            <span className="ml-2 text-sm bg-blue-500 px-2 py-1 rounded">
                              You
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-400">
                        {player.score.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-400">points</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button
            onClick={fetchLeaderboard}
            className="btn-primary px-6 py-3 rounded-lg text-white font-semibold"
          >
            🔄 Refresh Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
