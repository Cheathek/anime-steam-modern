const BASE_URL = 'https://api.jikan.moe/v4';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const RATE_LIMIT_DELAY = 2000; // 2 seconds between requests (increased from 1 second)

interface CacheItem {
  data: any;
  timestamp: number;
}

class JikanAPI {
  private readonly cache = new Map<string, CacheItem>();
  private lastRequestTime = 0;

  private async rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      await new Promise(resolve => 
        setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime = Date.now();
  }

  private isCacheValid(cacheItem: CacheItem): boolean {
    return Date.now() - cacheItem.timestamp < CACHE_DURATION;
  }

  private async fetchWithRetry(url: string, retries = 3): Promise<any> {
    try {
      await this.rateLimit();
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return this.fetchWithRetry(url, retries - 1);
      }
      throw error;
    }
  }

  private async request(endpoint: string): Promise<any> {
    const cacheKey = endpoint;
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached)) {
      return cached.data;
    }

    try {
      const data = await this.fetchWithRetry(`${BASE_URL}${endpoint}`);
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getTopAnime(type?: string, filter?: string, page = 1): Promise<any> {
    let endpoint = `/top/anime?page=${page}`;
    if (type) endpoint += `&type=${type}`;
    if (filter) endpoint += `&filter=${filter}`;
    
    return this.request(endpoint);
  }

  async getSeasonalAnime(year?: number, season?: string): Promise<any> {
    const currentYear = new Date().getFullYear();
    const currentSeason = this.getCurrentSeason();
    
    const targetYear = year ?? currentYear;
    const targetSeason = season ?? currentSeason;
    
    return this.request(`/seasons/${targetYear}/${targetSeason}`);
  }

  async getUpcomingAnime(): Promise<any> {
    return this.request('/seasons/upcoming');
  }

  async getAnimeDetails(id: number): Promise<any> {
    return this.request(`/anime/${id}/full`);
  }

  async getAnimeCharacters(id: number): Promise<any> {
    return this.request(`/anime/${id}/characters`);
  }

  async getAnimeStaff(id: number): Promise<any> {
    return this.request(`/anime/${id}/staff`);
  }

  async searchAnime(
    query: string,
    params?: Record<string, string | number | boolean>
  ): Promise<any> {
    let endpoint = `/anime?q=${encodeURIComponent(query)}`;
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          !(typeof value === 'object' && Object.keys(value).length === 0)
        ) {
          const encodedValue = encodeURIComponent(String(value));
          endpoint += `&${key}=${encodedValue}`;
        }
      });
    }
    
    return this.request(endpoint);
  }

  async getGenres(): Promise<any> {
    return this.request('/genres/anime');
  }

  private getCurrentSeason(): string {
    const month = new Date().getMonth() + 1;
    if (month >= 1 && month <= 3) return 'winter';
    if (month >= 4 && month <= 6) return 'spring';
    if (month >= 7 && month <= 9) return 'summer';
    return 'fall';
  }

  // Smart deduplication for search results
  deduplicateAnime(animeList: any[]): any[] {
    const groups = new Map<string, any[]>();
    
    animeList.forEach(anime => {
      const baseTitle = this.normalizeTitle(anime.title_english ?? anime.title);
      if (!groups.has(baseTitle)) {
        groups.set(baseTitle, []);
      }
      groups.get(baseTitle)!.push(anime);
    });

    return Array.from(groups.values()).map(group => {
      // Priority: Upcoming > Airing > Finished
      const statusPriority = { 'Not yet aired': 3, 'Currently Airing': 2, 'Finished Airing': 1 };
      // Move sort to a separate statement (to avoid mutating original array)
      const sortedGroup = [...group].sort((a, b) => {
        const aPriority = statusPriority[a.status as keyof typeof statusPriority] || 0;
        const bPriority = statusPriority[b.status as keyof typeof statusPriority] || 0;
        return bPriority - aPriority;
      });
      return sortedGroup[0];
    });
  }

  private normalizeTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s*(season|s)\s*\d+/g, '')
      .replace(/\s*(ova|ona|special|movie|tv)/g, '')
      .trim();
  }
}

export const jikanApi = new JikanAPI();