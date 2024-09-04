// @ts-ignore
import React from 'react';
import { useParams } from 'react-router-dom';

export default function GamePage() {
  const { gameId } = useParams();

  return (
    <div>
      <h1>Game Details for {gameId}</h1>
      {/* Detailed game information and reviews will go here */}
    </div>
  );
}
