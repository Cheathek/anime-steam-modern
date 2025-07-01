import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import { AnimeSection } from '../components/AnimeSection';
import { jikanApi } from '../services/jikanApi';

export function HomePage() {
  const [sections, setSections] = useState({
    seasonal: { data: [], loading: true },
    topAiring: { data: [], loading: true },
    topMovies: { data: [], loading: true },
    upcoming: { data: [], loading: true },
  });

  useEffect(() => {
    loadAllSections();
  }, []);

  const loadAllSections = async () => {
    try {
      // Load seasonal anime
      const seasonal = await jikanApi.getSeasonalAnime();
      setSections(prev => ({
        ...prev,
        seasonal: { data: seasonal.data.slice(0, 12), loading: false }
      }));

      // Load top airing
      const topAiring = await jikanApi.getTopAnime('tv', 'airing');
      setSections(prev => ({
        ...prev,
        topAiring: { data: topAiring.data.slice(0, 12), loading: false }
      }));

      // Load top movies
      const topMovies = await jikanApi.getTopAnime('movie');
      setSections(prev => ({
        ...prev,
        topMovies: { data: topMovies.data.slice(0, 12), loading: false }
      }));

      // Load upcoming
      const upcoming = await jikanApi.getUpcomingAnime();
      setSections(prev => ({
        ...prev,
        upcoming: { data: upcoming.data.slice(0, 12), loading: false }
      }));

    } catch (error) {
      console.error('Failed to load homepage data:', error);
      // Set loading to false for all sections on error
      setSections(prev => ({
        seasonal: { data: [], loading: false },
        topAiring: { data: [], loading: false },
        topMovies: { data: [], loading: false },
        upcoming: { data: [], loading: false },
      }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-950"
    >
      {/* Hero Section */}
      <Hero />

      {/* Anime Sections */}
      <div className="space-y-12 pb-16">
        <AnimeSection
          title="This Season"
          anime={sections.seasonal.data}
          isLoading={sections.seasonal.loading}
          linkTo="/seasonal"
          linkText="View All Seasonal"
        />

        <AnimeSection
          title="Top Airing"
          anime={sections.topAiring.data}
          isLoading={sections.topAiring.loading}
          linkTo="/top?filter=airing"
          linkText="View All Airing"
        />

        <AnimeSection
          title="Upcoming Anime"
          anime={sections.upcoming.data}
          isLoading={sections.upcoming.loading}
          linkTo="/seasonal?upcoming=true"
          linkText="View All Upcoming"
        />

        <AnimeSection
          title="Top Movies"
          anime={sections.topMovies.data}
          isLoading={sections.topMovies.loading}
          linkTo="/movies"
          linkText="View All Movies"
        />
      </div>
    </motion.div>
  );
}