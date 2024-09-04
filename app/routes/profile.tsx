import React from 'react';
import Header from '../components/header/header'
import Profile from '../components/profile/profile'
const ProfilePage: React.FC = () => {
  // Sample data, replace with actual data from state or props
  const username = 'JohnDoe';
  const reviewsCount = 42;
  const level = 4;

  return (
    <div>
      <Header />
      <Profile username={username} reviewsCount={reviewsCount} level={level} />
    </div>
  );
};

export default ProfilePage;