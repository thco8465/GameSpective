import React from 'react';
import Home from '../components/home/home'; // Adjust path as needed
import Header from '../components/header/header';
import Title from '../components/Title/title';
export default function HomePage() {
  return(
    <div>
      <Title/>
      <Header/>
      <Home />
    </div>
  ) 
}
