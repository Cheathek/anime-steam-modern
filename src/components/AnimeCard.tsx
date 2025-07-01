import React from 'react';
import { motion } from 'framer-motion';
import { Star, Calendar, Play, Plus } from 'lucide-react';
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
}

export function AnimeCard({ anime, showDetails = true, className = '' }: AnimeCardProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Currently Airing': return 'bg-green-500';
      case 'Finished Airing': return 'bg-blue-500';
      case 'Not yet aired': return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className={`group relative ${className}`}
    >
      <Card className="overflow-hidden p-0 h-full">
        {/* Image Container */}
        <div className="relative aspect-[2/3] overflow-hidden bg-slate-800">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-800 animate-pulse" />
          )}
          
          <img
            src={anime.images?.jpg?.image_url || anime.images?.jpg?.large_image_url}
            alt={anime.title}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } group-hover:scale-110`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = anime.images?.jpg?.small_image_url || '/placeholder-anime.jpg';
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Status Badge */}
          {anime.status && (
            <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(anime.status)}`}>
              {anime.status === 'Currently Airing' ? 'Airing' : 
               anime.status === 'Not yet aired' ? 'Upcoming' : 'Finished'}
            </div>
          )}

          {/* Rating Badge */}
          {anime.score && (
            <div className="absolute top-2 right-2 flex items-center space-x-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
              <Star className="w-3 h-3 fill-current text-yellow-400" />
              <span className="text-xs font-medium text-white">{anime.score}</span>
            </div>
          )}

          {/* Hover Actions */}
          <div className="absolute inset-0 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Link to={`/anime/${anime.mal_id}`}>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center space-x-1 bg-primary-600 hover:bg-primary-500 text-white px-3 py-2 rounded-lg font-medium transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Details</span>
              </motion.button>
            </Link>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-1 bg-slate-800/80 hover:bg-slate-700/80 text-white px-3 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </motion.button>
          </div>
        </div>

        {/* Content */}
        {showDetails && (
          <div className="p-4">
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
                  <span className="px-2 py-0.5 bg-slate-700 text-slate-400 text-xs rounded-full">
                    +{anime.genres.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </Card>
    </motion.div>
  );
}