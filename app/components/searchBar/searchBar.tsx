import React, { useState } from 'react';

interface Game {
    title: string;
    cover: string;
}
const GameSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gameData, setGameData] = useState<Game | null>(null);
  const [error, setError] = useState<string>('');

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://gamespective.loca.lt/api/twitch_api/games?name=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'bypass-tunnel-reminder': 'true', // Bypass tunnel reminder
          },
        }
      );      if (!response.ok) {
        throw new Error('Game not found or API error');
      }
      const data = await response.json();
      setGameData(data);
      setError('');
    } catch (error) {
        if(error instanceof Error){
            setError(error.message);
        }else{
            setError('unknown error');
        }
      setGameData(null);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for a game..."
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p>{error}</p>}
      {gameData && (
        <div>
          <h2>{gameData.title}</h2>
          <img src={gameData.cover} alt={gameData.title} />
        </div>
      )}
    </div>
  );
};

export default GameSearch;
