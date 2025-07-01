import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';
import { jikanApi } from '../services/jikanApi';
import { AnimeCard } from '../components/AnimeCard';
import { Loading, SkeletonCard } from '../components/ui/Loading';
import { Button } from '../components/ui/Button';

interface FilterState {
  status: string;
  type: string;
  genre: string;
  year: string;
  score: string;
}

export function CategoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [anime, setAnime] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [genres, setGenres] = useState<any[]>([]);
  
  const [filters, setFilters] = useState<FilterState>({
    status: searchParams.get('status') || '',
    type: searchParams.get('type') || '',
    genre: searchParams.get('genre') || '',
    year: searchParams.get('year') || '',
    score: searchParams.get('score') || '',
  });

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/top')) return 'Top Anime';
    if (path.includes('/seasonal')) return 'Seasonal Anime';
    if (path.includes('/movies')) return 'Anime Movies';
    if (path.includes('/browse')) return 'Browse Anime';
    return 'Anime Collection';
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'airing', label: 'Currently Airing' },
    { value: 'complete', label: 'Finished Airing' },
    { value: 'upcoming', label: 'Not Yet Aired' },
  ];

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'tv', label: 'TV Series' },
    { value: 'movie', label: 'Movies' },
    { value: 'ova', label: 'OVA' },
    { value: 'ona', label: 'ONA' },
    { value: 'special', label: 'Specials' },
  ];

  const scoreOptions = [
    { value: '', label: 'Any Score' },
    { value: '9', label: '9.0+ Excellent' },
    { value: '8', label: '8.0+ Very Good' },
    { value: '7', label: '7.0+ Good' },
    { value: '6', label: '6.0+ Fine' },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: '', label: 'Any Year' },
    ...Array.from({ length: 20 }, (_, i) => {
      const year = currentYear - i;
      return { value: year.toString(), label: year.toString() };
    }),
  ];

  useEffect(() => {
    loadGenres();
  }, []);

  useEffect(() => {
    setPage(1);
    loadAnime(1, true);
  }, [filters, location.pathname]);

  useEffect(() => {
    if (page > 1) {
      loadAnime(page, false);
    }
  }, [page]);

  const loadGenres = async () => {
    try {
      const response = await jikanApi.getGenres();
      setGenres(response.data || []);
    } catch (error) {
      console.error('Failed to load genres:', error);
    }
  };

  const loadAnime = async (pageNum: number, replace = false) => {
    if (!replace && !hasNextPage) return;

    setIsLoading(replace);

    try {
      const path = location.pathname;
      let response;

      if (path.includes('/top')) {
        const type = filters.type || (path.includes('/movies') ? 'movie' : undefined);
        const filter = searchParams.get('filter') || undefined;
        response = await jikanApi.getTopAnime(type, filter, pageNum);
      } else if (path.includes('/seasonal')) {
        if (searchParams.get('upcoming') === 'true') {
          response = await jikanApi.getUpcomingAnime();
        } else {
          response = await jikanApi.getSeasonalAnime();
        }
      } else if (path.includes('/movies')) {
        response = await jikanApi.getTopAnime('movie', undefined, pageNum);
      } else {
        // Browse with filters
        const params: any = {};
        if (filters.status) params.status = filters.status;
        if (filters.type) params.type = filters.type;
        if (filters.genre) params.genres = filters.genre;
        if (filters.year) params.start_date = `${filters.year}-01-01`;
        if (filters.score) params.min_score = filters.score;
        params.page = pageNum;

        response = await jikanApi.searchAnime('', params);
      }

      const newAnime = response.data || [];
      
      if (replace) {
        setAnime(newAnime);
      } else {
        setAnime(prev => [...prev, ...newAnime]);
      }
      
      setHasNextPage(response.pagination?.has_next_page || false);
    } catch (error) {
      console.error('Failed to load anime:', error);
      if (replace) setAnime([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFilters = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const clearFilters = () => {
    const newFilters = { status: '', type: '', genre: '', year: '', score: '' };
    setFilters(newFilters);
    setSearchParams({});
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-bold text-black dark:text-white"
          >
            <span className="bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-400 dark:to-primary-500 bg-clip-text text-transparent">
              {getPageTitle()}
            </span>
          </motion.h1>

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="relative"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-100 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => updateFilters('status', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => updateFilters('type', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {typeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Genre Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Genre</label>
                <select
                  value={filters.genre}
                  onChange={(e) => updateFilters('genre', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">All Genres</option>
                  {genres.map(genre => (
                    <option key={genre.mal_id} value={genre.mal_id}>
                      {genre.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Year</label>
                <select
                  value={filters.year}
                  onChange={(e) => updateFilters('year', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {yearOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Score Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Min Score</label>
                <select
                  value={filters.score}
                  onChange={(e) => updateFilters('score', e.target.value)}
                  className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {scoreOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters & Clear */}
            {activeFilterCount > 0 && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-4">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, value]) => {
                    if (!value) return null;
                    
                    let label = value;
                    if (key === 'genre' && genres.length > 0) {
                      const genre = genres.find(g => g.mal_id.toString() === value);
                      if (genre) label = genre.name;
                    }

                    return (
                      <span
                        key={key}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-500/20 text-primary-300 text-sm rounded-full border border-primary-500/30"
                      >
                        {label}
                        <button
                          onClick={() => updateFilters(key as keyof FilterState, '')}
                          className="hover:text-primary-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
                
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* Results Count */}
        {anime.length > 0 && !isLoading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-500 dark:text-slate-400 mb-6"
          >
            Showing {anime.length} anime
          </motion.p>
        )}

        {/* Anime Grid */}
        {isLoading && anime.length === 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 18 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : anime.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            >
              {anime.map((animeItem, index) => (
                <motion.div
                  key={animeItem.mal_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AnimeCard anime={animeItem} />
                </motion.div>
              ))}
            </motion.div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center mt-12">
                <Button
                  onClick={() => setPage(prev => prev + 1)}
                  isLoading={isLoading}
                  size="lg"
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No anime found matching your criteria</p>
            {activeFilterCount > 0 && (
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}