import GameCard from '~/components/GameCard/gameCard'; // Adjust the path if needed
import Header from './header';
// Dummy data for recently published reviews
const dummyReviews = [
  { id: '1', title: 'Game One', coverImage: 'Nada', rating: 4, review: 'Great game, lots of fun!' },
  { id: '2', title: 'Game Two', coverImage: 'Nada',rating: 3, review: 'Decent game but could be better.' },
  { id: '3', title: 'Game Three', coverImage: 'Nada',rating: 5, review: 'Amazing experience, highly recommend!' },
  // Add more dummy reviews as needed
];

export default function Home() {
  return (
    <div>
      <header>
        <h1>GameSpective</h1>
      </header>
      <Header />
      <section>
        <div className="game-card-container">
          {dummyReviews.map(game => (
            <GameCard
              key={game.id}
              title={game.title}
              coverImage={game.coverImage}
              rating={game.rating}
              review={game.review}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
