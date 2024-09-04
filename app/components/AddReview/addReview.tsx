import React from 'react';
import {useState} from 'react';

export default function AddReview(){
    const [game,setGame] = useState('');
    const [review, setReview] = useState('');
    const [rating, setRating] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        //Todo: handle form submission save to database
    };
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Game Title: </label>
                <input
                    type="text"
                    value={game}
                    onChange={(e) => setGame(e.target.value)}
                />
            </div>
            <div>
                <label>Review:</label>
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
            </div>
            <div>
                <label>Rating: </label>
                <input
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                />
            </div>
            <button type="submit">Submit Review</button>
        </form>
    );
}