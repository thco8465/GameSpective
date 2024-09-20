import React from 'react';
import styles from './reviewCard.module.css';

interface Review_Info {
  id: number;
  review_id: number;
  high: string;
  low: string;
  atmosphere: number;
  story: number;
  dev_note: string;
  gameplay: number;
  username?: string; // Optional username
  game_name: string;
  cover: string;
}

interface ReviewCardProps {
  review: Review_Info;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const imageUrl = review.cover.replace('{width}', '100').replace('{height}', '150');

  return (
    <div className={styles.reviewCard}>
      {/* Cover image of the game */}
      <div className={styles.reviewCard__cover}>
        <img src={imageUrl} alt={review.game_name} />
      </div>

      <h3 className={styles.gameTitle}>{review.game_name}</h3>
      <p className={styles.rating}><strong>High Point:</strong> {review.high}</p>
      <p className={styles.reviewText}><strong>Low Point:</strong> {review.low}</p>
      <p className={styles.reviewText}><strong>Atmosphere:</strong> {review.atmosphere}/10</p>
      <p className={styles.reviewText}><strong>Story:</strong> {review.story}/10</p>
      <p className={styles.reviewText}><strong>Gameplay:</strong> {review.gameplay}/10</p>
      <p className={styles.reviewText}><strong>Note to Developer:</strong> {review.dev_note}</p>

      {review.username && (
        <p className={styles.username}><strong>Username:</strong> {review.username}</p>
      )}
    </div>
  );
};

export default ReviewCard;
