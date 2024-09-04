import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface ReviewFormData {
  gameName: string;
  review: string;
  timeSpent: string;
  rating: number;
  date: string;
}

const ReviewForm: React.FC = () => {
  const [formData, setFormData] = useState<ReviewFormData>({
    gameName: '',
    review: '',
    timeSpent: '',
    rating: 1, // Default to minimum rating
    date: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.rating < 1 || formData.rating > 5) {
      alert('Rating must be between 1 and 5');
      return;
    }
    console.log('Form data submitted:', formData);
    setFormData({
      gameName: '',
      review: '',
      timeSpent: '',
      rating: 1,
      date: new Date().toISOString().split('T')[0],
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add Your Review
      </Typography>
      <TextField
        fullWidth
        label="Name of Game"
        name="gameName"
        value={formData.gameName}
        onChange={handleChange}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Your Review"
        name="review"
        value={formData.review}
        onChange={handleChange}
        required
        margin="normal"
        multiline
        rows={4}
      />
      <TextField
        fullWidth
        type="number"
        label="Time Spent (hours)"
        name="timeSpent"
        value={formData.timeSpent}
        onChange={handleChange}
        required
        margin="normal"
        InputProps={{ inputProps: { min: 0, step: 0.1 } }}
      />
      <TextField
        fullWidth
        type="number"
        label="Rating (1-10)"
        name="rating"
        value={formData.rating}
        onChange={handleChange}
        required
        margin="normal"
        InputProps={{ inputProps: { min: 1, max: 10 } }}
      />
      <TextField
        fullWidth
        label="Date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        margin="normal"
        InputProps={{ readOnly: true }}
      />
      <Button variant="contained" color="primary" type="submit" sx={{ marginTop: 2 }}>
        Submit Review
      </Button>
    </Box>
  );
};

export default ReviewForm;
