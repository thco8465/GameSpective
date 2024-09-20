import React, { useEffect, useState } from 'react';
import styles from './profile.module.css';
import ReviewCard from './../reviewCard/reviewCard';

interface Review {
  id: number;
  rating: number;
  review: string;
  date: string;
  game_name: string;
  time_spent: number;
  cover: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<{ username: string; reviewCount: number; exp: number; level: string } | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, {
          headers: {
            'Content-Type': 'application/json',
            'bypass-tunnel-reminder': 'true',
            'Authorization': `Bearer ${token}` // Attach token
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data from /me: ', data);
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data: ', error);
      }
    };
    const fetchUserReviews = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/displayReviews`, {
          headers: {
            'Content-Type': 'application/json',
            'bypass-tunnel-reminder': 'true',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching user reviews: ', error);
      }
    };
    fetchUserReviews();
    fetchUserData();
  }, []);

  if (!user) return <div>Create an account or log in to view profile info!</div>;

  return (
    <>
      <div className={styles.profile}>
        <h1>{user.username}'s Profile</h1>
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
        <div className={styles.reviews}>
          {reviews.length > 0 ? (
            reviews.map((review) => 
            <ReviewCard key={review.id} review={review} />)
            
          ) : (
            <p>No reviews yet!</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
