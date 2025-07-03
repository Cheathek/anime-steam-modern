import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { Button } from './ui/Button';
import { formatDistanceToNow } from 'date-fns';

export function HeroBanner({
  animeList,
  currentSlide,
  setCurrentSlide,
  isPlaying,
  setIsPlaying,
}: Readonly<{
  animeList: any[];
  currentSlide: number;
  setCurrentSlide: (idx: number) => void;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
}>) {
  const dragStartX = useRef<number | null>(null);
  const currentAnime = animeList[currentSlide];

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
        setCurrentSlide((currentSlide + 1) % animeList.length);
      } else {
        setCurrentSlide((currentSlide - 1 + animeList.length) % animeList.length);
      }
    }
    dragStartX.current = null;
  };

  return (
    <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] overflow-hidden">
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

          {/* Touch Controls */}
          <button
            type="button"
            className="absolute inset-0 touch-pan-y select-none bg-transparent border-none p-0 m-0"
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onKeyDown={e => {
              if (e.key === 'ArrowLeft') {
                setCurrentSlide((currentSlide - 1 + animeList.length) % animeList.length);
              } else if (e.key === 'ArrowRight') {
                setCurrentSlide((currentSlide + 1) % animeList.length);
              }
            }}
            aria-label="Slide navigation area"
            tabIndex={0}
            style={{ outline: 'none' }}
          />

          {/* Content */}
          <div className="relative h-full flex items-end pb-8 sm:items-center sm:pb-0">
            <div className="container px-4 mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-xl space-y-3 sm:space-y-4"
              >
                {/* Status Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center space-x-1.5 bg-purple-100/60 dark:bg-purple-600/20 backdrop-blur-sm border border-purple-300/30 dark:border-purple-500/30 px-3 py-1 rounded-full text-xs sm:text-sm"
                >
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 dark:text-purple-400" />
                  <span className="text-purple-500 dark:text-purple-300 font-medium">Upcoming</span>
                </motion.div>

                {/* Title */}
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white leading-tight">
                  <span className="bg-gradient-to-r from-black to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    {currentAnime.title}
                  </span>
                </h1>

                {/* Metadata - Simplified for mobile */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {currentAnime.score && (
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current text-yellow-400" />
                      <span>{currentAnime.score}</span>
                    </div>
                  )}

                  {currentAnime.type && (
                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-slate-800/60 backdrop-blur-sm rounded-full font-medium">
                      {currentAnime.type}
                    </span>
                  )}
                </div>

                {/* Countdown - Only show on larger screens */}
                {currentAnime.aired?.from && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="hidden sm:block bg-gradient-to-r from-primary-600/20 to-primary-500/20 backdrop-blur-sm border border-primary-500/30 rounded-lg p-3"
                  >
                    <p className="text-primary-300 text-sm font-medium">
                      Premieres {getCountdownText(currentAnime.aired.from)}
                    </p>
                  </motion.div>
                )}

                {/* Actions - Stacked on mobile */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2 sm:pt-4">
                  <Link to={`/anime/${currentAnime.mal_id}`} className="w-full sm:w-auto">
                    <Button size="sm" className="w-full sm:w-auto text-sm sm:text-base bg-gradient-to-r from-primary-600 to-primary-500">
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                      Details
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Mobile Controls */}
      <div className="sm:hidden absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
        {animeList.map((anime, index) => (
          <button
            key={anime.mal_id ?? index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
              ? 'bg-primary-500 w-4'
              : 'bg-white/30'
              }`}
          />
        ))}
      </div>

      {/* Desktop Controls */}
      <div className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 space-x-2">
        {animeList.map((anime, index) => (
          <button
            key={anime.mal_id ?? index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${index === currentSlide
              ? 'bg-primary-500 w-6'
              : 'bg-white/30 hover:bg-white/50'
              }`}
          />
        ))}
      </div>

      {/* Play/Pause - Smaller on mobile */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-10 p-2 sm:p-3 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white transition-all"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <Play className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </button>

      {/* Progress Bar - Thinner on mobile */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-black/20">
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