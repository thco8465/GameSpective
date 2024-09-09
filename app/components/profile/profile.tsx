import React, { useEffect, useState } from 'react';
import styles from './profile.module.css';

const Profile: React.FC = () => {
  const [user, setUser] = useState<{ firstName: string; reviewCount: number; exp: number; level: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/user/me', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Attach token
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className={styles.profile}>
      <h1>{user.firstName}'s Profile</h1>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <p>Review Count:</p>
          <p>{user.reviewCount}</p>
        </div>
        <div className={styles.stat}>
          <p>Experience:</p>
          <p>{user.exp}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.level}>Level:</p>
          <p>{user.level}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
