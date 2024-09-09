import Header from '../header/header';
import SearchBar from '../searchBar/searchBar'
import styles from './home.module.css';
import React, { useEffect, useState } from 'react';

// Define your Game type
interface Game {
  title: string;
  cover: string;
}
interface User {
  firstName: string;
}
// Function to fetch game data from your backend
const fetchGameData = async (): Promise<Game[]> => {
  try {
    console.log('Fetching game data from: https://gamespective.loca.lt/api/twitch_api/games?name=Fortnite'); // Log URL
    const response = await fetch('https://gamespective.loca.lt/api/twitch_api/games?name=Fortnite', {
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

// Fetch user data with token
const fetchUserData = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/user/me', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // Extract the fields you need
    const { firstName } = data;
    return { firstName };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};




export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [userFirstName, setUserFirstName] = useState<string | null>(null);

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
    const loadUserData = async () => {
      try {
        const userData = await fetchUserData();
        if(userData) {
          setUserFirstName(userData.firstName);
        }
      } catch(error){
        console.error('Error loading user data: ', error);
      }
    };
    //loadGameData();
    loadUserData();
  }, []);

  return (
    <div>
      <div className={styles['user-info']}>
        {userFirstName && <p>Welcome, {userFirstName}!</p>}
      </div>
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
