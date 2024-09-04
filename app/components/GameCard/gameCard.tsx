import React from 'react';
import styles from './GameCard.module.css';
// Define the type for the props
interface GameCardProps {
  title: string;
  coverImage: string;
  review: string;
  rating?: number; // Optional prop
}

// GameCard component to display a summarized view of a game
const GameCard: React.FC<GameCardProps> = ({ title, coverImage, review, rating }) => {
  return (
    <div className={styles.gameCard}>
      {/* Cover image of the game */}
      <img src={coverImage} alt={title} className={styles.gameCard__image} />

      {/* Title of the game */}
      <h3 className={styles.gameCard__title}>{title}</h3>

      {/* Review of the game */}
      <p className={styles.gameCard__review}>{review}</p>

      {/* Rating of the game (if applicable) */}
      {rating && (
        <div className={styles.gameCard__rating}>
          Rating: {rating}
        </div>
      )}
    </div>
  );
};


export default GameCard;
