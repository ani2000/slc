import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Pause, Loader2 } from 'lucide-react';
import QuranService from './services/QuranService';

const QuranSurahPage = () => {
  const { number } = useParams();
  const [surah, setSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [bengaliAyahs, setBengaliAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBengali, setShowBengali] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(null);
  const [audioLoading, setAudioLoading] = useState(null);
  const [selectedReciter, setSelectedReciter] = useState('mishary');
  const [audioElement, setAudioElement] = useState(null);

  // Initialize audio element with proper error handling
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = 1.0; // Set to maximum volume
    audio.controls = false;
    
    // Add comprehensive error handling based on web.dev debugging guide
    audio.addEventListener('error', (e) => {
      console.error('Audio Error:', {
        code: audio.error?.code,
        message: audio.error?.message,
        src: audio.src
      });
    });
    
    audio.addEventListener('loadstart', () => console.log('Audio loading started'));
    audio.addEventListener('canplay', () => console.log('Audio can play'));
    audio.addEventListener('playing', () => console.log('Audio is playing'));
    audio.addEventListener('ended', () => console.log('Audio ended'));
    
    setAudioElement(audio);

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  useEffect(() => {
    const fetchSurahData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch surah metadata
        const surahData = await QuranService.getSurah(number);
        setSurah(surahData);
        
        // Fetch ayahs with English translation
        const englishData = await QuranService.getSurahWithTranslation(number, 'en.sahih');
        if (englishData && englishData.ayahs) {
          setAyahs(englishData.ayahs);
        }
        
        // Fetch ayahs with Bengali translation
        try {
          const bengaliData = await QuranService.getSurahWithBengaliTranslation(number);
          if (bengaliData && bengaliData.ayahs) {
            setBengaliAyahs(bengaliData.ayahs);
          }
        } catch (bengaliError) {
          console.warn('Bengali translation not available:', bengaliError);
        }
        
      } catch (err) {
        console.error('Error fetching surah data:', err);
        setError('Failed to load surah data');
      } finally {
        setLoading(false);
      }
    };

    if (number) {
      fetchSurahData();
    }
  }, [number]);

  if (loading) {
    return (
      <div className="quran-surah-page max-w-4xl mx-auto p-4">
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#235B3F]"></div>
          <p className="mt-2 text-gray-600">Loading surah...</p>
        </div>
      </div>
    );
  }

  if (error || !surah) {
    return (
      <div className="quran-surah-page max-w-4xl mx-auto p-4">
        <div className="text-center py-10 text-red-500">
          {error || 'Surah not found.'}
        </div>
      </div>
    );
  }

  // Get Bengali name for the surah
  const bengaliNames = QuranService.getBengaliSurahNames();
  const bengaliName = bengaliNames[surah.number] || surah.englishName;

  // Enhanced audio functions with proper error handling
  const playAyahAudio = async (ayahInSurah) => {
    if (audioPlaying === ayahInSurah) {
      // Stop current audio
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      setAudioPlaying(null);
      setAudioLoading(null);
      return;
    }

    setAudioLoading(ayahInSurah);
    
    try {
      // Use working audio URL
      let audioUrl = QuranService.getHighQualityAudioUrl(surah.number, ayahInSurah, selectedReciter);
      console.log('Playing ayah audio:', audioUrl);
      
      if (audioElement) {
        audioElement.src = audioUrl;
        audioElement.volume = 1.0;
        
        // Set up event listeners
        const handleCanPlay = () => {
          console.log('Ayah audio can play');
          setAudioLoading(null);
          setAudioPlaying(ayahInSurah);
        };
        
        const handleEnded = () => {
          console.log('Ayah audio ended');
          setAudioPlaying(null);
          setAudioLoading(null);
        };
        
        const handleError = async (e) => {
          console.error('Ayah audio error:', e);
          console.warn('Trying fallback audio for ayah:', ayahInSurah);
          
          try {
            const fallbackUrl = QuranService.getFallbackAudioUrl(surah.number, ayahInSurah, selectedReciter);
            console.log('Fallback URL:', fallbackUrl);
            audioElement.src = fallbackUrl;
            await audioElement.play();
          } catch (fallbackError) {
            console.error('Fallback audio also failed:', fallbackError);
            setAudioLoading(null);
            setAudioPlaying(null);
            alert('Audio playback failed. Please try again.');
          }
        };
        
        // Remove previous listeners
        audioElement.removeEventListener('canplay', handleCanPlay);
        audioElement.removeEventListener('ended', handleEnded);
        audioElement.removeEventListener('error', handleError);
        
        // Add new listeners
        audioElement.addEventListener('canplay', handleCanPlay);
        audioElement.addEventListener('ended', handleEnded);
        audioElement.addEventListener('error', handleError);
        
        // Play the audio
        const playResult = await audioElement.play();
        console.log('Play result:', playResult);
        
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setAudioLoading(null);
      setAudioPlaying(null);
      alert('Audio playback failed. Please try again.');
    }
  };

  const playSurahAudio = async () => {
    if (audioPlaying === 'surah') {
      // Stop current audio
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      setAudioPlaying(null);
      setAudioLoading(null);
      return;
    }

    setAudioLoading('surah');
    
    try {
      const audioUrl = QuranService.getHighQualitySurahAudioUrl(surah.number, selectedReciter);
      console.log('Playing surah audio:', audioUrl);
      
      if (audioElement) {
        audioElement.src = audioUrl;
        audioElement.volume = 1.0;
        
        // Set up event listeners
        const handleCanPlay = () => {
          console.log('Surah audio can play');
          setAudioLoading(null);
          setAudioPlaying('surah');
        };
        
        const handleEnded = () => {
          console.log('Surah audio ended');
          setAudioPlaying(null);
          setAudioLoading(null);
        };
        
        const handleError = async (e) => {
          console.error('Surah audio error:', e);
          console.warn('Trying fallback audio for surah:', surah.number);
          
          try {
            const fallbackUrl = QuranService.getFallbackSurahAudioUrl(surah.number, selectedReciter);
            console.log('Fallback URL:', fallbackUrl);
            audioElement.src = fallbackUrl;
            await audioElement.play();
          } catch (fallbackError) {
            console.error('Fallback surah audio also failed:', fallbackError);
            setAudioLoading(null);
            setAudioPlaying(null);
            alert('Surah audio playback failed. Please try again.');
          }
        };
        
        // Remove previous listeners
        audioElement.removeEventListener('canplay', handleCanPlay);
        audioElement.removeEventListener('ended', handleEnded);
        audioElement.removeEventListener('error', handleError);
        
        // Add new listeners
        audioElement.addEventListener('canplay', handleCanPlay);
        audioElement.addEventListener('ended', handleEnded);
        audioElement.addEventListener('error', handleError);
        
        // Play the audio
        const playResult = await audioElement.play();
        console.log('Surah play result:', playResult);
        
      }
    } catch (error) {
      console.error('Surah audio playback error:', error);
      setAudioLoading(null);
      setAudioPlaying(null);
      alert('Surah audio playback failed. Please try again.');
    }
  };

  return (
    <div className="quran-surah-page max-w-4xl mx-auto p-4">
      {/* Surah Header */}
      <div className="surah-header text-center mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <h1 className="text-3xl font-bold text-[#235B3F] mb-2">
          {surah.number}. {surah.englishName}
        </h1>
        <h2 className="text-2xl font-serif text-gray-700 mb-2">{surah.name}</h2>
        <h3 className="text-xl text-gray-600 mb-2">{bengaliName}</h3>
        <div className="text-sm text-gray-600 space-x-4">
          <span>• {surah.revelationType} • {surah.numberOfAyahs} Ayahs</span>
        </div>
        {surah.englishNameTranslation && (
          <p className="text-gray-700 mt-2 italic">"{surah.englishNameTranslation}"</p>
        )}
        
        {/* Audio Controls */}
        <div className="mt-4 flex justify-center items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Reciter:</span>
            <select
              value={selectedReciter}
              onChange={(e) => setSelectedReciter(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#235B3F] focus:border-transparent"
            >
              <option value="mishary">🎵 Mishary Rashid Alafasy (Clear & Melodious)</option>
            </select>
          </div>
          
          <button
            onClick={playSurahAudio}
            disabled={audioLoading === 'surah'}
            className="px-4 py-2 bg-[#235B3F] text-white rounded-lg hover:bg-[#1a4a32] disabled:opacity-50 transition-colors flex items-center space-x-2"
          >
            {audioLoading === 'surah' ? (
              <Loader2 className="animate-spin" size={16} />
            ) : audioPlaying === 'surah' ? (
              <Pause size={16} />
            ) : (
              <Play size={16} />
            )}
            <span>Play Surah Audio</span>
          </button>
          
          {/* Test Audio Button */}
          <button
            onClick={() => {
              const testAudio = new Audio('https://server8.mp3quran.net/afs/0001.mp3');
              testAudio.volume = 1.0;
              testAudio.play().then(() => {
                console.log('Test audio playing successfully');
                alert('Test audio is working! You should hear Surah Al-Fatiha.');
              }).catch((error) => {
                console.error('Test audio failed:', error);
                alert('Test audio failed. Please check your browser settings.');
              });
            }}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Test Audio
          </button>
        </div>
      </div>

      {/* Translation Toggle */}
      {bengaliAyahs.length > 0 && (
        <div className="text-center mb-6">
          <button 
            onClick={() => setShowBengali(!showBengali)}
            className="px-4 py-2 bg-[#235B3F] text-white rounded-lg hover:bg-[#1a4a32] transition-colors"
          >
            {showBengali ? 'Show English Translation' : 'Show Bengali Translation'}
          </button>
        </div>
      )}

      {/* Ayahs */}
      <div className="space-y-6">
        {ayahs.map((ayah, index) => {
          const bengaliAyah = bengaliAyahs.find(b => b.numberInSurah === ayah.numberInSurah);
          
          return (
            <div key={ayah.numberInSurah} className="ayah-block bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="ayah-number bg-[#235B3F] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {ayah.numberInSurah}
                </div>
                <div className="ayah-arabic text-right text-2xl font-serif leading-relaxed text-gray-800 flex-1 mr-4">
                  {ayah.text}
                </div>
              </div>
              
              {/* Translation */}
              <div className="ayah-translation mt-4 p-4 bg-gray-50 rounded-lg">
                {showBengali && bengaliAyah ? (
                  <div className="text-gray-700 leading-relaxed text-lg">
                    {bengaliAyah.text}
                  </div>
                ) : (
                  <div className="text-gray-700 leading-relaxed">
                    {ayah.translation}
                  </div>
                )}
              </div>
              
              {/* Additional info */}
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs text-gray-500">
                  Ayah {ayah.numberInSurah} of {surah.numberOfAyahs} • Juz {ayah.juz}
                </div>
                
                {/* Ayah Audio Button */}
                <button
                  onClick={() => playAyahAudio(ayah.numberInSurah)}
                  disabled={audioLoading === ayah.numberInSurah}
                  className="p-2 bg-[#235B3F] text-white rounded-full hover:bg-[#1a4a32] disabled:opacity-50 transition-colors"
                  title="Play Ayah Audio"
                >
                  {audioLoading === ayah.numberInSurah ? (
                    <Loader2 className="animate-spin" size={12} />
                  ) : audioPlaying === ayah.numberInSurah ? (
                    <Pause size={12} />
                  ) : (
                    <Play size={12} />
                  )}
                </button>
              </div>
            </div>
          );
        })}
        </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <Link 
          to={`/quran/${parseInt(number) - 1}`} 
          className={`px-4 py-2 rounded-lg border transition-colors ${
            parseInt(number) === 1 
              ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
              : 'border-[#235B3F] text-[#235B3F] hover:bg-[#235B3F] hover:text-white'
          }`}
          onClick={(e) => parseInt(number) === 1 && e.preventDefault()}
        >
          ← Previous Surah
        </Link>
        
        <Link 
          to="/teachings" 
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          Back to Quran List
        </Link>
        
        <Link 
          to={`/quran/${parseInt(number) + 1}`} 
          className={`px-4 py-2 rounded-lg border transition-colors ${
            parseInt(number) === 114 
              ? 'border-gray-300 text-gray-400 cursor-not-allowed' 
              : 'border-[#235B3F] text-[#235B3F] hover:bg-[#235B3F] hover:text-white'
          }`}
          onClick={(e) => parseInt(number) === 114 && e.preventDefault()}
        >
          Next Surah →
        </Link>
      </div>
    </div>
  );
};

export default QuranSurahPage; 