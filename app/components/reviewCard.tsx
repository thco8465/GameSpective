import React from 'react';
import styles from './ReviewCard.module.css'; // Using CSS Modules

interface ReviewCardProps {
  reviewerName: string;
  reviewTitle: string;
  reviewText: string;
  date: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ reviewerName, reviewTitle, reviewText, date }) => {
  return (
    <div className={styles.reviewCard}>
      <h3 className={styles.reviewCardTitle}>{reviewTitle}</h3>
      <p className={styles.reviewCardReviewer}>Reviewed by: {reviewerName}</p>
      <p className={styles.reviewCardText}>{reviewText}</p>
      <p className={styles.reviewCardDate}>Date: {date}</p>
    </div>
  );
};

export default ReviewCard;
