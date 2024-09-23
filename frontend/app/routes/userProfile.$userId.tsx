import React from 'react';
import UserProfile from '../components/profile/userProfile'; // Adjust path as needed
import Title from '../components/Title/title';
import Header from '../components/header/header';
import Layout from '../components/layout/layout';
import {useParams} from '@remix-run/react';
export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>(); // Type the params
  const userIdNumber = userId ? parseInt(userId, 10) : undefined;

  return (
    <div>
      <Title />
      <Header />
      <Layout>
        {userIdNumber !== undefined ? (
          <UserProfile userId={userIdNumber} />
        ) : (
          <p>User not found</p> // Handle the case where userId is undefined
        )}
      </Layout>
    </div>
  );
}