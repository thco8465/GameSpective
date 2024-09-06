import Header from '../header/header';
import SearchBar from '../searchBar/searchBar'
import styles from './home.module.css';
import React, { useEffect, useState } from 'react';

// Define your Game type
interface Game {
  title: string;
  cover: string;
}

// Function to fetch game data from your backend
const fetchGameData = async (): Promise<Game[]> => {
  try {
    console.log('Fetching game data from: https://yellow-radios-knock.loca.lt/api/twitch_api/games?name=Fortnite'); // Log URL
    const response = await fetch('https://yellow-radios-knock.loca.lt/api/twitch_api/games?name=Fortnite', {
      headers: {
        'bypass-tunnel-reminder': 'true'
      }
    });
        console.log('Response Status:', response.status); // Log status
    console.log('Response Headers:', response.headers); // Log headers
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Response Body:', data); // Log body
    return [data]; // Adjust based on how data is structured (array or object)
  } catch (error) {
    console.error('Error fetching game data:', error);
    return [];
  }
};



export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGameData = async () => {
      try {
        const fetchedGames = await fetchGameData();
        console.log('Games loaded:', fetchedGames); // Log the loaded games for debugging
        setGames(fetchedGames);
      } catch (error) {
        console.error('Error loading game data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGameData();
  }, []);

  return (
    <div>
      <Header />
      <SearchBar/>
      <section>
        <div className={styles['game-card-container']}>
          {loading && <p>Loading games...</p>}
          {!loading && games.length === 0 && <p>No games found.</p>}
          {!loading && games.length > 0 && games.map((game, index) => (
            <div key={index} className={styles['game-card']}>
              <img src={game.cover} alt={game.title} className={styles['game-cover-image']} />
              <h2>{game.title}</h2>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
