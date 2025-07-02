import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Calendar, Star, Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jikanApi } from '../services/jikanApi';
import { formatDistanceToNow } from 'date-fns';
import { Button } from './ui/Button';
import { Loading } from './ui/Loading';

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [upcomingAnime, setUpcomingAnime] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const dragStartX = useRef<number | null>(null);

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % upcomingAnime.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + upcomingAnime.length) % upcomingAnime.length);
  };

  const getCountdownText = (airingDate: string) => {
    if (!airingDate) return null;
    try {
      const date = new Date(airingDate);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return null;
    }
  };

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    dragStartX.current =
      'touches' in e
        ? e.touches[0].clientX
        : e.clientX;
  };

  const handleDragEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (dragStartX.current === null) return;
    const endX =
      'changedTouches' in e
        ? e.changedTouches[0].clientX
        : e.clientX;
    const diff = endX - dragStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    dragStartX.current = null;
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

  const currentAnime = upcomingAnime[currentSlide];

  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={currentAnime.images?.jpg?.large_image_url}
              alt={currentAnime.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent dark:from-black/80 dark:via-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent dark:from-black/60" />
          </div>

          {/* Content */}
          <input
            type="range"
            min={1}
            max={upcomingAnime.length}
            value={currentSlide + 1}
            onChange={e => setCurrentSlide(Number(e.target.value) - 1)}
            className="relative h-full w-full flex items-center touch-pan-x select-none cursor-grab accent-primary-500"
            aria-label="Upcoming anime carousel"
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            style={{ zIndex: 2, position: 'absolute', top: 0, left: 0, opacity: 0, height: '100%' }}
          />
          <div
            className="relative h-full flex items-center touch-pan-x select-none cursor-grab"
            style={{ pointerEvents: 'none' }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="space-y-6"
                >
                  {/* Status Badge */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="inline-flex items-center space-x-2 bg-purple-100/60 dark:bg-purple-600/20 backdrop-blur-sm border border-purple-300/30 dark:border-purple-500/30 px-4 py-2 rounded-full"
                  >
                    <Clock className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    <span className="text-purple-500 dark:text-purple-300 font-medium">Upcoming</span>
                  </motion.div>

                  {/* Title */}
                  <h1 className="text-4xl md:text-6xl font-bold text-black dark:text-white leading-tight">
                    <span className="bg-gradient-to-r from-black to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                      {currentAnime.title}
                    </span>
                  </h1>

                  {/* Metadata */}
                  <div className="flex items-center space-x-6 text-slate-700 dark:text-slate-300">
                    {currentAnime.score && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-current text-yellow-400" />
                        <span className="font-medium">{currentAnime.score}</span>
                      </div>
                    )}

                    {currentAnime.type && (
                      <span className="px-3 py-1 bg-slate-800/60 backdrop-blur-sm rounded-full text-sm font-medium">
                        {currentAnime.type}
                      </span>
                    )}

                    {currentAnime.aired?.from && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(currentAnime.aired.from).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Countdown */}
                  {currentAnime.aired?.from && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="bg-gradient-to-r from-primary-600/20 to-primary-500/20 backdrop-blur-sm border border-primary-500/30 rounded-lg p-4"
                    >
                      <p className="text-primary-300 font-medium">
                        Premieres {getCountdownText(currentAnime.aired.from)}
                      </p>
                    </motion.div>
                  )}

                  {/* Synopsis */}
                  {currentAnime.synopsis && (
                    <p className="text-slate-300 text-lg leading-relaxed line-clamp-3 max-w-xl">
                      {currentAnime.synopsis}
                    </p>
                  )}

                  {/* Genres */}
                  {currentAnime.genres && currentAnime.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {currentAnime.genres.slice(0, 4).map((genre: any) => (
                        <span
                          key={genre.mal_id}
                          className="px-3 py-1 bg-slate-800/60 backdrop-blur-sm text-slate-300 text-sm rounded-full"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center space-x-4 pt-4">
                    <Link to={`/anime/${currentAnime.mal_id}`}>
                      <Button size="lg" className="bg-gradient-to-r from-primary-600 to-primary-500">
                        <Play className="w-5 h-5 mr-2" />
                        Details
                      </Button>
                    </Link>

                    <Button variant="outline" size="lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Watchlist
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Play/Pause */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute bottom-20 right-4 z-10 p-3 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white transition-all duration-200"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
        {upcomingAnime.map((anime, index) => (
          <button
            key={anime.mal_id}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide
              ? 'bg-primary-500 w-8'
              : 'bg-white/30 hover:bg-white/50'
              }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
        <motion.div
          className="h-full bg-gradient-to-r from-primary-500 to-primary-400"
          initial={{ width: '0%' }}
          animate={{ width: isPlaying ? '100%' : '0%' }}
          transition={{ duration: 5, ease: 'linear' }}
          key={`${currentSlide}-${isPlaying}`}
        />
      </div>
    </div>
  );
}