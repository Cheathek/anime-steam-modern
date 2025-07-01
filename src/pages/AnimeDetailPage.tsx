import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  Calendar, 
  Clock, 
  Users, 
  Play, 
  Plus, 
  Heart,
  ChevronLeft,
  ExternalLink
} from 'lucide-react';
import { jikanApi } from '../services/jikanApi';
import { Loading } from '../components/ui/Loading';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function AnimeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [anime, setAnime] = useState<any>(null);
  const [characters, setCharacters] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadAnimeDetails(parseInt(id));
    }
  }, [id]);

  const loadAnimeDetails = async (animeId: number) => {
    setIsLoading(true);
    try {
      const [animeResponse, charactersResponse, staffResponse] = await Promise.all([
        jikanApi.getAnimeDetails(animeId),
        jikanApi.getAnimeCharacters(animeId),
        jikanApi.getAnimeStaff(animeId)
      ]);

      setAnime(animeResponse.data);
      setCharacters(charactersResponse.data?.slice(0, 12) || []);
      setStaff(staffResponse.data?.slice(0, 8) || []);
    } catch (error) {
      console.error('Failed to load anime details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Currently Airing': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'Finished Airing': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'Not yet aired': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      default: return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    }
  };

  const getRatingColor = (rating?: string) => {
    if (!rating) return 'text-slate-400 bg-slate-500/20 border-slate-500/30';
    if (rating.includes('R+') || rating.includes('Rx')) {
      return 'text-red-400 bg-red-500/20 border-red-500/30';
    }
    if (rating.includes('PG-13')) {
      return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
    }
    return 'text-green-400 bg-green-500/20 border-green-500/30';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <Loading size="lg" text="Loading anime details..." />
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 text-lg mb-4">Anime not found</p>
          <Link to="/">
            <Button>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        {anime.images?.jpg?.large_image_url && (
          <div className="absolute inset-0">
            <img
              src={anime.images.jpg.large_image_url}
              alt={anime.title}
              className="w-full h-full object-cover blur-sm scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
          </div>
        )}
        
        <div className="relative h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
            <Link to="/" className="inline-flex items-center text-slate-400 hover:text-white mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Browse
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-1"
          >
            <Card className="overflow-hidden">
              <img
                src={anime.images?.jpg?.large_image_url}
                alt={anime.title}
                className="w-full aspect-[2/3] object-cover"
              />
              
              <div className="p-6 space-y-4">
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Watchlist
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Favorite
                  </Button>
                </div>

                {/* External Links */}
                {anime.external && anime.external.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-white">External Links</h3>
                    {anime.external.slice(0, 3).map((link: any, index: number) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 text-primary-400 hover:text-primary-300 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-sm">{link.name}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Main Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 space-y-6"
          >
            {/* Title & Basic Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {anime.title}
              </h1>
              
              {anime.title_english && anime.title_english !== anime.title && (
                <p className="text-lg text-slate-400 mb-4">{anime.title_english}</p>
              )}

              {/* Status Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(anime.status)}`}>
                  {anime.status}
                </span>
                
                {anime.type && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-primary-400 bg-primary-500/20 border border-primary-500/30">
                    {anime.type}
                  </span>
                )}

                {anime.rating && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRatingColor(anime.rating)}`}>
                    {anime.rating}
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {anime.score && (
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 fill-current text-yellow-400" />
                    <div>
                      <p className="text-white font-semibold">{anime.score}</p>
                      <p className="text-xs text-slate-400">Score</p>
                    </div>
                  </div>
                )}

                {anime.episodes && (
                  <div className="flex items-center space-x-2">
                    <Play className="w-5 h-5 text-primary-400" />
                    <div>
                      <p className="text-white font-semibold">{anime.episodes}</p>
                      <p className="text-xs text-slate-400">Episodes</p>
                    </div>
                  </div>
                )}

                {anime.duration && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-white font-semibold">{anime.duration}</p>
                      <p className="text-xs text-slate-400">Duration</p>
                    </div>
                  </div>
                )}

                {anime.members && (
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-white font-semibold">{anime.members.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">Members</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Synopsis */}
            {anime.synopsis && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-3">Synopsis</h2>
                  <p className="text-slate-300 leading-relaxed">{anime.synopsis}</p>
                </div>
              </Card>
            )}

            {/* Details Grid */}
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {anime.aired?.string && (
                    <div>
                      <span className="text-slate-400">Aired:</span>
                      <span className="text-white ml-2">{anime.aired.string}</span>
                    </div>
                  )}
                  
                  {anime.studios && anime.studios.length > 0 && (
                    <div>
                      <span className="text-slate-400">Studio:</span>
                      <span className="text-white ml-2">
                        {anime.studios.map((studio: any) => studio.name).join(', ')}
                      </span>
                    </div>
                  )}

                  {anime.source && (
                    <div>
                      <span className="text-slate-400">Source:</span>
                      <span className="text-white ml-2">{anime.source}</span>
                    </div>
                  )}

                  {anime.licensors && anime.licensors.length > 0 && (
                    <div>
                      <span className="text-slate-400">Licensors:</span>
                      <span className="text-white ml-2">
                        {anime.licensors.map((licensor: any) => licensor.name).join(', ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {anime.genres && anime.genres.length > 0 && (
                  <div className="mt-4">
                    <span className="text-slate-400 text-sm">Genres:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {anime.genres.map((genre: any) => (
                        <span
                          key={genre.mal_id}
                          className="px-3 py-1 bg-slate-800 text-slate-300 text-sm rounded-full"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Characters & Voice Actors */}
            {characters.length > 0 && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Characters & Voice Actors</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {characters.map((char, index) => (
                      <motion.div
                        key={char.character.mal_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg"
                      >
                        {/* Character Image */}
                        <img
                          src={char.character.images?.jpg?.image_url}
                          alt={char.character.name}
                          className="w-12 h-12 rounded-full object-cover border border-slate-600"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-character.jpg';
                          }}
                        />
                        
                        {/* Character Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">
                            {char.character.name}
                          </p>
                          <p className="text-slate-400 text-sm truncate">
                            {char.role}
                          </p>
                        </div>
                        
                        {/* Voice Actor Info & Image */}
                        {char.voice_actors && char.voice_actors[0] && (
                          <div className="flex items-center space-x-2">
                            <div className="text-right">
                              <p className="text-white text-sm truncate max-w-24">
                                {char.voice_actors[0].person.name}
                              </p>
                              <p className="text-slate-400 text-xs">
                                {char.voice_actors[0].language}
                              </p>
                            </div>
                            <img
                              src={char.voice_actors[0].person.images?.jpg?.image_url}
                              alt={char.voice_actors[0].person.name}
                              className="w-12 h-12 rounded-full object-cover border border-slate-600"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder-person.jpg';
                              }}
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Staff */}
            {staff.length > 0 && (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Staff</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {staff.map((member, index) => (
                      <motion.div
                        key={member.person.mal_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg"
                      >
                        <img
                          src={member.person.images?.jpg?.image_url}
                          alt={member.person.name}
                          className="w-12 h-12 rounded-full object-cover"
                          loading="lazy"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            {member.person.name}
                          </p>
                          <p className="text-slate-400 text-sm">
                            {member.positions.join(', ')}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}