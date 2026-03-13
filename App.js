import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin, Mail, Phone, ArrowRight, Download, BookOpen as BookIcon, Shield, Anchor, Feather, Star, Compass, Heart, Award, Gem, Building, Droplet, UserCheck, Microscope, Code, Quote } from 'lucide-react';
import './App.css';

// --- Import Local Assets ---
import logo from './assets/S.png';
import heroBg from './assets/bg.jpg';
import sustCampusImg from './assets/hq720.jpg';
import dargahImg from './assets/sylhet-bangladesh-2-january-2024-260nw-2421221059.webp';
import hq720 from './assets/hq720.jpg';
// Import new components
import Books, { books as booksArray } from './Books';
import BookList from './BookList';
import SUST from './SUST';
import Mazar from './Mazar';
import QuotesSection, { quotes as quotesArray } from './QuotesSection';
import PdfViewer from './PdfViewer';
import QuranSurahPage from './QuranSurahPage';
import robotsQuotes from './robotsQuotes'; // We'll create this file for robots.txt quotes

// --- Config ---
const API_URL = 'http://localhost:5000/api';

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
        { name: 'Home', path: '/' }, { name: 'About', path: '/about' },
        { name: 'Hazrat Shahjalal (Rah.) Journey', path: '/timeline' }, { name: 'Teachings', path: '/teachings' },
        { name: '360 Auliyas', path: '/companions' }, { name: 'Locations', path: '/locations' },
        { name: 'Book List', path: '/book-list' }, { name: 'Research', path: '/library' },
    ];
    useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);

    return (
        <div className="app-container"><nav className="navbar"><div className="navbar-content container"><Link to="/" className="navbar-logo"><img src={logo} alt="Shahjalal Library Corner Logo" style={{ height: 72, width: 'auto' }} /><div className="logo-text"><span className="main-title">Hazrat Shahjalal (Rah.) Corner</span><span className="sub-title">Central Library, SUST</span></div></Link><div className="navbar-links-desktop">{navLinks.map(link => (<Link key={link.name} to={link.path} className={location.pathname === link.path ? 'nav-link active' : 'nav-link'}>{link.name}</Link>))}</div><div className="navbar-mobile-toggle"><button onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={28}/> : <Menu size={28}/>}</button></div></div><AnimatePresence>{isMenuOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="navbar-mobile-menu"><div className="mobile-menu-links">{navLinks.map(link => (<Link key={link.name} to={link.path} className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>{link.name}</Link>))}</div></motion.div>)}</AnimatePresence></nav>
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
            <footer className="footer"><div className="footer-content container"><div><h3 className="footer-heading">Shahjalal Library Corner</h3><p className="footer-text">A center for knowledge and reflection at Shahjalal University of Science and Technology.</p></div><div><h3 className="footer-heading">Contact Us</h3><ul className="footer-list"><li><MapPin size={16} /><span>SUST, Sylhet-3114, Bangladesh</span></li><li><Mail size={16} /><span>librarian@sust.edu</span></li><li><Phone size={16} /><span>+880-821-713491</span></li></ul></div><div><h3 className="footer-heading">Important Links</h3><ul className="footer-list"><li><a href="https://www.sust.edu" target="_blank" rel="noopener noreferrer">SUST Official Website</a></li><li><a href="https://library.sust.edu" target="_blank" rel="noopener noreferrer">SUST Central Library</a></li>{/* --- ADDED LINK TO DEVELOPERS PAGE --- */}<li><Link to="/developers">Developers</Link></li></ul></div></div><div className="footer-bottom"><p>© {new Date().getFullYear()} Shahjalal Library Corner. All Rights Reserved.</p></div></footer>
        </div>
    );
};

// --- Page Components ---
const PageWrapper = ({ children, className }) => (<motion.div className={className} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>{children}</motion.div>);

const HomePage = () => {
    const [content, setContent] = useState({ timelineEvents: [], galleryImages: [] });
    const [showAllEvents, setShowAllEvents] = useState(false);
    const [showAllGallery, setShowAllGallery] = useState(false);
    const [expandedJourney, setExpandedJourney] = useState(null);
    const [expandedCompanion, setExpandedCompanion] = useState(null);
    // Sample fallback captions if not present in galleryImages
    const fallbackCaptions = [
        "Annual Urs at the Mazar",
        "Historic Library Hall",
        "SUST Central Library",
        "Dargah Sharif Entrance",
        "Jalali Pigeons at Shrine",
        "Spiritual Gathering Night"
    ];
    useEffect(() => {
        const fetchHomeContent = async () => {
            try {
                const res = await fetch(`${API_URL}/content/all`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setContent(data);
            } catch (error) { console.error("Failed to fetch homepage content:", error); }
        };
        fetchHomeContent();
    }, []);

    return (
        <PageWrapper>
            <section className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}><div className="hero-overlay"></div><div className="hero-content"><h1 className="hero-title">اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ</h1><p className="hero-subtitle">"Read in the name of your Lord who created." (Qur'an 96:1)</p></div></section>
            <section className="content-section"><div className="content-grid container"><div className="text-content"><h2 className="section-title">Shahjalal University of Science and Technology</h2><p className="section-paragraph">Named in hono of the great saint, SUST is a leading public university in Bangladesh, renowned for its excellence in science, technology, and research, fostering innovation and knowledge since its inception in 1986.</p></div><motion.img whileHover={{scale: 1.05}} src={sustCampusImg} alt="SUST Campus" className="content-image"/></div></section>
            <section className="content-section-alt"><div className="content-grid container"><motion.img whileHover={{scale: 1.05}} src={dargahImg} alt="Dargah Sharif" className="content-image order-md-2"/><div className="text-content order-md-1"><h2 className="section-title">Hazrat Shahjalal (Rah.) Dargah Sharif</h2><p className="section-paragraph">A revered spiritual center and the final resting place of Hazrat Shahjalal (Rah.), located in Ambarkhana, Sylhet. It is a place of peace, prayer, and pilgrimage, attracting devotees from all over the world seeking blessings and tranquility.</p></div></div></section>
            {/* --- ENRICHED GLIMPSES OF HERITAGE --- */}
            <section className="gallery-section">
                <h2 className="section-title text-center">Glimpses of Heritage</h2>
                <p className="section-paragraph text-center max-w-2xl mx-auto mb-6">
                    Explore the rich spiritual and academic heritage of Sylhet, from the sacred Dargah to the vibrant campus of SUST. Each image below tells a story of tradition, learning, and devotion.
                </p>
                <div className="gallery-grid container">
                    <style>{`.arch-frame { clip-path: path('M0,500 h500 v-250 C 400,100 100,100 0,250 Z'); }`}</style>
                    {(content.galleryImages || []).slice(0, showAllGallery ? 8 : 4).map((img, i) => (
                        <div key={img._id || i} className="arch-frame group relative" style={{backgroundImage: `url(${img.imageUrl || 'https://source.unsplash.com/random/500x500?islamic,architecture,'+i})`}}>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition">
                                {img.caption || fallbackCaptions[i % fallbackCaptions.length]}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-4">
                    <button onClick={() => setShowAllGallery(v => !v)} className="explore-button mb-2">
                        {showAllGallery ? "Show Less" : "See More Heritage Photos"}
                    </button>
                    <Link to="/mazar" className="explore-button ml-2">Visit Mazar Gallery</Link>
                </div>
            </section>
            {/* --- VIDEO GALLERY SECTION --- */}
            {content.videos && content.videos.length > 0 && (
                <section className="video-section container py-16">
                    <h2 className="section-title text-center mb-8">Video Gallery</h2>
                    <div className="video-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem'}}>
                        {content.videos.slice(0, 4).map((video, idx) => (
                            <div key={video._id || idx} className="video-card bg-white rounded shadow p-4 flex flex-col items-center">
                                {video.thumbnail && <img src={`http://localhost:5000/${video.thumbnail}`} alt={video.title} style={{width: '100%', maxWidth: 320, borderRadius: 8, marginBottom: 12}} />}
                                <h3 className="font-bold text-lg mb-2 text-center">{video.title}</h3>
                                <p className="text-gray-600 text-sm mb-2 text-center">{video.description}</p>
                                {video.url && video.url.includes('youtube') ? (
                                    <iframe width="100%" height="200" src={video.url.replace('watch?v=', 'embed/')} title={video.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{borderRadius: 8}}></iframe>
                                ) : video.videoUrl ? (
                                    <video width="100%" height="200" controls style={{borderRadius: 8}}>
                                        <source src={`http://localhost:5000/${video.videoUrl}`} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {/* --- ENRICHED A BRIEF JOURNEY --- */}
            <section className="content-section-alt">
                <h2 className="section-title text-center">A Brief Journey</h2>
                <p className="section-paragraph text-center max-w-2xl mx-auto mb-6">
                    Trace the footsteps of Hazrat Shahjalal (Rah.) and his companions as they shaped the spiritual landscape of Bengal. Click on any card to read the detailed description.
                </p>
                {/* Short 5-step timeline */}
                <div className="journey-grid container">
                  {/* 1 */}
                  <div className="journey-card" onClick={() => setExpandedJourney(expandedJourney === 1 ? null : 1)}>
                    <p className="journey-card-year">c. 1271</p>
                    <h3 className="journey-card-title">Birth & Early Life</h3>
                    <p className="journey-card-desc">Born in Konya (Turkey) or Yemen, Shah Jalal was raised by his uncle Syed Ahmed Kabir in Mecca, excelling in Islamic studies and spiritual training.</p>
                    {expandedJourney === 1 && (
                      <div className="journey-card-expanded">
                        <p>Hazrat Shahjalal (R.A.) was born into a distinguished and pious Syed family in Hadhramaut, Yemen, a region renowned for its deep-rooted Islamic scholarship and spirituality. His lineage is traced back to the Quraysh tribe of Mecca. Tragedy struck early in his life, as he lost both of his parents, leaving him an orphan. He was taken under the wing of his maternal uncle, Syed Ahmad Kabir Suhrawardy, who was not only his guardian but also a great Sufi master and a prominent spiritual leader in the Suhrawardiyya order. This upbringing immersed the young Shahjalal in an environment of intense devotion, Islamic knowledge, and mystical training from his formative years.</p>
                      </div>
                    )}
                  </div>
                  {/* 2 */}
                  <div className="journey-card" onClick={() => setExpandedJourney(expandedJourney === 2 ? null : 2)}>
                    <p className="journey-card-year">c. 1300</p>
                    <h3 className="journey-card-title">Journey to India</h3>
                    <p className="journey-card-desc">Following his uncle's guidance, he traveled east, meeting Sufi masters in Ajmer and Delhi, and received a handful of soil to find his destined land.</p>
                    {expandedJourney === 2 && (
                      <div className="journey-card-expanded">
                        <p>Following the divine instruction from his uncle, Hazrat Shahjalal (R.A.) and his followers began their long journey towards Hindustan (India). Their path took them through the spiritual heartlands of India. In Ajmer, he met with the spiritual successors at the shrine of Khwaja Moinuddin Chishti (Gharib Nawaz), the great founder of the Chishti Order in India. His most notable sojourn was in Delhi, where he was a guest of the preeminent Sufi saint of the era, Hazrat Nizamuddin Aulia (R.A.). During his stay in Delhi, as a token of love and spiritual recognition, Hazrat Nizamuddin Aulia gifted Shahjalal a pair of gray pigeons, whose descendants still inhabit the Dargah complex today.</p>
                      </div>
                    )}
                  </div>
                  {/* 3 */}
                  <div className="journey-card" onClick={() => setExpandedJourney(expandedJourney === 3 ? null : 3)}>
                    <p className="journey-card-year">1303</p>
                    <h3 className="journey-card-title">Conquest of Sylhet</h3>
                    <p className="journey-card-desc">Joined the Muslim army with 360 companions, defeated Raja Gour Govinda, and established Muslim rule in Sylhet.</p>
                    {expandedJourney === 3 && (
                      <div className="journey-card-expanded">
                        <p>While in Bengal, news reached Hazrat Shahjalal about the tyranny of Gour Govinda, the Hindu king of Sylhet. A Muslim resident, Sheikh Burhanuddin, was severely punished for the "crime" of sacrificing a cow for his son's aqiqah. Recognizing this as a divine call to action, Hazrat Shahjalal resolved to go to Sylhet to aid the oppressed and establish justice, gathering his band of 360 Auliyas for the mission. As the army approached Sylhet, they were blocked by the wide Surma River. Hazrat Shahjalal performed one of his most famous miracles by laying his prayer mat on the water, and by the grace of Allah, it floated like a raft. He and his 360 companions crossed the river on prayer mats, leading to the decisive victory and establishment of Islamic governance in Sylhet.</p>
                      </div>
                    )}
                  </div>
                  {/* 4 */}
                  <div className="journey-card" onClick={() => setExpandedJourney(expandedJourney === 4 ? null : 4)}>
                    <p className="journey-card-year">After 1303</p>
                    <h3 className="journey-card-title">Spiritual Mission</h3>
                    <p className="journey-card-desc">Settled in Sylhet, spreading Islam and guiding thousands. His disciples established khanqahs and spread teachings across Bengal.</p>
                    {expandedJourney === 4 && (
                      <div className="journey-card-expanded">
                        <p>After the conquest, Hazrat Shahjalal chose a small hillock in the Chawkidighi area of Sylhet to establish his khanqah (Sufi lodge and spiritual center). This humble settlement became the nucleus of Islamic learning and missionary activity for the entire region. He strategically dispatched his 360 companions to different parts of Bengal and surrounding regions to establish spiritual centers and propagate Islam. Among the most famous were his nephew, Shah Paran (R.A.), sent to the area east of Sylhet; Shah Malek al-Yemini (R.A.) to the region of Dhaka; and Syed Nasiruddin to the Taraf Kingdom. Each companion established their own centers of Islamic learning and justice.</p>
                      </div>
                    )}
                  </div>
                  {/* 5 */}
                  <div className="journey-card" onClick={() => setExpandedJourney(expandedJourney === 5 ? null : 5)}>
                    <p className="journey-card-year">1346</p>
                    <h3 className="journey-card-title">Legacy</h3>
                    <p className="journey-card-desc">Passed away in Sylhet. His shrine remains a major spiritual center, and his legacy endures through his teachings and companions.</p>
                    {expandedJourney === 5 && (
                      <div className="journey-card-expanded">
                        <p>Hazrat Shahjalal (R.A.) passed away on the 20th of Dhul Qadah, 746 AH (corresponding to March 15, 1346 CE). He is famously known as al-Mujarrad, meaning "The Celibate" or "The Abstracted," as he never married and had no biological descendants, having devoted his entire existence to the path of God. His true legacy is spiritual—the millions of souls touched by his message and the enduring Islamic culture of Sylhet and beyond. His Dargah is the spiritual epicenter of Sylhet, which is often called the "Holy Land" or the "City of 360 Auliyas." Thousands of devotees from all walks of life and different faiths visit his shrine daily seeking blessings and peace.</p>
                      </div>
                    )}
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
                The most prominent companions of Hazrat Shahjalal (Rah.) played vital roles in the spiritual and social transformation of Bengal. Here are five of the most renowned aulias. Click on any card to read the detailed description.
              </p>
              <div className="companions-grid container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Shah Paran */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 min-h-[220px] flex flex-col justify-between hover:shadow-xl transition cursor-pointer">
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 text-2xl mr-2">🕌</span>
                    <h3 className="text-xl font-extrabold text-gray-900">Hazrat Shah Paran (R.A.)</h3>
                  </div>
                  <p className="font-semibold text-gray-700 mb-1">The Beloved Nephew and Spiritual Successor</p>
                  <p className="text-base text-gray-800 mb-1"><span className="font-bold">Origin:</span> Hadhramaut, Yemen</p>
                  <p className="text-base text-gray-800"><span className="font-bold">Brief:</span> Guided Sylhet after Shah Jalal, built mosques and teaching centers. His shrine is a major pilgrimage site in Khadim Nagar, Sylhet.</p>
                </div>
                {/* Shah Kamal */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 min-h-[220px] flex flex-col justify-between hover:shadow-xl transition cursor-pointer">
                  <div className="flex items-center mb-2">
                    <span className="text-green-500 text-2xl mr-2">🕌</span>
                    <h3 className="text-xl font-extrabold text-gray-900">Hazrat Shah Kamal al-Yemeni (R.A.)</h3>
                  </div>
                  <p className="font-semibold text-gray-700 mb-1">Founder of Shaharpara</p>
                  <p className="text-base text-gray-800 mb-1"><span className="font-bold">Origin:</span> Yemen or Mecca (Qurayshi lineage)</p>
                  <p className="text-base text-gray-800"><span className="font-bold">Brief:</span> Established the spiritual village of Shaharpara, Sunamganj. His lineage became highly influential in the region.</p>
                </div>
                {/* Syed Nasiruddin */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 min-h-[220px] flex flex-col justify-between hover:shadow-xl transition cursor-pointer">
                  <div className="flex items-center mb-2">
                    <span className="text-blue-500 text-2xl mr-2">🕌</span>
                    <h3 className="text-xl font-extrabold text-gray-900">Syed Nasiruddin (Sipah Salar)</h3>
                  </div>
                  <p className="font-semibold text-gray-700 mb-1">Commander-in-Chief of the Army</p>
                  <p className="text-base text-gray-800 mb-1"><span className="font-bold">Origin:</span> Baghdad, Iraq</p>
                  <p className="text-base text-gray-800"><span className="font-bold">Brief:</span> Key figure in the conquest of Sylhet, established a khanqah in Fenchuganj. Revered for his wisdom and leadership.</p>
                </div>
                {/* Haydar Ghazi */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 min-h-[220px] flex flex-col justify-between hover:shadow-xl transition cursor-pointer">
                  <div className="flex items-center mb-2">
                    <span className="text-indigo-500 text-2xl mr-2">🕌</span>
                    <h3 className="text-xl font-extrabold text-gray-900">Haydar Ghazi (Nūr al-Hudā)</h3>
                  </div>
                  <p className="font-semibold text-gray-700 mb-1">Second Wazir (Governor) of Sylhet</p>
                  <p className="text-base text-gray-800 mb-1"><span className="font-bold">Origin:</span> Arab Descent, likely from Yemen</p>
                  <p className="text-base text-gray-800"><span className="font-bold">Brief:</span> Known for piety and wise rule, later governed Sonargaon, a major city of Bengal Sultanate.</p>
                </div>
                {/* Shah Tajuddin */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 min-h-[220px] flex flex-col justify-between hover:shadow-xl transition cursor-pointer">
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-600 text-2xl mr-2">🕌</span>
                    <h3 className="text-xl font-extrabold text-gray-900">Hazrat Shah Tajuddin al-Qureshi (R.A.)</h3>
                  </div>
                  <p className="font-semibold text-gray-700 mb-1">The Chief Jurist and Qadi</p>
                  <p className="text-base text-gray-800 mb-1"><span className="font-bold">Origin:</span> Quraysh Tribe, Arabian Peninsula</p>
                  <p className="text-base text-gray-800"><span className="font-bold">Brief:</span> Established Islamic law and justice in Sylhet, issued fatwas and guided the new community.</p>
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
            {/* Vice Chancellor Card with image, message, and video side by side */}
            <div className="flex flex-col md:flex-row items-center justify-center bg-white rounded-xl shadow-lg p-8 max-w-5xl mx-auto my-16 gap-12">
                <img
                    src={require('c:/Users/Abir/Documents/3.png')}
                    alt="Vice Chancellor"
                    className="rounded-lg shadow w-56 h-72 object-cover"
                />
                <div className="flex-1 flex flex-col justify-center">
                    <h2 className="text-2xl font-bold mb-2 text-green-900">A Message from the Vice-Chancellor</h2>
                    <p className="text-base text-gray-700 mb-2 font-semibold">
                        Professor Dr. A. M. Sarwaruddin Chowdhury<br/>Vice-Chancellor, SUST
                    </p>
                    <p className="text-gray-700 mb-4">
                        "The Shahjalal Library Corner is a testament to our commitment to knowledge, culture, and spiritual heritage. We believe that the fusion of tradition and modernity will inspire generations of students and scholars. May this initiative foster unity, wisdom, and progress for all who seek enlightenment at SUST."
                    </p>
                    <div className="mt-4 flex justify-center md:justify-start">
                        <iframe
                            width="360"
                            height="215"
                            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                            title="Vice Chancellor Message"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ borderRadius: '12px', maxWidth: '100%' }}
                        ></iframe>
                    </div>
                </div>
            </div>
            {/* Previous video option for VC message */}
            <div className="flex justify-center my-8">
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full">
                    <h2 className="text-xl font-bold mb-4 text-green-900 text-center">Vice Chancellor's Video Message</h2>
                    <div className="flex justify-center">
                        <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
                            title="Vice Chancellor Message"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ borderRadius: '12px', maxWidth: '100%' }}
                        ></iframe>
                    </div>
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
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true, amount: 0.8 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            {index + 1}
                        </motion.div>
                        <motion.div 
                            className="timeline-content"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.5 }}
                            transition={{ duration: 0.6 }}
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

    useEffect(() => {
        fetch('http://localhost:5000/api/content/all')
            .then(res => res.json())
            .then(data => {
                setBackendQuotes(data.quotes || []);
                setBackendBooks(data.books || []);
            });
    }, []);

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
                <div className="subtitle">“Read in the name of your Lord who created.” (Qur'an 96:1)</div>
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
                    <div className="quran-surah-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {quranSurahs.map(surah => (
                            <div key={surah.number} className="quran-surah-card p-4 bg-white rounded shadow hover:bg-slate-50 transition">
                                <Link to={`/quran/${surah.number}`} className="font-bold text-lg text-[#235B3F]">
                                    {surah.number}. {surah.name} <span className="text-slate-500">({surah.bangla})</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            <div className="teachings-edu-note">
                <strong>“The seeking of knowledge is obligatory for every Muslim.”</strong><br/>
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
                                <img src={book.coverImageUrl.startsWith('http') ? book.coverImageUrl : book.coverImageUrl ? `http://localhost:5000/${book.coverImageUrl}` : process.env.PUBLIC_URL + '/Books/Annual Urs.jpg'} alt={book.title} className="teachings-book-cover" onError={e => {e.target.onerror=null; e.target.src=process.env.PUBLIC_URL + '/Books/Annual Urs.jpg';}}/>
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
    return (
        <PageWrapper className="container py-16">
            <h1 className="section-title text-center mb-12">Maps & Directions</h1>
            <div className="grid md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Shahjalal Library Corner (Shahjalal Library Corner)</h2>
                    <div className="w-full h-80 rounded-lg overflow-hidden shadow-xl border-4 border-white">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.324312891332!2d91.830639315004!3d24.92106398402517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375055ebb4055555%3A0x4485ade3063f0d8a!2sSUST%20Central%20Library!5e0!3m2!1sen!2sbd!4v1672834151272!5m2!1sen!2sbd" width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy"></iframe>
                    </div>
                </div>
                 <div>
                    <h2 className="text-2xl font-bold mb-4">Hazrat Shahjalal (Rah.) Dargah</h2>
                    <div className="w-full h-80 rounded-lg overflow-hidden shadow-xl border-4 border-white">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.349635584683!2d91.8653698144776!3d24.88607625032542!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3751ab388f86cf9b%3A0x97c8449e7769533c!2sHazrat%20Shahjalal%20Mazar%20Sharif!5e0!3m2!1sen!2sbd!4v1672834315272!5m2!1sen!2sbd" width="100%" height="100%" style={{border:0}} allowFullScreen="" loading="lazy"></iframe>
                    </div>
                </div>
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
        <PageWrapper className="container py-16">
            <h1 className="section-title text-center mb-4">Meet the Developer</h1>
            <div className="flex flex-col md:flex-row justify-center items-start gap-16 mb-8">
                {/* 2.png with text below */}
                <div className="flex flex-col items-center">
                    <img
                        src={require('c:/Users/Abir/Downloads/2.png')}
                        alt="Developer 2"
                        className="rounded-lg shadow-lg w-64 h-80 object-cover mb-4"
                    />
                    <div className="max-w-xs text-center">
                        <h2 className="font-bold text-xl mb-1">Shahidul Islam Abir</h2>
                        <p className="text-base text-gray-700 mb-1">B.Sc. in CSE, Shahjalal University of Science and Technology (SUST)</p>
                        <p className="mb-2">
                            <a href="https://www.linkedin.com/in/shahidul-islam-abir-348b34288/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mr-2">LinkedIn</a>
                            <a href="https://github.com/Abir-cse-18" target="_blank" rel="noopener noreferrer" className="text-gray-800 underline">GitHub</a>
                        </p>
                        <p className="text-sm text-gray-600">
                            A passionate developer and AI enthusiast with a strong foundation in Machine Learning, Web and Mobile Application Development, and UI/UX Design. Shahidul specializes in building intelligent, user-friendly solutions that solve real-world problems. He has experience developing production-grade applications using technologies like React.js, Kotlin, Firebase, and JavaScript, with a focus on performance, scalability, and clean design.
                        </p>
                    </div>
                </div>
                {/* 1.jpg with text below */}
                <div className="flex flex-col items-center">
                    <img
                        src={require('c:/Users/Abir/Documents/1.jpg')}
                        alt="Developer 1"
                        className="rounded-lg shadow-lg w-64 h-80 object-cover mb-4"
                    />
                    <div className="max-w-xs text-center">
                        <h2 className="font-bold text-xl mb-1">Anindya Mazumder</h2>
                        <p className="text-base text-gray-700 mb-1">B.Sc. in CSE, Shahjalal University of Science and Technology (SUST)</p>
                        <p className="mb-2">
                            <a href="https://www.facebook.com/AnindyaMazumderAvro" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline mr-2">Facebook</a>
                            <a href="https://github.com/ani2000" target="_blank" rel="noopener noreferrer" className="text-gray-800 underline">GitHub</a>
                        </p>
                        <p className="text-sm text-gray-600">
                            Driven by a passion to connect technology with community needs, Anindya Mazumder is a Computer Science student on a mission. He founded ATOMS to tackle national traffic challenges with AI and developed tech for healthcare solutions. A natural leader, he has also guided The LOUD Journal, to create a bridge between people and their leaders. Anindya contributes his skills to the university community as the Library and IT Secretary for Theatre SUST, always seeking to make a tangible impact.
                        </p>
                    </div>
                </div>
            </div>
            <div className="max-w-3xl mx-auto text-center">
                <div className="flex justify-center text-4xl text-gray-400 mb-6">
                    <Code />
                </div>
                <h2 className="text-2xl font-bold mt-12 mb-4 text-slate-800">Technology Stack</h2>
                <p className="section-paragraph">
                    The application is built on the MERN stack:
                </p>
                <ul className="list-disc list-inside text-left max-w-md mx-auto mt-4 font-sans text-lg text-gray-700">
                    <li><strong>MongoDB:</strong> For a flexible, document-based database.</li>
                    <li><strong>Express.js:</strong> A robust backend framework for Node.js.</li>
                    <li><strong>React:</strong> For a dynamic and responsive user interface.</li>
                    <li><strong>Node.js:</strong> The runtime environment for the server.</li>
                </ul>
            </div>
        </PageWrapper>
    );
}

const quranSurahs = [
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
  { number: 112, name: 'Al-Ikhlas', bangla: 'আল-ইখলাস' },
  { number: 113, name: 'Al-Falaq', bangla: 'আল ফালাক' },
  { number: 114, name: 'An-Nas', bangla: 'আন-নাস' },
];
export default App;