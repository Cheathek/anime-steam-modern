import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Star, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jikanApi } from '../services/jikanApi';
import { Loading } from './ui/Loading';

interface SearchBarProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function SearchBar({ isOpen, onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trending, setTrending] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      if (trending.length === 0) {
        loadTrending();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (query.trim()) {
        searchAnime(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const loadTrending = async () => {
    try {
      const response = await jikanApi.getTopAnime('tv', 'airing', 1);
      setTrending(response.data.slice(0, 6));
    } catch (error) {
      console.error('Failed to load trending anime:', error);
    }
  };

  const searchAnime = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await jikanApi.searchAnime(searchQuery);
      const deduplicatedResults = jikanApi.deduplicateAnime(response.data ?? []);
      setResults(deduplicatedResults.slice(0, 8));
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnimeClick = (animeId: number) => {
    navigate(`/anime/${animeId}`);
    onClose();
    setQuery('');
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'Currently Airing': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Finished Airing': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Not yet aired': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };

    return colors[status as keyof typeof colors] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      'TV': 'bg-primary-500/20 text-primary-400 border-primary-500/30',
      'Movie': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'OVA': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
      'ONA': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    };

    return colors[type as keyof typeof colors] || 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="max-w-2xl mx-auto mt-20 px-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-full">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for anime..."
                className="capitalize w-full pl-10 pr-12 py-4 bg-slate-900/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={onClose}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-slate-400 hover:text-white transition-colors" />
              </button>
            </div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-slate-900/90 backdrop-blur-sm border border-slate-700 rounded-xl max-h-96 overflow-hidden"
            >
              {/* Custom Scrollbar Container */}
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {(() => {
                  if (isLoading) {
                    return (
                      <div className="p-8">
                        <Loading text="Searching..." />
                      </div>
                    );
                  }

                  if (query && results.length > 0) {
                    return (
                      <div className="p-2">
                        {results.map((anime, index) => {
                          let statusLabel = 'Finished';
                          if (anime.status === 'Currently Airing') {
                            statusLabel = 'Airing';
                          } else if (anime.status === 'Not yet aired') {
                            statusLabel = 'Upcoming';
                          }
                          // Prefer English title, fallback to romanized Japanese
                          const displayTitle = anime.title_english ?? anime.title;
                          return (
                            <motion.button
                              key={anime.mal_id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              onClick={() => handleAnimeClick(anime.mal_id)}
                              className="w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-800/50 transition-colors text-left group"
                            >
                              {/* Anime Poster */}
                              <img
                                src={anime.images?.jpg?.image_url ?? anime.images?.jpg?.small_image_url}
                                alt={displayTitle}
                                className="w-12 h-16 object-cover rounded-md flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
                                loading="lazy"
                              />

                              {/* Main Content */}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-white font-medium truncate group-hover:text-primary-300 transition-colors">
                                  {displayTitle}
                                </h3>

                                {/* Badges */}
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusBadge(anime.status)}`}>
                                    {statusLabel}
                                  </span>
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getTypeBadge(anime.type)}`}>
                                    {anime.type}
                                  </span>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center space-x-3 mt-2 text-sm text-slate-400">
                                  {anime.score && (
                                    <span className="flex items-center space-x-1">
                                      <Star className="w-3 h-3 fill-current text-yellow-400" />
                                      <span>{anime.score}</span>
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
                            </motion.button>
                          );
                        })}
                      </div>
                    );
                  }

                  if (query && !isLoading) {
                    return (
                      <div className="p-8 text-center text-slate-400">
                        <Search className="w-8 h-8 mx-auto mb-4 text-primary-400" />
                        <h3 className="text-lg font-semibold text-white mb-2">No Results Found</h3>
                        "{query}"
                      </div>
                    );
                  }

                  if (!query && trending.length > 0) {
                    return (
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-white mb-3">Trending Now</h3>
                        <div className="space-y-2">
                          {trending.map((anime, index) => {
                            const displayTitle = anime.title_english ?? anime.title;
                            return (
                              <motion.button
                                key={anime.mal_id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleAnimeClick(anime.mal_id)}
                                className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-800/50 transition-colors text-left group"
                              >
                                <Search className="w-4 h-4 text-primary-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                <span className="text-slate-300 hover:text-white transition-colors truncate">
                                  {displayTitle}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

                  return null;
                })()}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(139, 92, 246, 0.5) rgba(30, 41, 59, 0.3);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.3);
          border-radius: 4px;
          margin: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(139, 92, 246, 0.8) 0%, rgba(124, 58, 237, 0.6) 100%);
          border-radius: 4px;
          border: 1px solid rgba(139, 92, 246, 0.2);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(139, 92, 246, 1) 0%, rgba(124, 58, 237, 0.8) 100%);
          box-shadow: 0 0 8px rgba(139, 92, 246, 0.3);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: linear-gradient(180deg, rgba(124, 58, 237, 1) 0%, rgba(109, 40, 217, 0.9) 100%);
        }
        
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
    </AnimatePresence>
  );
}