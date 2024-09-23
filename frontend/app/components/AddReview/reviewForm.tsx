import React, { useState, useEffect } from 'react';
import styles from './reviewForm.module.css'; // Custom CSS module


interface ReviewFormData {
  gameId: string | null;
  game_name: string;
  review: string;
  timeSpent: string;
  rating: number;
  date: string | null;
  userId: number | null; // Add userId to form data
}
interface InDepthData {
  review_id: number;
  high: string;
  low: string;
  atmosphere: number;
  story: number;
  dev_note: string;
  gameplay: number;
  difficulty: number;
}

interface Game {
  gameId: string;
  title: string;
  cover: string;
}

interface Props {
  selectedGame: Game | null;
}
const ReviewForm: React.FC<Props> = ({ selectedGame }) => {
  const [formData, setFormData] = useState<ReviewFormData>({
    gameId: selectedGame?.gameId || '',
    game_name: selectedGame?.title || '',
    review: '',
    timeSpent: '',
    rating: 1,
    date: new Date().toISOString().split('T')[0],
    userId: null,
  });
  const [inDepth, setInDepth] = useState<InDepthData>({
    review_id: 0,
    high: '',
    low: '',
    atmosphere: 1,
    story: 1,
    dev_note: '',
    gameplay: 1,
    difficulty: 1,
  })
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async (): Promise<number | null> => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/me`, {
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
        return data.id;
      } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
      }
    };

    const initializeFormData = async () => {
      const test = await fetchUserData();
      //console.log('Initial user data:', test);
      if (test) {
        setFormData(prevState => ({
          ...prevState,
          userId: test, // Set userId in form data
        }));
      }
    };
    initializeFormData();
  }, []);
  useEffect(() => {
    if (selectedGame) {
      console.log('Selected game in useEffect:', selectedGame);
      setFormData(prevState => ({
        ...prevState,
        gameId: selectedGame.gameId,
        game_name: selectedGame.title,
      }));
      console.log(formData.gameId);
    }
  }, [selectedGame]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [id]: id === 'rating' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    if (formData.rating < 1 || formData.rating > 10) {
      alert('Rating must be between 1 and 10');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/review/review`, { // Ensure this matches your backend route
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'bypass-tunnel-reminder': 'true'
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log('Form data submitted successfully:', result);

      //Get id of review just submitted
      const reviewId = result.id;

      setInDepth((prevState) => ({
        ...prevState,
        review_id: reviewId,
      }));

      const inDepthResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/review/review/in-depth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'bypass-tunnel-reminder': ' true',
        },
        body: JSON.stringify({ ...inDepth, review_id: reviewId }),
      });
      if (!inDepthResponse.ok) {
        throw new Error('Failed to submit in-depth review');
      }
      console.log('In-depth review submitted successfully: ', inDepthResponse);

      await fetch(`${import.meta.env.VITE_API_URL}/api/user/reviewCount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'bypass-tunnel-reminder': 'true',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      //If successful review post, add exp
      const expIncrease = 10;
      await fetch(`${import.meta.env.VITE_API_URL}/api/user/exp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'bypass-tunnel-reminder': 'true',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ exp: expIncrease }),
      })
      // Reset form
      setFormData(prevState => ({
        ...prevState,
        gameId: null,
        game_name: '',
        review: '',
        timeSpent: '',
        rating: 1,
        date: new Date().toISOString().split('T')[0],
      }));

    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.reviewCard}>
        <h3 className={styles.title}>Add Your Review</h3>
        <form onSubmit={handleSubmit} className={styles.reviewForm}>
          <div className={styles.formGroup}>
            <label htmlFor="review">Your Review</label>
            <textarea
              id="review"
              rows={4}
              value={formData.review}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="high">High Point</label>
            <input
              id="high"
              type="text"
              value={inDepth.high}
              onChange={(e) =>
                setInDepth((prevState) => ({ ...prevState, high: e.target.value }))
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="low">Low Point</label>
            <input
              id="low"
              type="text"
              value={inDepth.low}
              onChange={(e) =>
                setInDepth((prevState) => ({ ...prevState, low: e.target.value }))
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="atmosphere">Atmosphere (1-10)</label>
            <input
              id="atmosphere"
              type="number"
              min="1"
              max="10"
              value={inDepth.atmosphere}
              onChange={(e) =>
                setInDepth((prevState) => ({
                  ...prevState,
                  atmosphere: Number(e.target.value),
                }))
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="story">Story (1-10)</label>
            <input 
              id="story"
              type="number"
              min="1"
              max="10"
              value={inDepth.story}
              onChange={(e) => 
                setInDepth((prevState) => ({
                  ...prevState,
                  story: Number(e.target.value),
                }))
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="story">Gameplay (1-10)</label>
            <input 
              id="gameplay"
              type="number"
              min="1"
              max="10"
              value={inDepth.gameplay}
              onChange={(e) => 
                setInDepth((prevState) => ({
                  ...prevState,
                  gameplay: Number(e.target.value),
                }))
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="story">Difficulty (1-10)</label>
            <input 
              id="difficulty"
              type="number"
              min="1"
              max="10"
              value={inDepth.difficulty}
              onChange={(e) => 
                setInDepth((prevState) => ({
                  ...prevState,
                  difficulty: Number(e.target.value),
                }))
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="low">Note to Developer</label>
            <input
              id="dev_note"
              type="text"
              value={inDepth.dev_note}
              onChange={(e) =>
                setInDepth((prevState) => ({ ...prevState, dev_note: e.target.value }))
              }
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="rating">Overall rating (1-10)</label>
            <input
              id="rating"
              type="number"
              min="1"
              max="10"
              value={formData.rating}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="timeSpent">Time Spent (hours)</label>
            <input
              id="timeSpent"
              type="number"
              min="0"
              step="0.1"
              value={formData.timeSpent}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={formData.date || ''}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Submit Review
          </button>
        </form>
        {loading && <div className={styles.spinner}>Loading...</div>}
      </div>
    </>
  );
};

export default ReviewForm;
