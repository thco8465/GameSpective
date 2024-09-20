import React from 'react';
import Profile from '../components/profile/profile'; // Adjust path as needed
import Title from '../components/Title/title';
import Header from '../components/header/header';
import Layout from '../components/layout/layout';
export default function ProfilePage() {
  return (
    <div>
      <Title />
      <Header />
      <Layout>
        <Profile />
      </Layout>
    </div>
  )
}
