import UserSearch from '../components/searchBar/userSearch';
import Title from '../components/Title/title';
import Header from '../components/header/header'
import React from 'react';
import Layout from '../components/layout/layout'
export default function gameSearchPage() {
  return (
    <div>
      <Title />
      <Header />
      <Layout>
        <UserSearch />;
      </Layout>
    </div>
  )
}