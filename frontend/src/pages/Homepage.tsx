import { Hero } from '../components/Hero';
import { SearchSection } from '../components/SearchSection';
import { MovieGrid } from '../components/MovieGrid';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <Hero />
      
      {/* Search Section */}
      <SearchSection />
      
      {/* Movie Grid Section */}
      <MovieGrid />
    </div>
  );
};