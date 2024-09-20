import React, { useState } from 'react';
import styles from './searchBar.module.css';

interface Game {
  gameId: string;
  title: string;
  cover: string;
}
interface Props {
  onGameSelect: (game: Game | null) => void;}

const GameSearch: React.FC<Props> = ({ onGameSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [gameData, setGameData] = useState<Game | null>(null);
  const [error, setError] = useState<string>('');

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/twitch_api/games?name=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'bypass-tunnel-reminder': 'true', // Bypass tunnel reminder
          },
        }
      );
      if (!response.ok) {
        throw new Error('Game not found or API error');
      }
      const data = await response.json();
      console.log(data);
      setGameData(data);
      setError('');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Unknown error');
      }
      setGameData(null);
    }
  };
  const handleGameSelect = () => {
    //console.log('Game selected:', gameData);
    if (gameData) {
      onGameSelect(gameData);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.searchBox}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for game and select"
          className={styles.input}
        />
        <button onClick={handleSearch} className={styles.button}>Search</button>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {gameData && (
        <div className={styles.gameInfo}>
          <h2>{gameData.title}</h2>
          <img src={gameData.cover} alt={gameData.title} className={styles.coverImage} />
          <button onClick={handleGameSelect} className={styles.selectButton}>Select Game</button>
        </div>
      )}
    </div>
  );
};

export default GameSearch;
