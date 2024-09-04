import GameCard from '~/components/GameCard/gameCard'; // Adjust the path if needed
import Header from '../header/header';
import styles from './home.module.css';
import React, { useEffect, useState } from 'react';

// Dummy data for recently published reviews
const dummyReviews = [
  { id: '1', title: 'Game One', coverImage: 'Nada', rating: 4, review: 'Great game, lots of fun!' },
  { id: '2', title: 'Game Two', coverImage: 'Nada', rating: 3, review: 'Decent game but could be better.' },
  { id: '3', title: 'Game Three', coverImage: 'Nada', rating: 5, review: 'Amazing experience, highly recommend!' },
  { id: '1', title: 'Game One', coverImage: 'Nada', rating: 4, review: 'Great game, lots of fun!' },
  { id: '2', title: 'Game Two', coverImage: 'Nada', rating: 3, review: 'Decent game but could be better.' },
  { id: '3', title: 'Game Three', coverImage: 'Nada', rating: 5, review: 'Amazing experience, highly recommend!' },
  { id: '1', title: 'Game One', coverImage: 'Nada', rating: 4, review: 'Great game, lots of fun!' },
  { id: '2', title: 'Game Two', coverImage: 'Nada', rating: 3, review: 'Decent game but could be better.' },
  { id: '3', title: 'Game Three', coverImage: 'Nada', rating: 5, review: 'Amazing experience, highly recommend!' },
  { id: '1', title: 'Game One', coverImage: 'Nada', rating: 4, review: 'Great game, lots of fun!' },
  { id: '2', title: 'Game Two', coverImage: 'Nada', rating: 3, review: 'Decent game but could be better.' },
  { id: '3', title: 'Game Three', coverImage: 'Nada', rating: 5, review: 'Amazing experience, highly recommend!' },
  // Add more dummy reviews as needed
];

export default function Home() {
  const [reviews, setReviews] = useState(dummyReviews);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreReviews = () => {
    if (loading || !hasMore) return;

    setLoading(true);
    // Simulate an API call to fetch more reviews 
    setTimeout(() => {
      const moreReviews = [
        { id: '4', title: 'Game Four', coverImage: 'Nada', rating: 4, review: 'Great game, lots of fun!' },
        { id: '5', title: 'Game Five', coverImage: 'Nada', rating: 3, review: 'Decent game but could be better.' },
        { id: '6', title: 'Game Six', coverImage: 'Nada', rating: 5, review: 'Amazing experience, highly recommend!' },
      ];
      setReviews(prevReviews => [...prevReviews, ...moreReviews]);
      setLoading(false);
      // Update `hasMore` based on the fetched reviews
      setHasMore(false); // Adjust this based on real API response
    }, 1000); // Simulating an API call
  };

  useEffect(() => {
    const handleScroll = () => {
      const bottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight;
      if (bottom) {
        loadMoreReviews();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div>
      <header>
        <h1 className={styles.title}>GameSpective</h1>
      </header>
      <Header />
      <section>
        <div className={styles['game-card-container']}>
          {reviews.map(game => (
            <GameCard
              key={game.id}
              title={game.title}
              coverImage={game.coverImage}
              rating={game.rating}
              review={game.review}
            />
          ))}
        </div>
        {!hasMore && !loading && <p>No more recent reviews</p>}
        {loading && <p>Loading more reviews...</p>}
      </section>
    </div>
  );
}
