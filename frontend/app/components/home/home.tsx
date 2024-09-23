import React, { useEffect, useState } from 'react';
import styles from './home.module.css';
import ReviewCard from '../reviewCard/reviewCard';

// Define your Game type
interface Game {
  title: string;
  cover: string;
}

interface Review {
  id: number;
  rating: number;
  review: string;
  date: string;
  game_name: string;
  cover: string;
  username: string;
  time_spent: number;
}

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch recent reviews
  const fetchRecentReviews = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/review/recentReviews`, {
        headers: {
          'Content-Type': 'application/json',
          'bypass-tunnel-reminder': 'true',
        }
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorText}`);
      }
  
      const data = await response.json();
      console.log('Fetched reviews:', data); // Log the data
      setReviews(data);
    } catch (error) {
      console.error('Error fetching recent reviews: ', error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchRecentReviews();
  }, []); // Empty dependency array means this runs once after the initial render

  return (
    <div>
      <section>
        <div className={styles.reviews}>
          {loading ? (
            <p>Loading...</p>
          ) : reviews.length > 0 ? (
            reviews.map((review) =>
              <ReviewCard key={review.id} review={review} />)
          ) : (
            <p>No recent reviews</p>
          )}
        </div>
      </section>
    </div>
  );
}
