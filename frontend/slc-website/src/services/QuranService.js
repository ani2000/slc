// Quran Service for AlQuran.Cloud API
// Based on https://github.com/islamic-network/api.alquran.cloud
// API Documentation: https://alquran.cloud/api

const API_BASE_URL = 'https://api.alquran.cloud/v1';

class QuranService {
  // ===== EDITION ENDPOINTS =====
  
  // Get all available editions
  static async getAllEditions(format = null, language = null, type = null) {
    try {
      let url = `${API_BASE_URL}/edition`;
      const params = new URLSearchParams();
      
      if (format) params.append('format', format);
      if (language) params.append('language', language);
      if (type) params.append('type', type);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch editions');
    } catch (error) {
      console.error('Error fetching editions:', error);
      throw error;
    }
  }

  // Get all languages
  static async getAllLanguages() {
    try {
      const response = await fetch(`${API_BASE_URL}/language`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch languages');
    } catch (error) {
      console.error('Error fetching languages:', error);
      throw error;
    }
  }

  // Get editions by language
  static async getEditionsByLanguage(language) {
    try {
      const response = await fetch(`${API_BASE_URL}/language/${language}`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch editions by language');
    } catch (error) {
      console.error('Error fetching editions by language:', error);
      throw error;
    }
  }

  // Get all types
  static async getAllTypes() {
    try {
      const response = await fetch(`${API_BASE_URL}/type`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch types');
    } catch (error) {
      console.error('Error fetching types:', error);
      throw error;
    }
  }

  // Get editions by type
  static async getEditionsByType(type) {
    try {
      const response = await fetch(`${API_BASE_URL}/type/${type}`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch editions by type');
    } catch (error) {
      console.error('Error fetching editions by type:', error);
      throw error;
    }
  }

  // Get all formats
  static async getAllFormats() {
    try {
      const response = await fetch(`${API_BASE_URL}/format`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch formats');
    } catch (error) {
      console.error('Error fetching formats:', error);
      throw error;
    }
  }

  // Get editions by format
  static async getEditionsByFormat(format) {
    try {
      const response = await fetch(`${API_BASE_URL}/format/${format}`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch editions by format');
    } catch (error) {
      console.error('Error fetching editions by format:', error);
      throw error;
    }
  }

  // ===== QURAN ENDPOINTS =====
  
  // Get complete Quran edition
  static async getCompleteQuran(edition = 'quran-uthmani') {
    try {
      const response = await fetch(`${API_BASE_URL}/quran/${edition}`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch complete Quran');
    } catch (error) {
      console.error('Error fetching complete Quran:', error);
      throw error;
    }
  }

  // ===== SURAH ENDPOINTS =====
  
  // Fetch all surahs
  static async getAllSurahs() {
    try {
      const response = await fetch(`${API_BASE_URL}/surah`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data.map(surah => ({
          number: surah.number,
          name: surah.englishName,
          arabicName: surah.name,
          englishName: surah.englishName,
          englishNameTranslation: surah.englishNameTranslation,
          revelationType: surah.revelationType,
          numberOfAyahs: surah.numberOfAyahs
        }));
      }
      throw new Error('Failed to fetch surahs');
    } catch (error) {
      console.error('Error fetching surahs:', error);
      throw error;
    }
  }

  // Fetch specific surah with Arabic text
  static async getSurah(surahNumber) {
    try {
      const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch surah');
    } catch (error) {
      console.error('Error fetching surah:', error);
      throw error;
    }
  }

  // Fetch surah with translation
  static async getSurahWithTranslation(surahNumber, translation = 'en.sahih') {
    try {
      const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}/${translation}`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch surah with translation');
    } catch (error) {
      console.error('Error fetching surah with translation:', error);
      throw error;
    }
  }

  // Fetch surah with Bengali translation
  static async getSurahWithBengaliTranslation(surahNumber) {
    try {
      const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}/bn.bengali`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch surah with Bengali translation');
    } catch (error) {
      console.error('Error fetching surah with Bengali translation:', error);
      throw error;
    }
  }

  // Fetch surah with multiple editions
  static async getSurahWithMultipleEditions(surahNumber, editions) {
    try {
      const editionsString = Array.isArray(editions) ? editions.join(',') : editions;
      const response = await fetch(`${API_BASE_URL}/surah/${surahNumber}/editions/${editionsString}`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch surah with multiple editions');
    } catch (error) {
      console.error('Error fetching surah with multiple editions:', error);
      throw error;
    }
  }

  // ===== AYAH ENDPOINTS =====
  
  // Fetch specific ayah
  static async getAyah(ayahNumber) {
    try {
      const response = await fetch(`${API_BASE_URL}/ayah/${ayahNumber}`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch ayah');
    } catch (error) {
      console.error('Error fetching ayah:', error);
      throw error;
    }
  }

  // Fetch ayah with translation
  static async getAyahWithTranslation(ayahNumber, translation = 'en.sahih') {
    try {
      const response = await fetch(`${API_BASE_URL}/ayah/${ayahNumber}/${translation}`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch ayah with translation');
    } catch (error) {
      console.error('Error fetching ayah with translation:', error);
      throw error;
    }
  }

  // Fetch ayah with multiple editions
  static async getAyahWithMultipleEditions(ayahNumber, editions) {
    try {
      const editionsString = Array.isArray(editions) ? editions.join(',') : editions;
      const response = await fetch(`${API_BASE_URL}/ayah/${ayahNumber}/editions/${editionsString}`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch ayah with multiple editions');
    } catch (error) {
      console.error('Error fetching ayah with multiple editions:', error);
      throw error;
    }
  }

  // ===== SEARCH ENDPOINTS =====
  
  // Search Quran
  static async searchQuran(keyword, surah = 'all', edition = 'en') {
    try {
      const response = await fetch(`${API_BASE_URL}/search/${keyword}/${surah}/${edition}`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to search Quran');
    } catch (error) {
      console.error('Error searching Quran:', error);
      throw error;
    }
  }

  // ===== PAGE ENDPOINTS =====
  
  // Get page of Quran
  static async getPage(pageNumber, edition = 'quran-uthmani', offset = null, limit = null) {
    try {
      let url = `${API_BASE_URL}/page/${pageNumber}/${edition}`;
      const params = new URLSearchParams();
      
      if (offset !== null) params.append('offset', offset);
      if (limit !== null) params.append('limit', limit);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch page');
    } catch (error) {
      console.error('Error fetching page:', error);
      throw error;
    }
  }

  // ===== META ENDPOINTS =====
  
  // Get all meta data
  static async getMetaData() {
    try {
      const response = await fetch(`${API_BASE_URL}/meta`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch meta data');
    } catch (error) {
      console.error('Error fetching meta data:', error);
      throw error;
    }
  }

  // ===== JUZ ENDPOINTS =====
  
  // Get Juz information
  static async getJuz(juzNumber) {
    try {
      const response = await fetch(`${API_BASE_URL}/juz/${juzNumber}`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch Juz');
    } catch (error) {
      console.error('Error fetching Juz:', error);
      throw error;
    }
  }

  // Get Juz with translation
  static async getJuzWithTranslation(juzNumber, translation = 'en.sahih') {
    try {
      const response = await fetch(`${API_BASE_URL}/juz/${juzNumber}/${translation}`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch Juz with translation');
    } catch (error) {
      console.error('Error fetching Juz with translation:', error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====
  
  // Get audio URL for ayah
  static getAudioUrl(ayahNumber, reciter = 'ar.alafasy') {
    return `https://cdn.islamic.network/quran/audio/${reciter}/${ayahNumber}.mp3`;
  }

  // Get audio URL for surah
  static getSurahAudioUrl(surahNumber, reciter = 'ar.alafasy') {
    return `https://cdn.islamic.network/quran/audio/${reciter}/${surahNumber}.mp3`;
  }

  // Get available translations (legacy method for backward compatibility)
  static async getAvailableTranslations() {
    return this.getEditionsByType('translation');
  }

  // Get available reciters (legacy method for backward compatibility)
  static async getAvailableReciters() {
    return this.getEditionsByType('audio');
  }

  // Bengali surah names mapping
  static getBengaliSurahNames() {
    return {
      1: 'আল ফাতিহা',
      2: 'আল বাক্বারাহ',
      3: 'আল ইমরান',
      4: 'আন নিসা',
      5: 'আল মায়েদাহ',
      6: 'আল আন-আম',
      7: 'আল আ\'রাফ',
      8: 'আল-আনফাল',
      9: 'আত তাওবাহ',
      10: 'ইউনুস',
      11: 'হুদ',
      12: 'ইউসূফ',
      13: 'রা\'দ',
      14: 'ইব্রাহীম',
      15: 'হিজর',
      16: 'নাহল',
      17: 'বনী ইসরাঈল',
      18: 'কাহফ',
      19: 'মারইয়াম',
      20: 'ত্বোয়া-হা',
      21: 'আম্বিয়া',
      22: 'হাজ্জ্ব',
      23: 'আল মু\'মিনূন',
      24: 'আন-নূর',
      25: 'আল-ফুরকান',
      26: 'আশ-শো\'আরা',
      27: 'নমল',
      28: 'আল কাসাস',
      29: 'আল আনকাবুত',
      30: 'আর-রূম',
      31: 'লোকমান',
      32: 'সেজদাহ',
      33: 'আল আহযাব',
      34: 'সাবা',
      35: 'ফাতির',
      36: 'ইয়াসীন',
      37: 'আস-সাফফাত',
      38: 'ছোয়াদ',
      39: 'আল-যুমার',
      40: 'আল-মু\'মিন',
      41: 'হা-মীম সেজদাহ',
      42: 'আশ-শুরা',
      43: 'যুখরুফ',
      44: 'আদ দোখান',
      45: 'আল জাসিয়া',
      46: 'আল আহক্বাফ',
      47: 'মুহাম্মদ',
      48: 'আল ফাতহ',
      49: 'আল হুজরাত',
      50: 'ক্বাফ',
      51: 'আয-যারিয়াত',
      52: 'আত্ব তূর',
      53: 'আন-নাজম',
      54: 'আল ক্বামার',
      55: 'আর রহমান',
      56: 'আল ওয়াক্বিয়া',
      57: 'আল হাদীদ',
      58: 'আল মুজাদালাহ',
      59: 'আল হাশর',
      60: 'আল মুমতাহিনা',
      61: 'আছ-ছফ',
      62: 'আল জুমুআহ',
      63: 'মুনাফিকুন',
      64: 'আত-তাগাবুন',
      65: 'আত্ব-ত্বালাক্ব',
      66: 'আত-তাহরীম',
      67: 'আল মুলক',
      68: 'আল কলম',
      69: 'আল হাক্বক্বাহ',
      70: 'আল মা\'আরিজ',
      71: 'নূহ',
      72: 'আল জিন',
      73: 'মুযযামমিল',
      74: 'আল মুদ্দাসসির',
      75: 'আল ক্বেয়ামাহ',
      76: 'আদ-দাহর',
      77: 'আল মুরসালাত',
      78: 'আন-নাবা',
      79: 'আন-নযিআ\'ত',
      80: 'আবাসা',
      81: 'আত-তাকভীর',
      82: 'আল ইনফিতার',
      83: 'আত-তাতফীফ',
      84: 'আল ইনশিক্বাক্ব',
      85: 'আল বুরূজ',
      86: 'আত্ব-তারিক্ব',
      87: 'আল আ\'লা',
      88: 'আল গাশিয়াহ',
      89: 'আল ফজর',
      90: 'আল বালাদ',
      91: 'আশ-শামস',
      92: 'আল লায়ল',
      93: 'আদ্ব-দ্বোহা',
      94: 'আল ইনশিরাহ',
      95: 'ত্বীন',
      96: 'আলাক',
      97: 'কদর',
      98: 'বাইয়্যিনাহ',
      99: 'যিলযাল',
      100: 'আদিয়াত',
      101: 'কারেয়া',
      102: 'তাকাসূর',
      103: 'আছর',
      104: 'হুমাযাহ',
      105: 'ফীল',
      106: 'কোরাইশ',
      107: 'মাউন',
      108: 'কাওসার',
      109: 'কাফিরুন',
      110: 'নছর',
      111: 'লাহাব',
      112: 'এখলাছ',
      113: 'ফালাক্ব',
      114: 'নাস'
    };
  }

  // Get popular translations
  static getPopularTranslations() {
    return [
      { identifier: 'en.sahih', name: 'Sahih International', language: 'English' },
      { identifier: 'en.pickthall', name: 'Pickthall', language: 'English' },
      { identifier: 'en.yusufali', name: 'Yusuf Ali', language: 'English' },
      { identifier: 'bn.bengali', name: 'Bengali', language: 'Bengali' },
      { identifier: 'ar.muyassar', name: 'Muyassar', language: 'Arabic' },
      { identifier: 'ur.jalandhry', name: 'Jalandhry', language: 'Urdu' }
    ];
  }

  // Get popular reciters with enhanced audio quality
  static getPopularReciters() {
    return [
      { identifier: 'mishary', name: 'Mishary Rashid Alafasy', quality: 'High', description: 'Clear and melodious recitation' }
    ];
  }

  // Get working audio URL for ayah using surah+ayah number format
  static getHighQualityAudioUrl(surahNumber, ayahInSurah, reciter = 'mishary') {
    const surah = Number(surahNumber).toString().padStart(3, '0');
    const ayah = Number(ayahInSurah).toString().padStart(3, '0');
    return `https://everyayah.com/data/Alafasy_128kbps/${surah}${ayah}.mp3`;
  }

  // Get working audio URL for surah - using reliable source
  static getHighQualitySurahAudioUrl(surahNumber, reciter = 'mishary') {
    // Use a working Quran audio API for surah
    return `https://server8.mp3quran.net/afs/${surahNumber.toString().padStart(3, '0')}.mp3`;
  }

  // Get fallback audio URL for ayah (alternative reciter source)
  static getFallbackAudioUrl(surahNumber, ayahInSurah, reciter = 'mishary') {
    const surah = Number(surahNumber).toString().padStart(3, '0');
    const ayah = Number(ayahInSurah).toString().padStart(3, '0');
    return `https://everyayah.com/data/Abdul_Basit_Murattal_64kbps/${surah}${ayah}.mp3`;
  }

  // Get fallback audio URL for surah (alternative server)
  static getFallbackSurahAudioUrl(surahNumber, reciter = 'mishary') {
    return `https://server7.mp3quran.net/afs/${surahNumber.toString().padStart(3, '0')}.mp3`;
  }

  // Get available audio editions
  static async getAvailableAudioEditions() {
    try {
      const response = await fetch(`${API_BASE_URL}/edition?format=audio`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch audio editions');
    } catch (error) {
      console.error('Error fetching audio editions:', error);
      throw error;
    }
  }

  // Get audio editions by language
  static async getAudioEditionsByLanguage(language) {
    try {
      const response = await fetch(`${API_BASE_URL}/edition?format=audio&language=${language}`);
      const data = await response.json();
      
      if (data.code === 200 && data.data) {
        return data.data;
      }
      throw new Error('Failed to fetch audio editions by language');
    } catch (error) {
      console.error('Error fetching audio editions by language:', error);
      throw error;
    }
  }

  // Test audio URL functionality
  static async testAudioUrl(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Audio URL test failed:', error);
      return false;
    }
  }

  // Get test audio URL for verification
  static getTestAudioUrl() {
    return 'https://server8.mp3quran.net/afs/0001.mp3';
  }
}

export default QuranService; 