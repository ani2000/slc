import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MapPin, Mail, Phone, BookOpen } from 'lucide-react';

// --- Assets (place these in src/assets/) ---
// For this example, we'll use URLs. Ideally, you'd have local files.
const SUST_LOGO_URL = 'https://www.sust.edu/images/logo.png';
const BG_IMAGE_1 = 'https://images.unsplash.com/photo-1532664539372-f599b4505d81?q=80&w=2574&auto=format&fit=crop';
const SUST_LIBRARY_IMG = 'https://www.observerbd.com/2015/05/23/1432396365.jpg';
const DARGAH_IMG = 'https://live.staticflickr.com/4023/4688849479_489e22e964_b.jpg';

// --- API Helper ---
const API_URL = 'http://localhost:5000/api';
const fetchContent = async () => {
    const response = await fetch(`${API_URL}/content/all`);
    if (!response.ok) throw new Error('Failed to fetch content');
    return response.json();
};

// --- Main App Component ---
function App() {
    return (
        <Router>
            <MainLayout />
        </Router>
    );
}

// --- Layout Component (Handles Navbar, Footer, Routing) ---
const MainLayout = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Life of Hazrat Shahjalal (Rah.)', path: '/timeline' },
        { name: 'Teachings', path: '/teachings' },
        { name: 'Companions', path: '/companions' },
        { name: 'Locations', path: '/locations' },
        { name: 'Library & Research', path: '/library' },
    ];

    return (
        <div className="bg-[#FDFBF5] text-[#1A1A1A] font-serif">
            {/* --- Navbar --- */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link to="/" className="flex items-center space-x-2">
                            <img src={SUST_LOGO_URL} alt="SUST Logo" className="h-12"/>
                            <span className="font-bold text-lg text-[#003B71]">Shahjalal Library Corner</span>
                        </Link>
                        <div className="hidden md:flex items-center space-x-6">
                            {navLinks.map(link => (
                                <Link key={link.name} to={link.path} className="text-gray-700 hover:text-[#D4AF37] transition-colors duration-300">
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X/> : <Menu/>}
                            </button>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white"
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                                {navLinks.map(link => (
                                    <Link key={link.name} to={link.path} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* --- Page Content --- */}
            <main>
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/timeline" element={<TimelinePage />} />
                        {/* Add other routes here */}
                    </Routes>
                </AnimatePresence>
            </main>

            {/* --- Footer --- */}
            <footer className="bg-[#003B71] text-white mt-16">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">Shahjalal Library Corner</h3>
                        <p className="text-sm text-gray-300">A center for knowledge and reflection at Shahjalal University of Science and Technology.</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Contact Us</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center"><MapPin size={16} className="mr-2"/>SUST, Sylhet-3114, Bangladesh</li>
                            <li className="flex items-center"><Mail size={16} className="mr-2"/>librarian@sust.edu</li>
                            <li className="flex items-center"><Phone size={16} className="mr-2"/>+880-821-713491</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">Important Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="https://www.sust.edu" target="_blank" rel="noopener noreferrer" className="hover:underline">SUST Official Website</a></li>
                            <li><a href="https://library.sust.edu" target="_blank" rel="noopener noreferrer" className="hover:underline">SUST Central Library</a></li>
                        </ul>
                    </div>
                </div>
                <div className="text-center py-4 border-t border-gray-700 text-xs">
                    <p>&copy; {new Date().getFullYear()} Shahjalal Library Corner. All Rights Reserved.</p>
                </div>
            </footer>
        </div>
    );
};

// --- Page Components (Lazy Loaded for performance) ---

const PageWrapper = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
    >
        {children}
    </motion.div>
);

const HomePage = () => {
    // This page has a complex, multi-frame layout as requested.
    return (
        <PageWrapper>
            {/* Frame 1: Calligraphy */}
            <section className="h-screen bg-cover bg-center flex items-center justify-center text-white" style={{ backgroundImage: `url(${BG_IMAGE_1})` }}>
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 text-center p-4">
                    <h1 className="text-6xl md:text-8xl font-arabic" style={{fontFamily: "'Noto Naskh Arabic', serif"}}>بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</h1>
                    <p className="mt-4 text-xl md:text-2xl italic">"In the name of Allah, the Most Gracious, the Most Merciful."</p>
                </div>
            </section>

            {/* Frame 2: About SUST */}
            <section className="py-20 px-4">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-bold text-[#003B71] mb-4">Shahjalal University of Science and Technology</h2>
                        <p className="text-lg leading-relaxed">Named in honor of the great saint, SUST is a leading public university in Bangladesh, renowned for its excellence in science, technology, and research, fostering innovation and knowledge since its inception.</p>
                    </div>
                    <motion.img whileHover={{scale: 1.05}} src={SUST_LIBRARY_IMG} alt="SUST Library" className="rounded-lg shadow-xl"/>
                </div>
            </section>
            
            {/* Frame 3: About Dargah Sharif */}
            <section className="py-20 px-4 bg-gray-50">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                     <motion.img whileHover={{scale: 1.05}} src={DARGAH_IMG} alt="Dargah Sharif" className="rounded-lg shadow-xl md:order-2"/>
                    <div className="md:order-1">
                        <h2 className="text-4xl font-bold text-[#003B71] mb-4">Hazrat Shahjalal (Rah.) Dargah Sharif</h2>
                        <p className="text-lg leading-relaxed">A revered spiritual center and the final resting place of Hazrat Shahjalal (Rah.). It is a place of peace, prayer, and pilgrimage, attracting devotees from all over the world seeking blessings and tranquility.</p>
                    </div>
                </div>
            </section>

            {/* Frame 4: Masjid Arch Gallery */}
            <section className="py-20 px-4 text-center">
                 <h2 className="text-4xl font-bold text-[#003B71] mb-12">Glimpses of Heritage</h2>
                 <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Use CSS clip-path for the arch effect */}
                    <style>{`.arch-frame { clip-path: path('M0,500 h500 v-250 C 400,100 100,100 0,250 Z'); }`}</style>
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="arch-frame w-full h-64 bg-cover bg-center" style={{backgroundImage: `url(https://source.unsplash.com/random/500x500?mosque,library,${i})`}}></div>
                    ))}
                 </div>
            </section>

            {/* Frame 5: Mini Timeline */}
            <section className="py-20 px-4 bg-gray-50 text-center">
                 <h2 className="text-4xl font-bold text-[#003B71] mb-12">A Brief Journey</h2>
                 <div className="max-w-4xl mx-auto flex justify-center space-x-8 text-left">
                    {/* Fetch and display first 3-4 timeline events here */}
                 </div>
            </section>
        </PageWrapper>
    );
};

const AboutPage = () => {
    // Fetch and display content for Shahjalal Library Corner and Dargah
    // Include alternating image/text sections and embedded video
    return <PageWrapper> <div className="p-8"><h1 className="text-4xl">About Shahjalal Library Corner & Dargah Sharif</h1></div> </PageWrapper>
};

const TimelinePage = () => {
    const [events, setEvents] = useState([]);
    useEffect(() => {
        fetch(`${API_URL}/content/all`).then(res => res.json()).then(data => setEvents(data.timelineEvents || []));
    }, []);

    return (
        <PageWrapper>
            <div className="max-w-3xl mx-auto py-16 px-4">
                <h1 className="text-center text-5xl font-bold text-[#003B71] mb-16">The Life of Hazrat Shahjalal (Rah.)</h1>
                <div className="relative">
                    <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-[#D4AF37]"></div>
                    {events.map((event, index) => (
                        <motion.div key={event._id} initial={{opacity: 0}} whileInView={{opacity: 1}} viewport={{once: true}} className="mb-16 flex items-center w-full">
                            <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left order-2'}`}>
                                <p className="font-bold text-[#D4AF37] text-lg">{event.year}</p>
                                <h3 className="font-bold text-xl text-[#003B71]">{event.title}</h3>
                                <p className="text-sm mt-2">{event.description}</p>
                            </div>
                            <div className="w-1/2 order-1 flex justify-center">
                                <img src={event.imageUrl} alt={event.title} className="w-32 h-32 object-cover rounded-full shadow-lg border-4 border-white"/>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </PageWrapper>
    );
};


export default App;
