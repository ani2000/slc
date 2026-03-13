import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Mic, Globe, Play, Pause, Volume2, Loader2 } from 'lucide-react';
import QuranService from '../services/QuranService';

const QuranSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState('all');
  const [selectedEdition, setSelectedEdition] = useState('en.sahih');
  const [selectedReciter, setSelectedReciter] = useState('mishary');
  const [popularTranslations] = useState(QuranService.getPopularTranslations());
  const [popularReciters] = useState(QuranService.getPopularReciters());
  const [audioPlaying, setAudioPlaying] = useState(null);
  const [audioLoading, setAudioLoading] = useState(null);
  const [audioElement, setAudioElement] = useState(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    setAudioElement(audio);

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearchResults([]);
    
    try {
      // Try different search approaches
      let results = null;
      
      // First try with the selected edition
      try {
        results = await QuranService.searchQuran(searchQuery, selectedSurah, selectedEdition);
      } catch (error) {
        console.warn('Search with selected edition failed, trying default:', error);
        // Fallback to default English search
        results = await QuranService.searchQuran(searchQuery, selectedSurah, 'en');
      }

      if (results && results.matches) {
        setSearchResults(results.matches);
      } else if (results && Array.isArray(results)) {
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const playAudio = async (ayahNumber, reciter = selectedReciter) => {
    if (audioPlaying === ayahNumber) {
      // Stop current audio
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      setAudioPlaying(null);
      setAudioLoading(null);
      return;
    }

    setAudioLoading(ayahNumber);
    
    try {
      // Use high-quality audio URL for better sound
      const audioUrl = QuranService.getHighQualityAudioUrl(ayahNumber, reciter);
      
      if (audioElement) {
        // Enhanced audio settings for better quality
        audioElement.preload = 'metadata';
        audioElement.crossOrigin = 'anonymous';
        audioElement.volume = 0.8; // Set good volume level
        
        audioElement.src = audioUrl;
        audioElement.onloadstart = () => setAudioLoading(ayahNumber);
        audioElement.oncanplay = () => {
          setAudioLoading(null);
          setAudioPlaying(ayahNumber);
        };
        audioElement.onended = () => {
          setAudioPlaying(null);
          setAudioLoading(null);
        };
        audioElement.onerror = () => {
          setAudioLoading(null);
          setAudioPlaying(null);
          console.error('Audio failed to load:', audioUrl);
        };
        
        await audioElement.play();
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setAudioLoading(null);
      setAudioPlaying(null);
    }
  };

  const playSurahAudio = async (surahNumber, reciter = selectedReciter) => {
    if (audioPlaying === `surah-${surahNumber}`) {
      // Stop current audio
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      setAudioPlaying(null);
      setAudioLoading(null);
      return;
    }

    setAudioLoading(`surah-${surahNumber}`);
    
    try {
      const audioUrl = QuranService.getSurahAudioUrl(surahNumber, reciter);
      
      if (audioElement) {
        audioElement.src = audioUrl;
        audioElement.onloadstart = () => setAudioLoading(`surah-${surahNumber}`);
        audioElement.oncanplay = () => {
          setAudioLoading(null);
          setAudioPlaying(`surah-${surahNumber}`);
        };
        audioElement.onended = () => {
          setAudioPlaying(null);
          setAudioLoading(null);
        };
        audioElement.onerror = () => {
          setAudioLoading(null);
          setAudioPlaying(null);
          console.error('Surah audio failed to load:', audioUrl);
        };
        
        await audioElement.play();
      }
    } catch (error) {
      console.error('Surah audio playback error:', error);
      setAudioLoading(null);
      setAudioPlaying(null);
    }
  };

  return (
    <div className="quran-search-container bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-[#235B3F] mb-2 flex items-center">
          <Search className="mr-2" size={20} />
          Search the Quran
        </h3>
        <p className="text-gray-600 text-sm">
          Search through the Holy Quran using keywords in multiple languages and translations.
        </p>
      </div>

      {/* Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Search Input */}
        <div className="md:col-span-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter keywords to search..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#235B3F] focus:border-transparent"
          />
        </div>

        {/* Surah Selector */}
        <div>
          <select
            value={selectedSurah}
            onChange={(e) => setSelectedSurah(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#235B3F] focus:border-transparent"
          >
            <option value="all">All Surahs</option>
            {Array.from({ length: 114 }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>Surah {num}</option>
            ))}
          </select>
        </div>

        {/* Edition Selector */}
        <div>
          <select
            value={selectedEdition}
            onChange={(e) => setSelectedEdition(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#235B3F] focus:border-transparent"
          >
            <option value="en.sahih">Sahih International</option>
            <option value="en.pickthall">Pickthall</option>
            <option value="en.yusufali">Yusuf Ali</option>
            <option value="bn.bengali">Bengali</option>
            <option value="ar.muyassar">Arabic</option>
          </select>
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        disabled={loading || !searchQuery.trim()}
        className="w-full md:w-auto px-6 py-2 bg-[#235B3F] text-white rounded-lg hover:bg-[#1a4a32] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
      >
        {loading ? (
          <Loader2 className="mr-2 animate-spin" size={16} />
        ) : (
          <Search className="mr-2" size={16} />
        )}
        {loading ? 'Searching...' : 'Search'}
      </button>

      {/* Popular Translations */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <BookOpen className="mr-2" size={18} />
          Popular Translations
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {popularTranslations.map(translation => (
            <button
              key={translation.identifier}
              onClick={() => setSelectedEdition(translation.identifier)}
              className={`px-3 py-2 text-xs rounded border transition-colors ${
                selectedEdition === translation.identifier
                  ? 'bg-[#235B3F] text-white border-[#235B3F]'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {translation.name}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Reciters */}
      <div className="mt-6">
        <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <Mic className="mr-2" size={18} />
          High-Quality Reciters
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularReciters.map(reciter => (
                         <div
               key={reciter.identifier}
               className={`px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border rounded-lg hover:bg-green-100 transition-colors cursor-pointer ${
                 selectedReciter === reciter.identifier 
                   ? 'border-[#235B3F] bg-green-100 shadow-md' 
                   : 'border-green-200'
               }`}
               onClick={() => setSelectedReciter(reciter.identifier)}
             >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-[#235B3F]">🎵 {reciter.name}</span>
                <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">{reciter.quality}</span>
              </div>
              <p className="text-xs text-gray-600">{reciter.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-3">
            Search Results ({searchResults.length})
          </h4>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {searchResults.map((result, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-semibold text-[#235B3F]">
                    Surah {result.surah?.number || result.surah}:{result.numberInSurah || result.number}
                  </span>
                  <span className="text-xs text-gray-500">
                    {result.surah?.englishName || result.surahName}
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-2">
                  {result.text || result.translation}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Page {result.page?.number || 'N/A'} • Juz {result.juz?.number || 'N/A'}
                  </div>
                  <div className="flex gap-2">
                    {/* Play Ayah Audio */}
                    <button
                      onClick={() => playAudio(result.number || result.numberInSurah)}
                      className="p-2 bg-[#235B3F] text-white rounded-full hover:bg-[#1a4a32] transition-colors"
                      title="Play Ayah Audio"
                    >
                      {audioLoading === (result.number || result.numberInSurah) ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : audioPlaying === (result.number || result.numberInSurah) ? (
                        <Pause size={14} />
                      ) : (
                        <Play size={14} />
                      )}
                    </button>
                    
                    {/* Play Surah Audio */}
                    <button
                      onClick={() => playSurahAudio(result.surah?.number || result.surah)}
                      className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                      title="Play Surah Audio"
                    >
                      {audioLoading === `surah-${result.surah?.number || result.surah}` ? (
                        <Loader2 className="animate-spin" size={14} />
                      ) : audioPlaying === `surah-${result.surah?.number || result.surah}` ? (
                        <Pause size={14} />
                      ) : (
                        <Volume2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {searchResults.length === 0 && !loading && searchQuery && (
        <div className="mt-6 text-center text-gray-500">
          <Globe className="mx-auto mb-2" size={24} />
          <p>No results found for "{searchQuery}"</p>
          <p className="text-sm">Try different keywords or check your spelling</p>
        </div>
      )}

      {/* Search Tips */}
      {!searchQuery && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h5 className="font-semibold text-blue-800 mb-2">Search Tips:</h5>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Try searching for names like "Abraham", "Moses", "Jesus"</li>
            <li>• Search for concepts like "mercy", "prayer", "charity"</li>
            <li>• Use Arabic transliterations like "Allah", "Rahman"</li>
            <li>• Search in specific surahs for more targeted results</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default QuranSearch; 