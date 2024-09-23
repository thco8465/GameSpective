import React, { useState } from 'react';
import styles from './gameSearch.module.css';
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

const GameSearch: React.FC = () => {
    const [gameName, setGameName] = useState('');
    const [reviews, setReviews] = useState<Review[]>([]);

    const handleSearch = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/review/reviews/game/${encodeURIComponent(gameName)}`);
            const data: Review[] = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };
    return (
        <div className={styles.container}>
            <h2>Search for reviews by game</h2>
            <input
                type="text"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="Enter game name"
                className={styles.input}
            />
            <button onClick={handleSearch} className={styles.button}>Search</button>
            <div className={styles.results}>
                {reviews.map((review) => (
                    <div key={review.id} className={styles.review}>
                        <ReviewCard review={review}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GameSearch;
