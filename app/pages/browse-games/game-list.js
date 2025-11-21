'use client';
import { useEffect, useState } from "react";

function GamesList() {
  const [games, setGames] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const loadGames = async (term = "") => {
    const url = term ? `/api/game?search=${encodeURIComponent(term)}` : "/api/game";
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Failed to fetch games:", response.statusText);
      return [];
    }
    const data = await response.json();
    setGames(data);
    setHasSearched(true);
  };

  useEffect(() => {
    loadGames(); // initial load
  }, []);

  return (
    <div className="w-screen h-screen bg-gray-900 text-gray-100 flex flex-col p-8">
      <h2 className="text-3xl font-bold mb-6 text-indigo-400 tracking-wide">
        🎮 Games
      </h2>

      <input
        type="text"
        placeholder="Search games..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          loadGames(e.target.value);
        }}
        className="w-full mb-6 p-3 rounded-lg bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      />

      <div className="flex-1 overflow-y-auto">
        {!hasSearched ? (
          <p className="text-gray-400 italic">Loading games...</p>
        ) : games.length === 0 ? (
          <p className="text-red-400 italic">No games found.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
            {games.map((game) => (
              <li
                key={game.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md hover:shadow-indigo-500/30 transition flex flex-col"
              >
                {/* Cover image clickable */}
                {game.cover?.url && (
                  <a href={game.url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={`https:${game.cover.url}`}
                      alt={`${game.name} cover`}
                      className="w-full h-48 object-cover rounded-md mb-3 border border-gray-700 hover:opacity-90 transition"
                    />
                  </a>
                )}

                {/* Game name clickable */}
                <a
                  href={game.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-semibold text-indigo-300 hover:text-indigo-400 transition"
                >
                  {game.name}
                </a>

                {game.release_dates?.[0]?.human && (
                  <p className="text-sm text-gray-400">
                    Released: {game.release_dates[0].human}
                  </p>
                )}

                {game.age_ratings?.[0]?.rating_category && (
                  <p className="text-sm text-indigo-300">
                    Rating Category: {game.age_ratings[0].rating_category}
                  </p>
                )}

                {game.age_ratings?.[0]?.synopsis && (
                  <p className="text-sm text-gray-400 italic mt-1">
                    {game.age_ratings[0].synopsis}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default GamesList;
