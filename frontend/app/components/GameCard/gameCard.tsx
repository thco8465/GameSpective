import React from 'react';
import styles from './GameCard.module.css'; // Adjust the path as necessary

// Define the type for the props
interface GameCardProps {
  title: string;
  cover: string; // Change coverImage to cover
  rating: number;
  review: string;
  time_spent: string; // Add time_spent to the props
}

// GameCard component to display a summarized view of a game
const GameCard: React.FC<GameCardProps> = ({ title, cover, rating, review, time_spent }) => {
  return (
    <div className={styles.gameCard}>
      {/* Cover image of the game */}
      <img src={cover} alt={title} className={styles.gameCard__image} />

      {/* Title of the game */}
      <h3 className={styles.gameCard__title}>{title}</h3>

      {/* Rating of the game (if applicable) */}
      {rating !== undefined && (
        <div className={styles.gameCard__rating}>
          Rating: {rating}
        </div>
      )}

      {/* Time spent playing the game */}
      {time_spent && (
        <div className={styles.gameCard__timeSpent}>
          Time Spent: {time_spent} hours
        </div>
      )}
    </div>
  );
};

export default GameCard;
