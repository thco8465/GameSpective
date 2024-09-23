// components/UserProfile.tsx

import React, { useEffect, useState } from 'react';
import styles from './userProfile.module.css'; // Adjust the path as necessary
import ReviewCard from '../reviewCard/reviewCard';

interface Review {
  id: number;
  rating: number;
  review: string;
  date: string;
  game_name: string;
  cover: string;
}

interface UserProfileProps {
  userId: number;
}

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<{ username: string; reviewCount: number; exp: number; level: string } | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError('Failed to fetch user data.');
        console.error('Error fetching user data:', error);
      }
    };

    const fetchUserReviews = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/${userId}/reviews`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('User reviews: ', data);
        setReviews(data);
      } catch (error) {
        setError('Failed to fetch user reviews.');
        console.error('Error fetching user reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchUserReviews();
  }, [userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>No user data available.</p>;

  return (
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
          reviews.map((review) => <ReviewCard key={review.id} review={review} />)
        ) : (
          <p>No reviews yet!</p>
        )}
      </div>
    </div>
  );
};
export default UserProfile;
