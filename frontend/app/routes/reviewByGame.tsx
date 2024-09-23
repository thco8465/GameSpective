import GameSearch from '../components/searchBar/gameSearch';
import Title from '../components/Title/title';
import Header from '../components/header/header';
import React from 'react';
import Layout from '../components/layout/layout';
export default function gameSearchPage() {
  return (
    <div>
      <Title />
      <Header />
      <Layout>
        <GameSearch />;
      </Layout>
    </div>
  )
}