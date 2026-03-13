const fs = require('fs');
const https = require('https');

const DATA_URL = 'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran.json';
const OUTPUT_PATH = 'frontend/slc-website/src/surah.js';

console.log('Downloading Quran data...');

https.get(DATA_URL, (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    const quran = JSON.parse(data);
    const surahs = quran.map(surah => ({
      number: surah.number, // Make sure this exists in the source data
      english: surah.englishName, // Make sure this exists in the source data
      bangla: '', // Placeholder
      ayahs: surah.verses.map(ayah => ({
        number: ayah.number,
        arabic: ayah.text,
        bangla: '',
        english: ''
      }))
    }));
    const fileContent =
      'export const surahs = ' + JSON.stringify(surahs, null, 2) + ';\n';
    fs.writeFileSync(OUTPUT_PATH, fileContent);
    console.log('✅ surah.js generated successfully with all 114 surahs!');
  });
}).on('error', (err) => {
  console.error('Error downloading Quran data:', err.message);
}); 