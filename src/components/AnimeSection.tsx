import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimeCard } from './AnimeCard';
import { SkeletonCard } from './ui/Loading';

interface AnimeSectionProps {
  title: string;
  anime: any[];
  isLoading?: boolean;
  linkTo?: string;
  linkText?: string;
}

export function AnimeSection({ 
  title, 
  anime, 
  isLoading = false, 
  linkTo, 
  linkText = 'View All' 
}: AnimeSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
    const newScrollLeft = scrollContainerRef.current.scrollLeft + 
      (direction === 'right' ? scrollAmount : -scrollAmount);

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-white"
          >
            <span className="bg-gradient-to-r from-primary-400 to-primary-500 bg-clip-text text-transparent">
              {title}
            </span>
          </motion.h2>

          {linkTo && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Link
                to={linkTo}
                className="flex items-center space-x-1 text-primary-400 hover:text-primary-300 transition-colors font-medium group"
              >
                <span>{linkText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="relative">
          {/* Navigation Buttons */}
          {!isLoading && anime.length > 0 && (
            <>
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full text-white transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-x-4 hover:translate-x-0"
                style={{ transform: 'translate(-50%, -50%)' }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm rounded-full text-white transition-all duration-200 opacity-0 group-hover:opacity-100 translate-x-4 hover:translate-x-0"
                style={{ transform: 'translate(50%, -50%)' }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Anime Grid */}
          <div className="group">
            <div
              ref={scrollContainerRef}
              className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {isLoading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="flex-shrink-0 w-48">
                    <SkeletonCard />
                  </div>
                ))
              ) : anime.length > 0 ? (
                anime.map((animeItem, index) => (
                  <motion.div
                    key={animeItem.mal_id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-shrink-0 w-48"
                  >
                    <AnimeCard anime={animeItem} />
                  </motion.div>
                ))
              ) : (
                <div className="w-full text-center py-12 text-slate-400">
                  No anime found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}