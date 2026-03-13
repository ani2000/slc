import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Menu, X, MapPin, Mail, Phone, BookOpen as BookIcon, Shield, Anchor, Feather, Star, Compass, Heart, Award, Gem, Building, Droplet, UserCheck, Code, Quote } from 'lucide-react';
import './App.css';
import 'leaflet/dist/leaflet.css';
// Removed unused component imports

// --- Import Local Assets ---
import logo from './assets/SUST/sust-logo-transparent.png';
import heroBg from './assets/bg.jpg';
import sustCampusImg from './assets/hq720.jpg';
import dargahSharifImg from './assets/Mazar/Shahjalal-Mazar-Dargah-Shahjalal-Sylhet.jpg';
import developerPhoto from './assets/dev_photo.jpg';
import hq720 from './assets/hq720.jpg';
// Import new components
import Books, { books as booksArray } from './Books';
import BookList from './BookList';
import SUST from './SUST';
import Mazar from './Mazar';
import { quotes as quotesArray } from './QuotesSection';
import PdfViewer from './PdfViewer';
import QuranSurahPage from './QuranSurahPage';
import QuranService from './services/QuranService';
import QuranSearch from './components/QuranSearch';

// --- Config ---
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5010/api';
const API_ORIGIN = API_URL.replace(/\/api\/?$/, '');

const FALLBACK_SYLHET_MAZARS = [
    { name: 'Hazrat Shahjalal (Rah.) Dargah Sharif', title: 'Sylhet City', address: 'Ambarkhana, Sylhet', lat: 24.886076, lng: 91.867587 },
    { name: 'Hazrat Shah Paran (Rah.) Mazar', title: 'Companion of Shahjalal (Rah.)', address: 'Khadimnagar, Sylhet', lat: 24.957164, lng: 91.927206 },
    { name: 'Hazrat Shah Kamal (Rah.)', title: 'Shaharpara Tradition', address: 'Shaharpara, Sunamganj', lat: 24.8912, lng: 91.2822 },
    { name: 'Hazrat Shah Gabru (Rah.)', title: 'Panch Pir Tradition', address: 'Osmani Nagar, Sylhet', lat: 24.8053, lng: 91.9093 },
    { name: 'Hazrat Shah Mustafa (Rah.)', title: 'Historic Moulvibazar Shrine', address: 'Moulvibazar Sadar, Moulvibazar', lat: 24.4829, lng: 91.7776 },
    { name: 'Hazrat Syed Qutb Uddin (Rah.)', title: 'Regional Sufi Legacy', address: 'Sherpur, Moulvibazar', lat: 24.6758, lng: 91.6341 },
    { name: 'Hazrat Syed Hamza Bukhari (Rah.)', title: 'Juri Spiritual Heritage', address: 'Juri, Moulvibazar', lat: 24.6024, lng: 92.1257 },
    { name: 'Hazrat Shah Sufi Shamsuddin (Rah.)', title: 'Beanibazar Heritage', address: 'Beanibazar, Sylhet', lat: 24.9132, lng: 92.1681 },
    { name: 'Hazrat Shah Noman Faqir (Rah.)', title: 'Sunamganj Spiritual Centre', address: 'Jamalganj, Sunamganj', lat: 25.0057, lng: 91.2058 },
    { name: 'Hazrat Syed Nasiruddin Sipah Salar (Rah.)', title: 'Taraf Legacy', address: 'Taraf, Habiganj', lat: 24.3745, lng: 91.4102 },
    { name: 'Hazrat Shah Jalaaluddin Tabrizi (Rah.) Legacy Site', title: 'Greater Sylhet Sufi Route', address: 'Chunarughat belt, Habiganj', lat: 24.1227, lng: 91.5189 },
    { name: 'Hazrat Shah Sultan (Rah.) Regional Shrine', title: 'Brahman Shasan Route', address: 'Madhabpur, Habiganj', lat: 24.0984, lng: 91.3728 },
    { name: 'Hazrat Shah Abdul Karim (Rah.) Memory Site', title: 'Baul-Sufi Heritage', address: 'Ujan Dhol, Sunamganj', lat: 25.0654, lng: 91.4053 },
    { name: 'Hazrat Shah Arifin (Rah.) Regional Mazar', title: 'Companion Network Tradition', address: 'Bishwanath, Sylhet', lat: 24.8618, lng: 91.7912 },
    { name: 'Hazrat Shah Daud Qureshi (Rah.) Regional Mazar', title: 'Frontline Legacy', address: 'Balaganj, Sylhet', lat: 24.6848, lng: 91.8433 },
    { name: 'Hazrat Shah Miror (Rah.) Regional Shrine', title: 'Historic Mazar Belt', address: 'Golapগঞ্জ, Sylhet', lat: 24.8597, lng: 92.0153 },
    { name: 'Hazrat Shah Ismail (Rah.) Heritage Site', title: 'Companion Legacy', address: 'Zakiganj, Sylhet', lat: 24.8764, lng: 92.3006 },
    { name: 'Hazrat Shah Borkot (Rah.) Local Shrine', title: 'Rural Sufi Heritage', address: 'Kanaighat, Sylhet', lat: 25.0146, lng: 92.2659 },
    { name: 'Hazrat Shah Faizullah (Rah.) Local Shrine', title: 'Companion Heritage Route', address: 'Fenchuganj, Sylhet', lat: 24.7021, lng: 91.9803 },
    { name: 'Hazrat Shah Abdul Latif (Rah.) Local Shrine', title: 'Tea-Garden Region Heritage', address: 'Sreemangal, Moulvibazar', lat: 24.3065, lng: 91.7296 },
    { name: 'Hazrat Shah Wajed (Rah.) Local Shrine', title: 'Northern Sylhet Route', address: 'Chhatak, Sunamganj', lat: 25.0388, lng: 91.6692 },
    { name: 'Hazrat Shah Kalan (Rah.) Local Shrine', title: 'Haor Region Heritage', address: 'Derai, Sunamganj', lat: 24.7934, lng: 91.3385 }
];

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

// --- Main App Component ---
function App() {
    return (
        <Router>
            <MainLayout />
        </Router>
    );
}

// --- Layout Component ---
const MainLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navLinks = [
        { name: 'হোম', path: '/' }, { name: 'পরিচিতি', path: '/about' },
        { name: 'হযরত শাহজালাল (রহ.) এর যাত্রা', path: '/timeline' }, { name: 'শিক্ষা', path: '/teachings' },
        { name: '৩৬০ আউলিয়া', path: '/companions' }, { name: 'লোকেশন', path: '/locations' },
        { name: 'বই তালিকা', path: '/book-list' }, { name: 'গবেষণা', path: '/library' },
    ];
    useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

    return (
        <div className="app-container"><nav className="navbar"><div className="navbar-content container"><Link to="/" className="navbar-logo"><img src={logo} alt="Shahjalal Library Corner Logo" /><div className="navbar-brand"><span>শাহজালাল লাইব্রেরি কর্নার</span><small className="navbar-brand-subtitle">SUST Central Library Islamic Corner</small></div></Link><div className="navbar-links-desktop">{navLinks.map(link => (<Link key={link.name} to={link.path} className={location.pathname === link.path ? 'nav-link active' : 'nav-link'}>{link.name}</Link>))}</div><div className="navbar-mobile-toggle"><button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={28}/> : <Menu size={28}/>}</button></div></div><AnimatePresence>{isMenuOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="navbar-mobile-menu"><div className="mobile-menu-links">{navLinks.map(link => (<Link key={link.name} to={link.path} className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>{link.name}</Link>))}</div></motion.div>)}</AnimatePresence></nav>
            <main>
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/timeline" element={<TimelinePage />} />
                        <Route path="/teachings" element={<TeachingsPage />} />
                        <Route path="/companions" element={<CompanionsPage />} />
                        <Route path="/locations" element={<LocationsPage />} />
                        <Route path="/library" element={<LibraryPage />} />
                        {/* --- ADDED ROUTE FOR DEVELOPERS PAGE --- */}
                        <Route path="/developers" element={<DevelopersPage />} />
                        {/* --- ADDED ROUTES FOR NEW COMPONENTS --- */}
                        <Route path="/books" element={<Books />} />
                        <Route path="/book-list" element={<BookList />} />
                        <Route path="/sust" element={<SUST />} />
                        <Route path="/mazar" element={<Mazar />} />
                        <Route path="/pdf-viewer" element={<PdfViewer />} />
                        <Route path="/quran/:number" element={<QuranSurahPage />} />
                    </Routes>
                </AnimatePresence>
            </main>
            <footer className="footer"><div className="footer-content container"><div><h3 className="footer-heading">Shahjalal Library Corner</h3><p className="footer-text">A center for knowledge and reflection at Shahjalal University of Science and Technology.</p></div><div><h3 className="footer-heading">Contact Us</h3><ul className="footer-list"><li><MapPin size={16} /><span>SUST, Sylhet-3114, Bangladesh</span></li><li><Mail size={16} /><span>librarian@sust.edu</span></li><li><Phone size={16} /><span>+880-821-713491</span></li></ul></div><div><h3 className="footer-heading">Important Links</h3><ul className="footer-list"><li><a href="https://www.sust.edu" target="_blank" rel="noopener noreferrer">SUST Official Website</a></li><li><a href="https://library.sust.edu" target="_blank" rel="noopener noreferrer">SUST Central Library</a></li>{/* --- ADDED LINK TO DEVELOPERS PAGE --- */}<li><Link to="/developers">ডেভেলপারস</Link></li></ul></div></div><div className="footer-bottom"><p>© {new Date().getFullYear()} Shahjalal Library Corner. All Rights Reserved.</p></div></footer>
        </div>
    );
};

// --- Page Components ---
const PageWrapper = ({ children, className }) => (<motion.div className={className} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>{children}</motion.div>);

const MapAutoFitBounds = ({ points, maxZoom = 10, padding = [40, 40] }) => {
    const map = useMap();

    useEffect(() => {
        if (!points || points.length === 0) return;

        if (points.length === 1) {
            map.setView([points[0].lat, points[0].lng], maxZoom);
            return;
        }

        const bounds = L.latLngBounds(points.map((point) => [point.lat, point.lng]));
        map.fitBounds(bounds, { padding, maxZoom });
    }, [map, points, maxZoom, padding]);

    return null;
};

const HomePage = () => {
    return (
        <PageWrapper>
            <section className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}><div className="hero-overlay"></div><div className="hero-content"><h1 className="hero-title">اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</h1><p className="hero-subtitle">"Read in the name of your Lord who created." (Qur'an 96:1)</p></div></section>
            <section className="theme-intro-section">
                <div className="theme-intro-grid">
                    <div className="theme-intro-card"><Heart size={28} /><h3 className="theme-intro-title">হযরত শাহজালাল (রহ.) এর ঐতিহ্য</h3><p className="theme-intro-text">আধ্যাত্মিকতা, সেবা ও মানবিকতার ঐতিহ্যকে কেন্দ্র করে এই কর্নার সাজানো হয়েছে।</p></div>
                    <div className="theme-intro-card"><Building size={28} /><h3 className="theme-intro-title">SUST ও কেন্দ্রীয় গ্রন্থাগার</h3><p className="theme-intro-text">শাহজালাল বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের জ্ঞানচর্চা ও গবেষণার পরিবেশকে ইসলামী কর্নারের সাথে যুক্ত করা হয়েছে।</p></div>
                    <div className="theme-intro-card"><BookIcon size={28} /><h3 className="theme-intro-title">ইসলামিক বুক কর্নার</h3><p className="theme-intro-text">হাদিস, তাফসির, ফিকহ, জীবনী ও আত্মশুদ্ধিমূলক বই নিয়ে একটি সমৃদ্ধ ডিজিটাল সংগ্রহ।</p></div>
                </div>
            </section>
            <section className="content-section"><div className="content-grid container"><div className="text-content"><h2 className="section-title">Shahjalal University of Science and Technology</h2><p className="section-paragraph">Named in honor of the great saint, SUST is a leading public university in Bangladesh, renowned for its excellence in science, technology, and research, fostering innovation and knowledge since its inception in 1986.</p></div><motion.img whileHover={{scale: 1.05}} src={sustCampusImg} alt="SUST Campus" className="content-image"/></div></section>
            <section className="content-section-alt"><div className="content-grid container"><motion.img whileHover={{scale: 1.05}} src={dargahSharifImg} alt="Hazrat Shahjalal (Rah.) Dargah Sharif" className="content-image order-md-2"/><div className="text-content order-md-1"><h2 className="section-title">Hazrat Shahjalal (Rah.) Dargah Sharif</h2><p className="section-paragraph">A revered spiritual center and the final resting place of Hazrat Shahjalal (Rah.), located in Ambarkhana, Sylhet. It is a place of peace, prayer, and pilgrimage, attracting devotees from all over the world seeking blessings and tranquility.</p></div></div></section>
            {/* --- FIGMA DESIGN PHOTO GALLERY SECTION --- */}
            <section className="photo-gallery-section bg-white py-16">
                <div className="container mx-auto px-4">
                    {/* Title */}
                    <h2 className="text-6xl font-normal text-center mb-8" style={{
                        fontFamily: 'Palanquin, sans-serif',
                        fontSize: '72px',
                        lineHeight: '43px',
                        color: '#181433'
                    }}>
                        Photo Gallery
                    </h2>
                    
                    {/* Description */}
                    <p className="text-center mb-12 max-w-4xl mx-auto" style={{
                        fontFamily: 'Inika, serif',
                        fontWeight: '700',
                        fontSize: '30px',
                        lineHeight: '22px',
                        color: '#181433'
                    }}>
                        Explore the serene beauty of Shah Jalal Dargah Sharif and the vibrant campus life at SUST
                    </p>
                    
                    {/* Photo Frames Grid */}
                    <div className="flex justify-center gap-8 max-w-7xl mx-auto">
                        {/* Photo Frame 0 - MAZAR/DARGAH IMAGES */}
                        <div className="flex flex-col gap-8">
                            <div className="relative" style={{width: '605px', height: '779px'}}>
                                <img 
                                    src={require('./assets/Mazar/Shahjalal-Mazar-Dargah-Shahjalal-Sylhet.jpg')}
                                    alt="Shahjalal Mazar Dargah"
                                    className="w-full h-full object-cover"
                                    style={{
                                        borderRadius: '327.6px 327.6px 0 0'
                                    }}
                                />
                            </div>
                            <div className="relative" style={{width: '621px', height: '812px'}}>
                                <img 
                                    src={require('./assets/Mazar/Feeding the Pigeons.webp')}
                                    alt="Feeding Pigeons at Mazar"
                                    className="w-full h-full object-cover"
                                    style={{
                                        borderRadius: '327.6px 327.6px 0 0'
                                    }}
                                />
                            </div>
                        </div>
                        
                        {/* Photo Frame 1 - SUST CAMPUS IMAGES */}
                        <div className="flex flex-col gap-8">
                            <div className="relative" style={{width: '605px', height: '779px'}}>
                                <img 
                                    src={require('./assets/SUST/central_library1.jpg')}
                                    alt="SUST Central Library"
                                    className="w-full h-full object-cover"
                                    style={{
                                        borderRadius: '327.6px 327.6px 0 0'
                                    }}
                                />
                            </div>
                            <div className="relative" style={{width: '621px', height: '812px'}}>
                                <img 
                                    src={require('./assets/SUST/sust gate.jpg')}
                                    alt="SUST Main Gate"
                                    className="w-full h-full object-cover"
                                    style={{
                                        borderRadius: '327.6px 327.6px 0 0'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- ENRICHED A BRIEF JOURNEY --- */}
            <section className="content-section-alt">
                <h2 className="section-title text-center">A Brief Journey</h2>
                <p className="section-paragraph text-center max-w-2xl mx-auto mb-6">
                    Trace the footsteps of Hazrat Shahjalal (Rah.) and his companions as they shaped the spiritual landscape of Bengal.
                </p>
                {/* Short 5-step timeline */}
                <div className="journey-grid container">
                  {/* 1 */}
                  <div className="journey-card">
                    <p className="journey-card-year">c. 1271</p>
                    <h3 className="journey-card-title">Birth & Early Life</h3>
                    <p className="journey-card-desc">Born in Konya (Turkey) or Yemen, Shah Jalal was raised by his uncle Syed Ahmed Kabir in Mecca, excelling in Islamic studies and spiritual training.</p>
                  </div>
                  {/* 2 */}
                  <div className="journey-card">
                    <p className="journey-card-year">c. 1300</p>
                    <h3 className="journey-card-title">Journey to India</h3>
                    <p className="journey-card-desc">Following his uncle's guidance, he traveled east, meeting Sufi masters in Ajmer and Delhi, and received a handful of soil to find his destined land.</p>
                  </div>
                  {/* 3 */}
                  <div className="journey-card">
                    <p className="journey-card-year">1303</p>
                    <h3 className="journey-card-title">Conquest of Sylhet</h3>
                    <p className="journey-card-desc">Joined the Muslim army with 360 companions, defeated Raja Gour Govinda, and established Muslim rule in Sylhet.</p>
                  </div>
                  {/* 4 */}
                  <div className="journey-card">
                    <p className="journey-card-year">After 1303</p>
                    <h3 className="journey-card-title">Spiritual Mission</h3>
                    <p className="journey-card-desc">Settled in Sylhet, spreading Islam and guiding thousands. His disciples established khanqahs and spread teachings across Bengal.</p>
                  </div>
                  {/* 5 */}
                  <div className="journey-card">
                    <p className="journey-card-year">1346</p>
                    <h3 className="journey-card-title">Legacy</h3>
                    <p className="journey-card-desc">Passed away in Sylhet. His shrine remains a major spiritual center, and his legacy endures through his teachings and companions.</p>
                  </div>
                </div>
                <blockquote className="mt-8 text-center italic text-slate-600 max-w-xl mx-auto">
                    “The journey of a thousand miles begins with a single step.” — Lao Tzu<br/>
                    <span className="text-xs">Shahjalal’s journey changed the course of Bengal’s history.</span>
                </blockquote>
            </section>
            {/* --- TOP 5 AULIAS SECTION --- */}
            <section className="content-section">
              <h2 className="section-title text-center">Top 5 Aulias (Companions)</h2>
              <p className="section-paragraph text-center max-w-2xl mx-auto mb-6">
                The most prominent companions of Hazrat Shahjalal (Rah.) played vital roles in the spiritual and social transformation of Bengal. Here are five of the most renowned aulias:
              </p>
              <div className="companions-grid container">
                {/* Shah Paran */}
                <div className="companion-card">
                  <h3 className="companion-card-name">Hazrat Shah Paran (R.A.)</h3>
                  <p className="companion-card-subtitle">Nephew & Closest Disciple</p>
                  <p><b>Origin:</b> Hadhramaut, Yemen</p>
                  <p><b>Legacy:</b> Guided Sylhet after Shah Jalal, built mosques and teaching centers. His shrine is a major pilgrimage site in Khadim Nagar, Sylhet.</p>
                </div>
                {/* Shah Kamal Quhafah */}
                <div className="companion-card">
                  <h3 className="companion-card-name">Hazrat Shah Kamal Quhafah (R.A.)</h3>
                  <p className="companion-card-subtitle">Founder of Shaharpara</p>
                  <p><b>Origin:</b> Yemen / Mecca</p>
                  <p><b>Legacy:</b> Established the spiritual village of Shaharpara, Sunamganj. His lineage became highly influential in the region.</p>
                </div>
                {/* Shah Malum */}
                <div className="companion-card">
                  <h3 className="companion-card-name">Hazrat Shah Malum (R.A.)</h3>
                  <p className="companion-card-subtitle">General & Guide</p>
                  <p><b>Origin:</b> Gujarat, India</p>
                  <p><b>Legacy:</b> Key figure in the conquest of Sylhet, established a khanqah in Fenchuganj. Revered for his wisdom and leadership.</p>
                </div>
                {/* Makhdum Shah Daulah */}
                <div className="companion-card">
                  <h3 className="companion-card-name">Makhdum Shah Daulah (R.A.)</h3>
                  <p className="companion-card-subtitle">Martyr of Shahzadpur</p>
                  <p><b>Origin:</b> Middle East</p>
                  <p><b>Legacy:</b> Spread Islam in Sirajganj, martyred in Shahzadpur. His dargah is a center of devotion and history.</p>
                </div>
                {/* Shah Gabru */}
                <div className="companion-card">
                  <h3 className="companion-card-name">Hazrat Shah Gabru (R.A.)</h3>
                  <p className="companion-card-subtitle">Panch Pir (Five Saints)</p>
                  <p><b>Origin:</b> Afghanistan</p>
                  <p><b>Legacy:</b> Settled in Osmani Nagar, fostered interfaith harmony, and established a khanqah. The village Gabhurteki is named after him.</p>
                </div>
              </div>
            </section>
        </PageWrapper>
    );
};

const AboutPage = () => {
    return (
        <PageWrapper className="container py-16">
            <h1 className="section-title text-center mb-12">About the Shahjalal Library Corner</h1>
            <div className="content-grid">
                <div className="text-content">
                    <h2 className="text-2xl font-bold text-slate-800">Our Vision</h2>
                    <p className="section-paragraph">The Shahjalal Library Corner (Shahjalal Library Corner) is a dedicated initiative by Shahjalal University of Science and Technology to create a modern hub for Islamic knowledge, research, and dialogue. It serves as a bridge between the timeless wisdom of Islamic heritage and the dynamic inquiries of contemporary academia. Our mission is to preserve and disseminate the teachings of Hazrat Shahjalal (Rah.) and his companions, fostering an environment of learning and spiritual reflection for students, scholars, and the wider community.</p>
                </div>
                <img src={hq720} alt="SUST Campus" className="content-image"/>
            </div>
             <div className="text-center my-16">
                <h2 className="section-title">A Message from the Vice-Chancellor</h2>
                <div className="aspect-w-16 aspect-h-9 max-w-3xl mx-auto">
                     <iframe className="w-full h-full rounded-lg shadow-xl" style={{aspectRatio: '16/9'}} src="https://www.youtube.com/embed/HE6Tc_quuK0" title="SUST Vice Chancellor Speech" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
            </div>
        </PageWrapper>
    );
};

const TimelinePage = () => {
    // Corrected data array without syntax errors
    const events = [
        {
            title: "Birth & Early Life",
            meta: "c. 1271 CE | Hadhramaut, Yemen",
            description: "Born into a pious family, he lost his parents early and was raised by his uncle, Syed Ahmad Kabir Suhrawardy, who guided his spiritual education."
        },
        {
            title: "Spiritual Training",
            meta: "Mecca & Tokkent",
            description: "Studied under his uncle, achieving kamaliyat (spiritual perfection) after approximately 30 years of devotion."
        },
        {
            title: "Handful of Soil Vision",
            meta: "Mecca",
            description: "His uncle gave him sacred soil and instructed him to travel to India to find matching earth, symbolizing his destined mission."
        },
        {
            title: "Journey through India",
            meta: "c. 1300–1303 CE | Ajmer → Delhi → Bengal",
            description: "Met Sufi masters like Khwaja Gharib Nawaz in Ajmer and Nizamuddin Aulia in Delhi."
        },
        {
            title: "Gift of Jalali Pigeons",
            meta: "Delhi",
            description: "In Delhi, Nizamuddin Aulia gifted him two special pigeons; their descendants still reside at Shah Jalal’s shrine."
        },
        {
            title: "Call to Sylhet",
            meta: "Bengal",
            description: "A Muslim in Sylhet was tortured under Gour Govinda’s rule, prompting Shah Jalal’s journey with 360 Auliyas to aid the Sultan's army."
        },
        {
            title: "Battle Preparations",
            meta: "Bengal",
            description: "He joined forces with Sultan Firoz Shah’s generals and the army led by Sikandar Khan Ghazi and Nasiruddin."
        },
        {
            title: "Miraculous River Crossing",
            meta: "Surma River, Sylhet",
            description: "Blocked from crossing the Surma River, Shah Jalal reportedly sat on his prayer mat—legend says it floated, leading to their miraculous river crossing."
        },
        {
            title: "Azan and Palace Collapse",
            meta: "Sylhet",
            description: "After hearing the call to prayer, Gour Govinda’s palace allegedly crumbled—a legendary sign of spiritual victory."
        },
        {
            title: "Conquest of Sylhet",
            meta: "1303 CE",
            description: "Victory in 1303 ended Gour Govinda’s rule; 360 companions settled across Bengal to spread Islam."
        },
        {
            title: "Soil Confirmation",
            meta: "Sylhet",
            description: "After conquest, he found the ground in Sylhet matched the sacred soil—a confirmation of his destined home."
        },
        {
            title: "Settlement at Chawkidighi",
            meta: "Sylhet",
            description: "Spearheaded the development of Sylhet’s Dargah area and began missionary activities."
        },
        {
            title: "Spread to Neighboring Regions",
            meta: "Bengal",
            description: "Sent disciples like Shah Paran to Sylhet, Shah Malek to Dhaka, and Syed Nasiruddin to Taraf, expanding Islam’s reach."
        },
        {
            title: "Contact with Ibn Battuta",
            meta: "1345 CE | Sylhet",
            description: "The famed traveler met Shah Jalal, describing him as tall and living simply, with only a goat for sustenance."
        },
        {
            title: "Famous Visitors",
            meta: "Sylhet",
            description: "Ibn Battuta noted his companions were brave foreigners, devoted to spiritual service."
        },
        {
            title: "Miracles of the Shrine",
            meta: "Dargah Sharif, Sylhet",
            description: "The Zamzam-like well and waterfall at his shrine are believed to offer healing waters."
        },
        {
            title: "Sacred Ponds & Fish",
            meta: "Dargah Sharif, Sylhet",
            description: "Shrine features ponds with golden and silver fish; birds and fish are considered sacred."
        },
        {
            title: "Charity Cooking Pots",
            meta: "Dargah Sharif, Sylhet",
            description: "Three massive pots at the shrine symbolize communal charity—used historically in large-scale feeding."
        },
        {
            title: "Refused Imperial Honors",
            meta: "Sylhet",
            description: "Declined royal titles, land grants, and tax privileges—insisting on spiritual purity and poverty."
        },
        {
            title: "Tax-Exempt Sylhet",
            meta: "Legend",
            description: "Legend says Emperor Alauddin Khilji granted Sylhet tax exemption in honor of Shah Jalal."
        },
        {
            title: "Dargah Complex Expansion",
            meta: "Posthumously",
            description: "The shrine was expanded by custodians and now includes one of Bangladesh’s largest mosques."
        },
        {
            title: "Custodian Sareqaum Lineage",
            meta: "From 1346 CE",
            description: "The first custodian, Haji Yusuf, was appointed in 1346; his descendants (Sareqaum family) still manage the waqf."
        },
        {
            title: "Annual Urs Celebration",
            meta: "Late Sept - Early Oct",
            description: "His death anniversary (Urs) is observed with communal firewood gathering at Lakkatura hill."
        },
        {
            title: "Death & Legacy",
            meta: "15 March 1346 CE",
            description: "Passed away on 20 Dhul Qadah 746 AH. Known as 'al-Mujarrad' (The Celibate), he left no descendants."
        },
        {
            title: "Enduring Impact",
            meta: "Present Day",
            description: "His shrine attracts thousands daily, making Sylhet a holy city. The international airport carries his name."
        }
    ];


    return (
        <PageWrapper className="container py-16">
            <h1 className="section-title text-center mb-4">The Life of Hazrat Shahjalal (Rah.)</h1>
             <p className="section-paragraph text-center max-w-3xl mx-auto mb-12">
                Follow the blessed journey of Hazrat Shahjalal al-Mujarrad al-Yemini (R.A.), from his origins in Yemen to his establishment of a spiritual beacon in Sylhet.
            </p>
            <div className="timeline-container">
                {events.map((event, index) => (
                    <div className="timeline-item" key={index}>
                        <motion.div 
                            className="timeline-icon"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: Math.min(index * 0.03, 0.45) }}
                        >
                            {index + 1}
                        </motion.div>
                        <motion.div 
                            className="timeline-content"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.45) }}
                        >
                            <h3 className="timeline-title">{event.title}</h3>
                            <p className="timeline-meta">{event.meta}</p>
                            <p className="timeline-description">{event.description}</p>
                        </motion.div>
                    </div>
                ))}
            </div>
        </PageWrapper>
    );
};

const TeachingsPage = () => {
    const [backendQuotes, setBackendQuotes] = useState([]);
    const [backendBooks, setBackendBooks] = useState([]);
    const [showQuran, setShowQuran] = useState(false);
    const [quranSurahs, setQuranSurahs] = useState([]);
    const [loadingQuran, setLoadingQuran] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/content/all`)
            .then(res => res.json())
            .then(data => {
                setBackendQuotes(data.quotes || []);
                setBackendBooks(data.books || []);
            });
    }, []);

    // Fetch Quran surahs from AlQuran.Cloud API
    useEffect(() => {
        if (showQuran && quranSurahs.length === 0) {
            setLoadingQuran(true);
            QuranService.getAllSurahs()
                .then(surahs => {
                    // Get Bengali names mapping
                    const bengaliNames = QuranService.getBengaliSurahNames();
                    
                    // Transform the API data to match our format
                    const transformedSurahs = surahs.map(surah => ({
                        number: surah.number,
                        name: surah.name,
                        bangla: bengaliNames[surah.number] || surah.name,
                        englishName: surah.englishName,
                        arabicName: surah.arabicName,
                        revelationType: surah.revelationType,
                        numberOfAyahs: surah.numberOfAyahs
                    }));
                    setQuranSurahs(transformedSurahs);
                })
                .catch(error => {
                    console.error('Error fetching Quran surahs:', error);
                    // Fallback to hardcoded data if API fails
                    setQuranSurahs(fallbackQuranSurahs);
                })
                .finally(() => {
                    setLoadingQuran(false);
                });
        }
    }, [showQuran, quranSurahs.length]);

    // Merge all quotes
    const allQuotes = [
        ...backendQuotes.map(q => q.text),
        ...quotesArray
    ];

    // Merge books from backend and Books.js, remove duplicates by title
    const booksMap = new Map();
    backendBooks.forEach(book => booksMap.set(book.title, book));
    booksArray.forEach(book => {
        if (!booksMap.has(book.title)) booksMap.set(book.title, book);
    });
    const allBooks = Array.from(booksMap.values());

    return (
        <PageWrapper className="container py-16">
            <div className="teachings-hero">
                <div className="bismillah">اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</div>
                <div className="subtitle">"Read in the name of your Lord who created." (Qur'an 96:1)</div>
                <img src={process.env.PUBLIC_URL + '/logo.png'} alt="SUST Logo" style={{height: 60, margin: '1rem auto'}} />
                <h1 className="section-title text-center mb-2" style={{color:'#235B3F'}}>Shahjalal(Rah.) Teachings and Legacy</h1>
            </div>
            {/* --- Feature Option: Quran Sharif --- */}
            <div className="text-center my-6">
                <button className="explore-button" onClick={() => setShowQuran(v => !v)}>
                    {showQuran ? 'Hide Quran Sharif' : 'Explore Quran Sharif (114 Surahs)'}
                </button>
            </div>
            {/* --- Quran Sharif Section --- */}
            {showQuran && (
                <section className="quran-section mb-12">
                    <h2 className="section-title text-center mb-4">Quran Sharif - 114 Surahs</h2>
                    
                    {/* Quran Search Component */}
                    <div className="mb-8">
                        <QuranSearch />
                    </div>
                    
                    {loadingQuran ? (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#235B3F]"></div>
                            <p className="mt-2 text-gray-600">Loading Quran surahs...</p>
                        </div>
                    ) : (
                        <div className="quran-surah-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {quranSurahs.map(surah => (
                                <div key={surah.number} className="quran-surah-card p-4 bg-white rounded shadow hover:bg-slate-50 transition">
                                    <Link to={`/quran/${surah.number}`} className="font-bold text-lg text-[#235B3F]">
                                        {surah.number}. {surah.name} 
                                        <span className="text-slate-500 block text-sm mt-1">
                                            {surah.arabicName} • {surah.numberOfAyahs} Ayahs
                                        </span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}
            <div className="teachings-edu-note">
                <strong>"The seeking of knowledge is obligatory for every Muslim."</strong><br/>
                <span>(Sunan Ibn Majah, Hadith 224) — Islamic tradition places the highest value on learning, reflection, and sharing wisdom. Explore the quotes and books below to enrich your mind and spirit.</span>
            </div>
            <section className="teachings-section" id="quotes">
                <h2 className="teachings-section-title"><Quote style={{display:'inline',marginRight:8}}/> Quotes & Sayings</h2>
                <div className="teachings-card-grid">
                    {allQuotes.filter(Boolean).map((quote, idx) => (
                        <blockquote key={idx} className="teachings-quote-card">
                            <span style={{fontSize:'1.5rem',color:'#235B3F',marginBottom:8}}><Quote/></span>
                            <span>{quote}</span>
                        </blockquote>
                    ))}
                </div>
            </section>
            <section className="teachings-section" id="books">
                <h2 className="teachings-section-title"><BookIcon style={{display:'inline',marginRight:8}}/> Books & Literature</h2>
                <div className="teachings-card-grid">
                    {allBooks.map((book, idx) => (
                        <div key={idx} className="teachings-book-card">
                            {book.coverImageUrl && (
                                <img src={book.coverImageUrl.startsWith('http') ? book.coverImageUrl : book.coverImageUrl ? `${API_ORIGIN}/${book.coverImageUrl}` : process.env.PUBLIC_URL + '/Books/Annual Urs.jpg'} alt={book.title} className="teachings-book-cover" onError={e => {e.target.onerror=null; e.target.src=process.env.PUBLIC_URL + '/Books/Annual Urs.jpg';}}/>
                            )}
                            <div className="teachings-book-title">{book.title}</div>
                            <div style={{display:'flex',justifyContent:'center',gap:'0.5rem',marginBottom:'1rem'}}>
                                {book.file && <a href={book.file} target="_blank" rel="noopener noreferrer" className="teachings-action-btn">Read Online</a>}
                                {book.file && <a href={book.file} download className="teachings-action-btn" style={{background:'#fff',color:'#235B3F',border:'1.5px solid #235B3F'}}>Download</a>}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </PageWrapper>
    );
};

const CompanionsPage = () => {
    // Data extracted from the provided 359.docx file
    const companions = [
        {
            icon: <UserCheck />,
            name: "Hazrat Shah Paran (R.A.)",
            title: "Qutub of Sylhet",
            origin: "Nephew of Shah Jalal, born in Hadhramaut.",
            legacy: "Continued to guide the people after Shah Jalal’s mission. He is remembered for building mosques, water tanks, and teaching centers. His shrine is in Khadim Nagar, Sylhet."
        },
        {
            icon: <Shield />,
            name: "Hazrat Shah Jad Ali al-Yemeni (R.A.)",
            title: "Early Missionary & Commander",
            origin: "Yemen",
            legacy: "A key lieutenant in the military and spiritual campaign, he helped organize new Muslim communities and was respected for his bravery and gentle preaching."
        },
        {
            icon: <Building />,
            name: "Hazrat Shah Ali al-Yemeni (R.A.)",
            title: "Community Builder & Scholar",
            origin: "Yemen",
            legacy: "An important educator who set up learning centers and khanqahs (Sufi lodges). He is known for translating core Islamic values into local culture peacefully."
        },
        {
            icon: <Star />,
            name: "Hazrat Shah Arif al-Yemeni (R.A.)",
            title: "Arif Billah (“The One Who Knows Allah”)",
            origin: "Yemen",
            legacy: "Known for his intense spirituality and asceticism. He trained disciples in dhikr (remembrance) and emphasized inner purification across Sylhet’s hill regions."
        },
        {
            icon: <Compass />,
            name: "Hazrat Shah Kamal al-Yemeni (R.A.)",
            title: "Founder of Shaharpara",
            origin: "Yemen / Possibly Mecca (Qurayshi descent)",
            legacy: "Credited with founding the spiritual village of Shaharpara in Sunamganj, where he set up institutions for education, retreat, and governance. His lineage became highly influential."
        },
        {
            icon: <Heart />,
            name: "Hazrat Shah Muhammad Ayub al-Yemeni (R.A.)",
            title: "Da’ee (Missionary Preacher)",
            origin: "Yemen",
            legacy: "Settled in a remote village, converting locals through kindness. He emphasized family, moral conduct, and agriculture. Oral histories speak of his healing abilities."
        },
        {
            icon: <Feather />,
            name: "Hazrat Shah Tajuddin al-Qureshi (R.A.)",
            title: "Jurist and Scholar",
            origin: "Quraysh tribe (Arabian Peninsula)",
            legacy: "Brought Qurayshi jurisprudential knowledge to Sylhet, acting as a qadi (Islamic judge). His authoritative fatwas paved the way for formal Sharia-based local governance."
        },
        {
            icon: <Droplet />,
            name: "Hazrat Shah Halim Uddin al-Qureshi (R.A.)",
            title: "Social Reformer",
            origin: "Descendant of Quraysh",
            legacy: "Focused on the rights of the poor and just distribution of zakat. He helped organize early welfare systems and urged Muslims to integrate service with devotion."
        },
        {
            icon: <Anchor />,
            name: "Hazrat Shah Daud al-Qureshi (R.A.)",
            title: "Defender of the Faith",
            origin: "Qurayshi, warrior lineage",
            legacy: "Fought on the frontlines against Gour Govinda. He protected new Muslim converts and helped establish Friday prayer sites. His mazar is visited for courage."
        },
        {
            icon: <Award />,
            name: "Hazrat Haydar Ghazi (Nūr al-Hudā)",
            title: "Second Wazir (Governor) of Sylhet",
            origin: "Yemen / Arab descent",
            legacy: "After the conquest, he was appointed governor of Sylhet and later governed Sonargaon. Known as a just administrator, his shrine remains in Sonargaon."
        },
        {
            icon: <Shield />,
            name: "Syed Shah Nasiruddin (Sipah Salar)",
            title: "Commander of the Sultan's Army",
            origin: "Baghdad (Syed family)",
            legacy: "Served as the army commander, joining forces with Shah Jalal. He later captured and governed Taraf (Habiganj). His shrine there is a major pilgrimage center."
        },
        {
            icon: <Gem />,
            name: "Hazrat Shah Gabru (Shaykh Gharib Khan)",
            title: "One of the Panch Pir (Five Saints)",
            origin: "Afghanistan",
            legacy: "Settled in Osmani Nagar, establishing a khanqah. His marriage into a local Hindu family fostered interfaith connection. The village Gabhurteki is named in his honor."
        }
    ];

    return (
        <PageWrapper className="container py-16">
            <h1 className="section-title text-center mb-4">The Noble Companions</h1>
            <p className="section-paragraph text-center max-w-3xl mx-auto mb-12">
                The 360 Auliyas (saints or 'friends of Allah') who accompanied Hazrat Shahjalal (Rah.) were not just warriors, but pioneers of faith, culture, and community. Each carried a unique light, illuminating the region with their wisdom, leadership, and devotion. Below are some of these revered personalities.
            </p>
            <div className="companions-grid">
                {companions.map(companion => (
                    <div key={companion.name} className="companion-card">
                        <div className="companion-card-header">
                            <div className="companion-card-title-group">
                                <span className="companion-card-icon">{companion.icon}</span>
                                <div>
                                    <h3 className="companion-card-name">{companion.name}</h3>
                                    <p className="companion-card-subtitle">{companion.title}</p>
                                </div>
                            </div>
                        </div>
                        <div className="companion-card-body">
                            <h4>Origin</h4>
                            <p>{companion.origin}</p>
                            <h4>Legacy</h4>
                            <p>{companion.legacy}</p>
                        </div>
                    </div>
                ))}
            </div>
        </PageWrapper>
    );
};


const LocationsPage = () => {
    const [mazars, setMazars] = useState([]);

    const libraryLocation = {
        name: 'Shahjalal Library Corner',
        title: 'SUST Central Library Islamic Corner',
        address: 'SUST Central Library, Akhalia, Sylhet-3114',
        lat: 24.920792,
        lng: 91.832605
    };

    const dargahLocation = {
        name: 'Hazrat Shahjalal (Rah.) Dargah Sharif',
        title: 'Ambarkhana, Sylhet City',
        address: 'Dargah Gate, Ambarkhana, Sylhet',
        lat: 24.886076,
        lng: 91.867587
    };

    useEffect(() => {
        const loadMazarLocations = async () => {
            try {
                const response = await fetch(`${API_URL}/mazars/sylhet`);
                if (!response.ok) throw new Error('Failed to fetch mazar locations');
                const data = await response.json();
                const normalized = (data.mazars || []).filter(item => Number.isFinite(item.lat) && Number.isFinite(item.lng));
                setMazars(normalized.length > 0 ? normalized : FALLBACK_SYLHET_MAZARS);
            } catch (error) {
                setMazars(FALLBACK_SYLHET_MAZARS);
            }
        };

        loadMazarLocations();
    }, []);

    return (
        <PageWrapper className="container py-16">
            <h1 className="section-title text-center mb-12">Maps & Directions</h1>
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Shahjalal Library Corner (Shahjalal Library Corner)</h2>
                    <div className="w-full h-80 rounded-lg overflow-hidden shadow-xl border-4 border-white">
                        <MapContainer center={[libraryLocation.lat, libraryLocation.lng]} zoom={16} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[libraryLocation.lat, libraryLocation.lng]}>
                                <Popup>
                                    <strong>{libraryLocation.name}</strong><br />
                                    {libraryLocation.address}
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${libraryLocation.lat},${libraryLocation.lng}`} target="_blank" rel="noreferrer" className="inline-flex mt-3 text-[#235B3F] font-semibold">Open in Maps</a>
                </div>
                 <div>
                    <h2 className="text-2xl font-bold mb-4">Hazrat Shahjalal (Rah.) Dargah</h2>
                    <div className="w-full h-80 rounded-lg overflow-hidden shadow-xl border-4 border-white">
                        <MapContainer center={[dargahLocation.lat, dargahLocation.lng]} zoom={16} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={[dargahLocation.lat, dargahLocation.lng]}>
                                <Popup>
                                    <strong>{dargahLocation.name}</strong><br />
                                    {dargahLocation.address}
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${dargahLocation.lat},${dargahLocation.lng}`} target="_blank" rel="noreferrer" className="inline-flex mt-3 text-[#235B3F] font-semibold">Open in Maps</a>
                </div>
            </div>

            <div className="mt-16">
                <h2 className="section-title text-center mb-6">All Mazar Locations in Sylhet Region</h2>
                <p className="section-paragraph text-center max-w-3xl mx-auto mb-8">
                    Explore key mazars connected to the legacy of Hazrat Shahjalal (Rah.) and his companions. Click a marker to view details and open turn-by-turn directions.
                </p>

                <div className="bg-white rounded-lg shadow-md p-4">
                    <MapContainer center={[24.9, 91.87]} zoom={9} style={{ height: '620px', width: '100%' }} scrollWheelZoom={false}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <MapAutoFitBounds points={mazars} maxZoom={10} padding={[50, 50]} />
                        {mazars.map((mazar, index) => (
                            <Marker key={`${mazar.name}-${index}`} position={[mazar.lat, mazar.lng]}>
                                <Popup>
                                    <div style={{ minWidth: 200 }}>
                                        <h4 style={{ fontWeight: 700, marginBottom: 6 }}>{mazar.name}</h4>
                                        {mazar.title && <p style={{ margin: '4px 0' }}>{mazar.title}</p>}
                                        {mazar.address && <p style={{ margin: '4px 0' }}>{mazar.address}</p>}
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${mazar.lat},${mazar.lng}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{ color: '#235B3F', fontWeight: 700 }}
                                        >
                                            Open Directions
                                        </a>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Mazar Directory</h3>
                <ul className="space-y-2 font-sans">
                    {mazars.map((mazar, index) => (
                        <li key={`${mazar.name}-list-${index}`} className="border-b border-gray-100 pb-2">
                            <strong>{index + 1}. {mazar.name}</strong>
                            {mazar.address ? ` — ${mazar.address}` : ''}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-16">
                <h2 className="section-title text-center mb-6">How to Arrive</h2>
                <div className="max-w-2xl mx-auto font-sans bg-white p-6 rounded-lg shadow-md">
                    <p><strong>From Sylhet Bus Terminal:</strong> Take a CNG auto-rickshaw or local bus directly towards the SUST campus or Ambarkhana for the Dargah.</p>
                    <p className="mt-2"><strong>From Sylhet Railway Station:</strong> CNG auto-rickshaws are readily available. Ask for "SUST Gate" for the university or "Dargah Gate" for the Mazar.</p>
                </div>
            </div>
        </PageWrapper>
    );
};

const LibraryPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', institution: '', bookTitle: '', message: '' });
    const [status, setStatus] = useState('');

    const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Submitting...');
        try {
            const res = await fetch(`${API_URL}/research-request`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!res.ok) throw new Error('Submission failed');
            setStatus('Your request has been submitted successfully!');
            setFormData({ name: '', email: '', institution: '', bookTitle: '', message: '' });
        } catch (error) {
            setStatus('An error occurred. Please try again.');
        }
    };

    return (
        <PageWrapper className="container py-16">
            <h1 className="section-title text-center mb-12">Library Collection & Research</h1>
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Our Collection</h2>
                    <p className="section-paragraph">The Shahjalal Library Corner houses a growing collection of books and manuscripts focusing on Islamic history, Sufism, the life of Hazrat Shahjalal (Rah.), and the cultural heritage of the Bengal region. Our collection includes rare texts, modern academic works, and digital archives. While books cannot be lent out internationally, we welcome researchers to visit or submit requests for specific information.</p>
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-4">Submit a Research Request</h2>
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 font-sans">
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Full Name" required className="w-full p-2 border rounded"/>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email Address" required className="w-full p-2 border rounded"/>
                        <input type="text" name="institution" value={formData.institution} onChange={handleChange} placeholder="Your University/Institution" required className="w-full p-2 border rounded"/>
                        <input type="text" name="bookTitle" value={formData.bookTitle} onChange={handleChange} placeholder="Book Title or Topic of Interest" required className="w-full p-2 border rounded"/>
                        <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Briefly describe your research query..." required className="w-full p-2 border rounded" rows="4"></textarea>
                        <button type="submit" className="w-full bg-[#2C3E50] text-white p-3 rounded hover:bg-opacity-90 transition-colors">Submit Request</button>
                        {status && <p className="text-center mt-4 text-sm">{status}</p>}
                    </form>
                </div>
            </div>
        </PageWrapper>
    );
};

// --- NEW DEVELOPERS PAGE COMPONENT ---
const DevelopersPage = () => {
    return (
        <PageWrapper className="developers-page">
            <section className="developers-hero" style={{ backgroundImage: `linear-gradient(rgba(18, 39, 31, 0.78), rgba(18, 39, 31, 0.9)), url(${hq720})` }}>
                <div className="developers-hero-content container">
                    <span className="developers-kicker">Built For SUST Central Library Islamic Corner</span>
                    <h1 className="developers-title">Meet the Developer</h1>
                    <p className="developers-intro">
                        This platform was designed and implemented as a practical digital space for Islamic resources,
                        research access, heritage storytelling, and the Shahjalal-centered identity of SUST.
                    </p>
                </div>
            </section>

            <section className="developers-section container">
                <div className="developers-grid-layout">
                    <article className="developer-card developer-card-primary">
                        <div className="developer-photo-frame">
                            <img src={developerPhoto} alt="Anindya Mazumder" className="developer-photo" />
                        </div>
                        <div className="developer-card-badge">
                            <Code size={18} />
                            <span>Lead Developer</span>
                        </div>
                        <h2 className="developer-name">Anindya Mazumder</h2>
                        <p className="developer-role">B.Sc. in CSE, Shahjalal University of Science and Technology</p>
                        <div className="developer-links">
                            <a href="https://www.facebook.com/AnindyaMazumderAvro" target="_blank" rel="noopener noreferrer">Facebook</a>
                            <a href="https://github.com/ani2000" target="_blank" rel="noopener noreferrer">GitHub</a>
                        </div>
                        <p className="developer-summary">
                            Anindya Mazumder is a CSE student focused on applying software to meaningful community problems.
                            His work connects technology, campus life, and public value through practical products and
                            institution-focused digital experiences.
                        </p>
                        <p className="developer-summary">
                            He founded ATOMS to explore AI-driven traffic solutions, contributed to healthcare-oriented
                            technical work, guided The LOUD Journal as a bridge between people and leadership, and served
                            Theatre SUST as Library and IT Secretary. This project reflects that same direction: locally
                            relevant software with clear educational and cultural purpose.
                        </p>
                        <div className="developer-highlights">
                            <div className="developer-highlight-item">
                                <Award size={18} />
                                <span>Campus-centered product thinking</span>
                            </div>
                            <div className="developer-highlight-item">
                                <Compass size={18} />
                                <span>Focus on community impact and usability</span>
                            </div>
                            <div className="developer-highlight-item">
                                <BookIcon size={18} />
                                <span>Interest in research, access, and knowledge systems</span>
                            </div>
                        </div>
                    </article>

                    <aside className="developer-side-panel">
                        <div className="developer-side-card">
                            <div className="developer-side-header">
                                <Heart size={18} />
                                <h3>Gratitude</h3>
                            </div>
                            <div className="gratitude-item">
                                <h4>Shahidul Islam Abir</h4>
                                <p>
                                    Gratitude to Shahidul Islam Abir, batchmate from the SUST CSE 2020-21 session, for
                                    the support, encouragement, and shared technical spirit behind this work.
                                </p>
                            </div>
                            <div className="gratitude-item">
                                <h4>Tufail Ahmed</h4>
                                <p>
                                    Special thanks to Tufail Ahmed, Assistant Programmer, SUST, for guidance and
                                    encouragement that helped shape the project with stronger institutional grounding.
                                </p>
                            </div>
                        </div>

                        <div className="developer-side-card">
                            <div className="developer-side-header">
                                <UserCheck size={18} />
                                <h3>Project Intent</h3>
                            </div>
                            <p>
                                The goal of this website is to give Shahjalal Library Corner a more usable digital home:
                                one place for heritage, books, mazar locations, Islamic learning materials, and research requests.
                            </p>
                        </div>
                    </aside>
                </div>
            </section>

            <section className="developers-section developers-section-soft">
                <div className="container">
                    <div className="developers-stack-box">
                        <div className="developers-stack-heading">
                            <Quote size={18} />
                            <span>Technology Stack</span>
                        </div>
                        <p className="developers-stack-intro">
                            The project is built as a full-stack web application so the public website, admin panel,
                            and content management workflow can evolve together.
                        </p>
                        <div className="developers-stack-grid">
                            <div className="developers-stack-item"><strong>MongoDB</strong><span>Content storage for books, quotes, media, and research data.</span></div>
                            <div className="developers-stack-item"><strong>Express.js</strong><span>REST API layer for authentication, uploads, and admin content operations.</span></div>
                            <div className="developers-stack-item"><strong>React</strong><span>Responsive public-facing site and separate admin experience.</span></div>
                            <div className="developers-stack-item"><strong>Node.js</strong><span>Server runtime powering backend logic and automation scripts.</span></div>
                        </div>
                    </div>
                </div>
            </section>
        </PageWrapper>
    );
}

const fallbackQuranSurahs = [
  { number: 1, name: 'Al-Fatihah', bangla: 'আল ফাতিহা' },
  { number: 2, name: 'Al-Baqara', bangla: 'আল বাক্বারাহ' },
  { number: 3, name: 'Al-Imran', bangla: 'আল ইমরান' },
  { number: 4, name: 'An-Nisaa', bangla: 'আন নিসা' },
  { number: 5, name: 'Al-Maidah', bangla: 'আল মায়েদাহ' },
  { number: 6, name: 'Al-An\'am', bangla: 'আল আন-আম' },
  { number: 7, name: 'Al-A\'raf', bangla: 'আল আ’রাফ' },
  { number: 8, name: 'Al-Anfal', bangla: 'আল-আনফাল' },
  { number: 9, name: 'At-Taubah', bangla: 'আত তাওবাহ' },
  { number: 10, name: 'Yunus', bangla: 'ইউনুস' },
  { number: 11, name: 'Hud', bangla: 'হুদ' },
  { number: 12, name: 'Yusuf', bangla: 'ইউসূফ' },
  { number: 13, name: 'Ar-Ra\'d', bangla: 'রা’দ' },
  { number: 14, name: 'Ibrahim', bangla: 'ইব্রাহীম' },
  { number: 15, name: 'Al-Hijr', bangla: 'হিজর' },
  { number: 16, name: 'An-Nahl', bangla: 'নাহল' },
  { number: 17, name: 'Al-Isra', bangla: 'বনী ইসরাঈল' },
  { number: 18, name: 'Al-Kahf', bangla: 'কাহফ' },
  { number: 19, name: 'Maryam', bangla: 'মারইয়াম' },
  { number: 20, name: 'Ta-ha', bangla: 'ত্বোয়া-হা' },
  { number: 21, name: 'Al-Anbiyaa', bangla: 'আম্বিয়া' },
  { number: 22, name: 'Al-Hajj', bangla: 'হাজ্জ্ব' },
  { number: 23, name: 'Al-Muminun', bangla: 'আল মু’মিনূন' },
  { number: 24, name: 'An-Nur', bangla: 'আন-নূর' },
  { number: 25, name: 'Al-Furqan', bangla: 'আল-ফুরকান' },
  { number: 26, name: 'Ash-Shu\'araa', bangla: 'আশ-শো’আরা' },
  { number: 27, name: 'An-Naml', bangla: 'নমল' },
  { number: 28, name: 'Al-Qasas', bangla: 'আল কাসাস' },
  { number: 29, name: 'Al-Ankabut', bangla: 'আল আনকাবুত' },
  { number: 30, name: 'Ar-Rum', bangla: 'আর-রূম' },
  { number: 31, name: 'Luqman', bangla: 'লোকমান' },
  { number: 32, name: 'As-Sajda', bangla: 'সেজদাহ' },
  { number: 33, name: 'Al-Ahzab', bangla: 'আল আহযাব' },
  { number: 34, name: 'Saba', bangla: 'সাবা' },
  { number: 35, name: 'Fatir', bangla: 'ফাতির' },
  { number: 36, name: 'Ya-Sin', bangla: 'ইয়াসীন' },
  { number: 37, name: 'As-Saffat', bangla: 'আস-সাফফাত' },
  { number: 38, name: 'Sad', bangla: 'ছোয়াদ' },
  { number: 39, name: 'Az-Zumar', bangla: 'আল-যুমার' },
  { number: 40, name: 'Al-Mu\'min', bangla: 'আল-মু’মিন' },
  { number: 41, name: 'Ha-Mim', bangla: 'হা-মীম সেজদাহ' },
  { number: 42, name: 'Ash-Shura', bangla: 'আশ-শুরা' },
  { number: 43, name: 'Az-Zukhruf', bangla: 'যুখরুফ' },
  { number: 44, name: 'Ad-Dukhan', bangla: 'আদ দোখান' },
  { number: 45, name: 'Al-Jathiya', bangla: 'আল জাসিয়া' },
  { number: 46, name: 'Al-Ahqaf', bangla: 'আল আহক্বাফ' },
  { number: 47, name: 'Muhammad', bangla: 'মুহাম্মদ' },
  { number: 48, name: 'Al-Fat-h', bangla: 'আল ফাতহ' },
  { number: 49, name: 'Al-Hujurat', bangla: 'আল হুজরাত' },
  { number: 50, name: 'Qaf', bangla: 'ক্বাফ' },
  { number: 51, name: 'Az-Zariyat', bangla: 'আয-যারিয়াত' },
  { number: 52, name: 'At-Tur', bangla: 'আত্ব তূর' },
  { number: 53, name: 'An-Najm', bangla: 'আন-নাজম' },
  { number: 54, name: 'Al-Qamar', bangla: 'আল ক্বামার' },
  { number: 55, name: 'Ar-Rahman', bangla: 'আর রহমান' },
  { number: 56, name: 'Al-Waqi\'a', bangla: 'আল ওয়াক্বিয়া' },
  { number: 57, name: 'Al-Hadid', bangla: 'আল হাদীদ' },
  { number: 58, name: 'Al-Mujadila', bangla: 'আল মুজাদালাহ' },
  { number: 59, name: 'Al-Hashr', bangla: 'আল হাশর' },
  { number: 60, name: 'Al-Mumtahana', bangla: 'আল মুমতাহিনা' },
  { number: 61, name: 'As-Saff', bangla: 'আছ-ছফ' },
  { number: 62, name: 'Al-Jumu\'a', bangla: 'আল জুমুআহ' },
  { number: 63, name: 'Al-Munafiqun', bangla: 'মুনাফিকুন' },
  { number: 64, name: 'At-Tagabun', bangla: 'আত-তাগাবুন' },
  { number: 65, name: 'At-Talaq', bangla: 'আত্ব-ত্বালাক্ব' },
  { number: 66, name: 'At-Tahrim', bangla: 'আত-তাহরীম' },
  { number: 67, name: 'Al-Mulk', bangla: 'আল মুলক' },
  { number: 68, name: 'Al-Qalam', bangla: 'আল কলম' },
  { number: 69, name: 'Al-Haqqa', bangla: 'আল হাক্বক্বাহ' },
  { number: 70, name: 'Al-Ma\'arij', bangla: 'আল মা’আরিজ' },
  { number: 71, name: 'Nuh', bangla: 'নূহ' },
  { number: 72, name: 'Al-Jinn', bangla: 'আল জিন' },
  { number: 73, name: 'Al-Muzzammil', bangla: 'মুযযামমিল' },
  { number: 74, name: 'Al-Muddaththir', bangla: 'আল মুদ্দাসসির' },
  { number: 75, name: 'Al-Qiyamat', bangla: 'আল ক্বেয়ামাহ' },
  { number: 76, name: 'Ad-Dahr', bangla: 'আদ-দাহর' },
  { number: 77, name: 'Al-Mursalat', bangla: 'আল মুরসালাত' },
  { number: 78, name: 'An-Nabaa', bangla: 'আন-নাবা' },
  { number: 79, name: 'An-Nazi\'at', bangla: 'আন-নযিআ’ত' },
  { number: 80, name: 'Abasa', bangla: 'আবাসা' },
  { number: 81, name: 'At-Takwir', bangla: 'আত-তাকভীর' },
  { number: 82, name: 'Al-Infitar', bangla: 'আল ইনফিতার' },
  { number: 83, name: 'Al-Mutaffife', bangla: 'আত-তাতফীফ' },
  { number: 84, name: 'Al-Inshiqaq', bangla: 'আল ইনশিক্বাক্ব' },
  { number: 85, name: 'Al-Buruj', bangla: 'আল বুরূজ' },
  { number: 86, name: 'At-Tariq', bangla: 'আত্ব-তারিক্ব' },
  { number: 87, name: 'Al-A\'la', bangla: 'আল আ’লা' },
  { number: 88, name: 'Al-Gashiya', bangla: 'আল গাশিয়াহ' },
  { number: 89, name: 'Al-Fajr', bangla: 'আল ফজর' },
  { number: 90, name: 'Al-Balad', bangla: 'আল বালাদ' },
  { number: 91, name: 'Ash-Shams', bangla: 'আশ-শামস' },
  { number: 92, name: 'Al-Lail', bangla: 'আল লায়ল' },
  { number: 93, name: 'Adh-Dhuha', bangla: 'আদ্ব-দ্বোহা' },
  { number: 94, name: 'Al-Sharh', bangla: 'আল ইনশিরাহ' },
  { number: 95, name: 'At-Tin', bangla: 'ত্বীন' },
  { number: 96, name: 'Al-Alaq', bangla: 'আলাক' },
  { number: 97, name: 'Al-Qadr', bangla: 'কদর' },
  { number: 98, name: 'Al-Baiyina', bangla: 'বাইয়্যিনাহ' },
  { number: 99, name: 'Al-Zalzalah', bangla: 'যিলযাল' },
  { number: 100, name: 'Al-Adiyat', bangla: 'আদিয়াত' },
  { number: 101, name: 'Al-Qari\'a', bangla: 'কারেয়া' },
  { number: 102, name: 'At-Takathur', bangla: 'তাকাসূর' },
  { number: 103, name: 'Al-Asr', bangla: 'আছর' },
  { number: 104, name: 'Al-Humaza', bangla: 'হুমাযাহ' },
  { number: 105, name: 'Al-Fil', bangla: 'ফীল' },
  { number: 106, name: 'Quraish', bangla: 'কোরাইশ' },
  { number: 107, name: 'Al-Ma\'un', bangla: 'মাউন' },
  { number: 108, name: 'Al-Kauthar', bangla: 'কাওসার' },
  { number: 109, name: 'Al-Kafirun', bangla: 'কাফিরুন' },
  { number: 110, name: 'An-Nasr', bangla: 'নছর' },
  { number: 111, name: 'Al-Lahab', bangla: 'লাহাব' },
  { number: 112, name: 'Al-Ikhlas', bangla: 'এখলাছ' },
  { number: 113, name: 'Al-Falaq', bangla: 'ফালাক্ব' },
  { number: 114, name: 'An-Nas', bangla: 'নাস' },
];

export default App;