import React from 'react';
import ReviewForm from '~/components/AddReview/reviewForm'; // Adjust the import path as necessary
import Header from '../components/header/header';

const AddReview: React.FC = () => {
  return (
    <div>
      <Header />
      <ReviewForm />
    </div>
  );
};

export default AddReview;