import React, { useState } from 'react';
import styles from './userSearch.module.css';
import ReviewCard from '../reviewCard/reviewCard'

interface Review {
  id: number;
  game_name: string;
  review: string;
  time_spent: number;
  rating: number;
  username: string;
  date: string;
  cover: string;
}

const UserSearch: React.FC = () => {
  const [username, setUsername] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/review/reviews/user/${encodeURIComponent(username)}`);
      const data: Review[] = await response.json(); // Specify type here
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Search for reviews by username</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter username"
        className={styles.input}
      />
      <button onClick={handleSearch} className={styles.button}>Search</button>
      <div className={styles.results}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.review}>
            <ReviewCard review = {review}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearch;
