import React from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from './ui/Card';

interface AnimeCardProps {
  anime: {
    mal_id: number;
    title: string;
    images: {
      jpg: {
        image_url: string;
        small_image_url: string;
        large_image_url: string;
      };
    };
    score?: number;
    year?: number;
    status?: string;
    type?: string;
    genres?: Array<{ name: string }>;
    rating?: string;
  };
  showDetails?: boolean;
  className?: string;
  animationDelay?: number;
}

export function AnimeCard({
  anime,
  showDetails = true,
  className = '',
  animationDelay = 0
}: Readonly<AnimeCardProps>) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Currently Airing': return 'bg-green-500';
      case 'Finished Airing': return 'bg-blue-500';
      case 'Not yet aired': return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };

  let statusLabel = 'Finished';
  if (anime.status === 'Currently Airing') {
    statusLabel = 'Airing';
  } else if (anime.status === 'Not yet aired') {
    statusLabel = 'Upcoming';
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: animationDelay * 0.05 }
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      className={`group relative ${className}`}
      style={{ borderRadius: '12px', overflow: 'hidden' }}
    >
      <Link to={`/anime/${anime.mal_id}`} className="block h-full">
        <Card className="h-full bg-transparent">
          {/* Image Container */}
          <div className="relative aspect-[2/3] bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
            {/* Loading Skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-[length:200%_100%] animate-shimmer rounded-t-xl" />
            )}

            {/* Anime Image */}
            <motion.img
              src={anime.images?.jpg?.image_url || anime.images?.jpg?.large_image_url}
              alt={anime.title}
              className={`w-full h-full object-cover rounded-t-2xl ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = anime.images?.jpg?.small_image_url || '/placeholder-anime.jpg';
              }}
              style={{
                transformOrigin: 'center center',
                willChange: 'transform'
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 transition-opacity duration-300 rounded-t-xl z-0" />

            {/* Status Badge */}
            {anime.status && (
              <motion.div
                className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(anime.status)} z-20 shadow-md`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                {statusLabel}
              </motion.div>
            )}

            {/* Rating Badge */}
            {anime.score && (
              <motion.div
                className="absolute top-2 right-2 flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full z-20 shadow-md"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15 }}
              >
                <Star className="w-3 h-3 fill-current text-yellow-400" />
                <span className="text-xs font-medium text-white">{anime.score.toFixed(1)}</span>
              </motion.div>
            )}
          </div>

          {/* Content */}
          {showDetails && (
            <div className="p-4 bg-slate-900/50 rounded-b-xl">
              <h3 className="font-semibold text-white text-sm mb-2 line-clamp-2 leading-tight">
                {anime.title}
              </h3>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  {anime.type && (
                    <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">
                      {anime.type}
                    </span>
                  )}
                  {anime.year && (
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{anime.year}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Genres */}
              {anime.genres && anime.genres.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {anime.genres.slice(0, 2).map((genre) => (
                    <span
                      key={genre.name}
                      className="px-2 py-0.5 bg-primary-500/20 text-primary-300 text-xs rounded-full"
                    >
                      {genre.name}
                    </span>
                  ))}
                  {anime.genres.length > 2 && (
                    <span
                      className="px-2 py-0.5 bg-slate-700 text-slate-400 text-xs rounded-full"
                    >
                      +{anime.genres.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </Card>
      </Link>
    </motion.div>
  );
}