import { useState, useEffect } from 'react';
import { jikanApi } from '../services/jikanApi';
import { Loading } from './ui/Loading';
import { HeroBanner } from './HeroBanner';

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [upcomingAnime, setUpcomingAnime] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUpcomingAnime();
  }, []);

  useEffect(() => {
    if (!isPlaying || upcomingAnime.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % upcomingAnime.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, upcomingAnime.length]);

  const loadUpcomingAnime = async () => {
    try {
      const response = await jikanApi.getUpcomingAnime();
      const animeWithDates = response.data
        .filter((anime: any) => anime.images?.jpg?.large_image_url)
        .slice(0, 10);
      setUpcomingAnime(animeWithDates);
    } catch (error) {
      console.error('Failed to load upcoming anime:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="relative h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <Loading size="lg" text="Loading upcoming anime..." />
      </div>
    );
  }

  if (upcomingAnime.length === 0) {
    return (
      <div className="relative h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">No upcoming anime found</p>
      </div>
    );
  }

  return (
    <HeroBanner
      animeList={upcomingAnime}
      currentSlide={currentSlide}
      setCurrentSlide={setCurrentSlide}
      isPlaying={isPlaying}
      setIsPlaying={setIsPlaying}
    />
  );
}