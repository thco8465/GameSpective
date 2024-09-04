import React from 'react';
import ReviewForm from '~/components/AddReview/reviewForm'; // Adjust the import path as necessary
const AddReview: React.FC = () => {
  return (
    <div>
      <h1>Add a New Review</h1>
      <ReviewForm />
    </div>
  );
};

export default AddReview;