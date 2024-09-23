import styles from './title.module.css';
import React, { useEffect, useState } from 'react';

interface TitleProps {
  text?: string;
}

interface User {
  username: string;
}

const fetchUserData = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, {
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
    const { username } = data;
    return { username };
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};

const Title: React.FC<TitleProps> = ({ text = `Knight's Critique` }) => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await fetchUserData();
        if (userData) {
          setUsername(userData.username);
        }
      } catch (error) {
        console.error('Error loading user data: ', error);
      }
    };
    loadUserData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles['user-info']}>
        {username && <p>Welcome, {username}!</p>}
      </div>
      <h1 className={styles.title}>{text}</h1>
    </div>
  );
};

export default Title;
