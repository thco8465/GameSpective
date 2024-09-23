import React, { useState } from 'react';
import AddReview from '../components/AddReview/reviewForm'; // Adjust path as needed
import SearchBar from '../components/searchBar/searchBar';
import Header from '../components/header/header';
import Title from '../components/Title/title';
import Layout from '../components/layout/layout';
interface Game {
  gameId: string;
  title: string;
  cover: string;
}

const AddReviewPage: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const handleGameSelect = (game: Game | null) => {
    //console.log('Selected game in Parent:', game); // Log selected game
    setSelectedGame(game);
  };
  return (
    <div>
      <Title />
      <Header />
      <Layout>
        <SearchBar onGameSelect={handleGameSelect} />
        <AddReview selectedGame={selectedGame} />
      </Layout>
    </div>
  );
};

export default AddReviewPage;