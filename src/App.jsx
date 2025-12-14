// Botanical App - Complete Version with All Features
import React, { useState, useEffect } from 'react';
import { 
  Leaf, Search, Calendar, BookOpen, Shield, User, 
  Sun, Moon, Award, Droplets, Globe, Sparkles, 
  TrendingUp, Heart, Star, CheckCircle, XCircle, 
  ArrowRight, Zap, Target, AlertTriangle 
} from 'lucide-react';

const AuthContext = React.createContext(null);

// API Configuration
const TREFLE_API_KEYS = [
  'usr-KnszMBgvFpEouXLneyDKTG8AsvlH8pmBfH6ddaFNta4',
  'd1hyb0J5bmpZQ2hSTWp0b2V5b0hGUT09'
];
const TREFLE_BASE_URL = 'https://trefle.io/api/v1';
const WIKIPEDIA_API = 'https://en.wikipedia.org/w/api.php';

export default function BotanicalApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const loadUser = () => {
      const userData = JSON.parse(localStorage.getItem('current-user') || 'null');
      if (userData) setCurrentUser(userData);
    };
    loadUser();
  }, []);

  const login = (username, password) => {
    const userData = JSON.parse(localStorage.getItem(`user:${username}`) || 'null');
    if (userData && userData.password === password) {
      setCurrentUser(userData);
      localStorage.setItem('current-user', JSON.stringify(userData));
      return { success: true };
    }
    return { success: false, error: userData ? 'Invalid password' : 'User not found' };
  };

  const register = (username, password) => {
    if (localStorage.getItem(`user:${username}`)) {
      return { success: false, error: 'Username already exists' };
    }
    const userData = {
      username, password, points: 0, badges: [], 
      gardenPlants: [], quizScores: [], pledges: []
    };
    localStorage.setItem(`user:${username}`, JSON.stringify(userData));
    setCurrentUser(userData);
    localStorage.setItem('current-user', JSON.stringify(userData));
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('current-user');
    setCurrentPage('home');
  };

  const updateUser = (updates) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem(`user:${currentUser.username}`, JSON.stringify(updatedUser));
    localStorage.setItem('current-user', JSON.stringify(updatedUser));
  };

  const translations = {
    en: {
      appTitle: 'Smart Botanical Assistant',
      tagline: 'Discover, Learn, and Protect Plants',
      home: 'Home', identify: 'Identify', planner: 'Planner', 
      quiz: 'Quiz', tracker: 'Tracker',
      login: 'Login', logout: 'Logout',
      searchPlaceholder: 'Search for any plant...',
      ecoQuote: '"In every walk with nature, one receives far more than he seeks."'
    },
    hi: {
      appTitle: 'स्मार्ट वनस्पति सहायक',
      tagline: 'पौधों की खोज करें, सीखें और सुरक्षित करें',
      home: 'होम', identify: 'पहचानें', planner: 'योजनाकार', 
      quiz: 'प्रश्नोत्तरी', tracker: 'ट्रैकर',
      login: 'लॉगिन', logout: 'लॉगआउट',
      searchPlaceholder: 'किसी भी पौधे को खोजें...',
      ecoQuote: '"प्रकृति के साथ हर सैर में, व्यक्ति को उससे कहीं अधिक प्राप्त होता है जो वह चाहता है।"'
    }
  };

  const t = translations[language];

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout, updateUser }}>
      <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white' : 'bg-gradient-to-br from-green-50 via-blue-50 to-purple-50'}`}>
        <Navbar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          language={language}
          setLanguage={setLanguage}
          t={t}
        />
        
        <main className="container mx-auto px-4 py-8">
          {currentPage === 'home' && <HomePage setCurrentPage={setCurrentPage} darkMode={darkMode} t={t} />}
          {currentPage === 'identify' && <IdentifyPage darkMode={darkMode} />}
          {currentPage === 'planner' && <PlannerPage darkMode={darkMode} currentUser={currentUser} updateUser={updateUser} />}
          {currentPage === 'quiz' && <QuizPage darkMode={darkMode} currentUser={currentUser} updateUser={updateUser} />}
          {currentPage === 'tracker' && <TrackerPage darkMode={darkMode} currentUser={currentUser} updateUser={updateUser} />}
          {currentPage === 'login' && <LoginPage setCurrentPage={setCurrentPage} darkMode={darkMode} />}
        </main>

        <Footer darkMode={darkMode} t={t} />
      </div>
    </AuthContext.Provider>
  );
}

function Navbar({ currentPage, setCurrentPage, darkMode, setDarkMode, language, setLanguage, t }) {
  const { currentUser, logout } = React.useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={`${darkMode ? 'bg-gray-900/95 backdrop-blur-lg border-b border-green-500/20' : 'bg-white/95 backdrop-blur-lg border-b border-green-100'} shadow-2xl sticky top-0 z-50 transition-all duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setCurrentPage('home')}>
            <div className="relative">
              <Leaf className="text-green-600 group-hover:rotate-12 transition-transform duration-300" size={32} />
              <Sparkles className="absolute -top-1 -right-1 text-yellow-400 w-4 h-4 animate-pulse" />
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Botanical AI
            </span>
          </div>

          <div className="hidden lg:flex gap-2">
            {['home', 'identify', 'planner', 'quiz', 'tracker'].map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium ${
                  currentPage === page
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg scale-105'
                    : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-green-50'} hover:scale-105`
                }`}
              >
                {t[page]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-xl lg:hidden ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-all`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-all hover:scale-110`}>
              {darkMode ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-purple-600" />}
            </button>

            <button onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} className={`p-2 rounded-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-all hover:scale-110`}>
              <Globe size={20} className="text-blue-600" />
            </button>

            {currentUser ? (
              <div className="hidden lg:flex items-center gap-2">
                <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{currentUser.username}</span>
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                  ⭐ {currentUser.points}
                </span>
                <button onClick={logout} className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 text-sm rounded-xl hover:shadow-lg transition-all hover:scale-105">
                  {t.logout}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className="hidden lg:flex bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 text-sm rounded-xl hover:shadow-lg transition-all items-center gap-2 hover:scale-105"
              >
                <User size={18} />
                {t.login}
              </button>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className={`lg:hidden py-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-col gap-2">
              {['home', 'identify', 'planner', 'quiz', 'tracker'].map(page => (
                <button
                  key={page}
                  onClick={() => { setCurrentPage(page); setIsMenuOpen(false); }}
                  className={`px-4 py-3 rounded-xl transition-all text-left font-medium ${
                    currentPage === page ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white' : `${darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-green-50'}`
                  }`}
                >
                  {t[page]}
                </button>
              ))}
              
              {currentUser ? (
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gradient-to-r from-green-50 to-blue-50'} mt-2`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold">{currentUser.username}</span>
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-sm ml-2 font-bold">
                        ⭐ {currentUser.points}
                      </span>
                    </div>
                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-xl hover:shadow-lg text-sm">
                      {t.logout}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => { setCurrentPage('login'); setIsMenuOpen(false); }}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-3 rounded-xl hover:shadow-lg flex items-center gap-2 mt-2"
                >
                  <User size={20} />
                  {t.login}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function HomePage({ setCurrentPage, darkMode, t }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) setCurrentPage('identify');
  };

  return (
    <div className="space-y-16">
      <section className="text-center py-12 md:py-20 relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-pulse delay-75"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-purple-500 rounded-full blur-3xl animate-pulse delay-150"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-4">
            <Sparkles className="text-yellow-400 animate-bounce" size={30} />
          </div>
          <h1 className="text-4xl md:text-7xl font-black mb-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient px-2">
            {t.appTitle}
          </h1>
          <p className={`text-xl md:text-2xl mb-8 font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'} px-2`}>{t.tagline}</p>

          <div className="max-w-3xl mx-auto px-4">
            <div className={`flex flex-col sm:flex-row gap-3 ${darkMode ? 'bg-gray-800/50 backdrop-blur-xl' : 'bg-white/80 backdrop-blur-xl'} rounded-2xl md:rounded-full shadow-2xl p-3 md:p-4 border-2 ${darkMode ? 'border-green-500/20' : 'border-green-200'}`}>
              <div className="flex items-center gap-2 sm:gap-0">
                <Search className="ml-2 sm:ml-4 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className={`flex-1 px-3 sm:px-2 py-3 sm:py-4 bg-transparent outline-none text-base sm:text-lg ${darkMode ? 'text-white placeholder-gray-400' : 'text-gray-800 placeholder-gray-500'}`}
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-full hover:shadow-xl transition-all flex items-center justify-center gap-2 font-bold hover:scale-105 min-h-[52px] sm:min-h-auto"
              >
                <span className="text-base sm:text-lg">Search</span>
                <ArrowRight className="ml-1" size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-2">
        {[
          { icon: Search, title: 'Identify Plants', desc: 'Discover species instantly', page: 'identify', gradient: 'from-green-500 to-emerald-600', iconBg: 'bg-green-100', iconColor: 'text-green-600' },
          { icon: Calendar, title: 'Garden Planner', desc: 'Plan your perfect garden', page: 'planner', gradient: 'from-blue-500 to-cyan-600', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
          { icon: BookOpen, title: 'Plant Quiz', desc: 'Test your knowledge', page: 'quiz', gradient: 'from-purple-500 to-pink-600', iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
          { icon: Shield, title: 'Conservation', desc: 'Track endangered species', page: 'tracker', gradient: 'from-orange-500 to-red-600', iconBg: 'bg-orange-100', iconColor: 'text-orange-600' }
        ].map((feature, idx) => (
          <div
            key={idx}
            onClick={() => setCurrentPage(feature.page)}
            className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' : 'bg-white/80 backdrop-blur-xl border border-gray-200'} p-6 md:p-8 rounded-3xl shadow-2xl hover:shadow-green-500/20 transition-all cursor-pointer group hover:scale-105 hover:-translate-y-2 duration-300`}
          >
            <div className={`${feature.iconBg} ${darkMode ? 'bg-opacity-20' : ''} w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform`}>
              <feature.icon className={`${feature.iconColor} group-hover:rotate-12 transition-transform`} size={28} />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">{feature.title}</h3>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3 md:mb-4 text-sm md:text-base`}>{feature.desc}</p>
            <div className={`flex items-center gap-2 text-sm font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
              Explore Now
              <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </section>

      <section className={`${darkMode ? 'bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-500/20' : 'bg-gradient-to-r from-green-100 to-blue-100 border border-green-200'} p-6 md:p-12 rounded-3xl shadow-2xl backdrop-blur-xl mx-2`}>
        <div className="text-center">
          <Zap className="mx-auto mb-4 text-yellow-500" size={40} />
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Why Choose Botanical AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8">
            {[
              { icon: Target, title: 'Accurate Data', desc: 'Real info from Wikipedia & Trefle API' },
              { icon: Sparkles, title: 'Beautiful UI', desc: 'Modern & responsive design' },
              { icon: Heart, title: 'Eco-Friendly', desc: 'Learn to protect nature' }
            ].map((item, idx) => (
              <div key={idx} className={`${darkMode ? 'bg-gray-800/50' : 'bg-white/80'} p-4 md:p-6 rounded-2xl backdrop-blur-xl`}>
                <item.icon className="mx-auto mb-3 text-green-600" size={32} />
                <h3 className="font-bold text-lg md:text-xl mb-2">{item.title}</h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm md:text-base`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function IdentifyPage({ darkMode }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [plantData, setPlantData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getMockPlantData = (plantName) => {
    const mockDatabase = {
      rose: {
        scientificName: 'Rosa rubiginosa',
        commonName: 'Rose',
        family: 'Rosaceae',
        familyCommonName: 'Rose family',
        description: 'Roses are woody perennial flowering plants of the genus Rosa, known for their beauty and fragrance. They have been cultivated for thousands of years. Roses are native to Asia, Europe, North America, and Northwest Africa.',
        habitat: 'Temperate regions worldwide',
        care: 'Full sun (6+ hours daily), well-drained soil, regular watering but avoid waterlogging, fertilize monthly during growing season',
        growth: 'Perennial shrub, grows 1-2 meters tall, blooms from spring to fall',
        distribution: 'Native to Asia, Europe, North America, Northwest Africa; cultivated worldwide',
        uses: 'Ornamental, perfumes, medicinal, culinary',
        propagation: 'Cuttings, grafting, seeds'
      },
      mango: {
        scientificName: 'Mangifera indica',
        commonName: 'Mango',
        family: 'Anacardiaceae',
        familyCommonName: 'Cashew family',
        description: 'Mango is a tropical stone fruit tree known for its sweet, juicy fruits. It is the national fruit of India and one of the most widely cultivated fruits in the tropics.',
        habitat: 'Tropical and subtropical regions',
        care: 'Full sun, well-drained soil, regular watering during dry periods, protect from frost',
        growth: 'Large evergreen tree, 10-45 meters tall, fruits in summer',
        distribution: 'Native to South Asia, now grown in tropical regions worldwide',
        uses: 'Fresh fruit, juices, pickles, chutneys',
        propagation: 'Grafting, seeds'
      },
      neem: {
        scientificName: 'Azadirachta indica',
        commonName: 'Neem',
        family: 'Meliaceae',
        familyCommonName: 'Mahogany family',
        description: 'Neem tree is known for its medicinal properties and is often called the "village pharmacy" in India. All parts of the tree have therapeutic uses.',
        habitat: 'Tropical and semi-tropical regions',
        care: 'Full sun, drought tolerant, grows in various soil types',
        growth: 'Fast-growing evergreen tree, 15-20 meters tall',
        distribution: 'Native to Indian subcontinent and dry regions of South Asia',
        uses: 'Medicinal, pesticide, cosmetics, timber',
        propagation: 'Seeds, cuttings'
      },
      tulip: {
        scientificName: 'Tulipa gesneriana',
        commonName: 'Tulip',
        family: 'Liliaceae',
        familyCommonName: 'Lily family',
        description: 'Tulips are spring-blooming perennial bulbs with large, colorful cup-shaped flowers. They are among the most popular garden flowers worldwide.',
        habitat: 'Temperate regions with cold winters',
        care: 'Full sun to partial shade, well-drained soil, plant bulbs in autumn',
        growth: 'Bulbous perennial, 10-70 cm tall, blooms in spring',
        distribution: 'Native to Central Asia, naturalized in Europe and North America',
        uses: 'Ornamental, cut flowers',
        propagation: 'Bulbs, seeds'
      },
      sunflower: {
        scientificName: 'Helianthus annuus',
        commonName: 'Sunflower',
        family: 'Asteraceae',
        familyCommonName: 'Sunflower family',
        description: 'Sunflowers are annual plants with large, bright yellow flower heads. They are known for their heliotropism - turning to face the sun throughout the day.',
        habitat: 'Sunny, open areas with well-drained soil',
        care: 'Full sun, regular watering, support for tall varieties',
        growth: 'Annual, grows 1-3 meters tall, blooms in summer',
        distribution: 'Native to North and South America, cultivated worldwide',
        uses: 'Oil seeds, ornamental, bird feed',
        propagation: 'Seeds'
      },
      lavender: {
        scientificName: 'Lavandula angustifolia',
        commonName: 'Lavender',
        family: 'Lamiaceae',
        familyCommonName: 'Mint family',
        description: 'Lavender is a flowering plant known for its fragrant purple flowers and aromatic foliage. It is widely used in perfumes, cosmetics, and aromatherapy.',
        habitat: 'Mediterranean region, dry sunny hillsides',
        care: 'Full sun, well-drained soil, drought tolerant once established',
        growth: 'Perennial shrub, 30-90 cm tall, blooms in summer',
        distribution: 'Native to Mediterranean, cultivated worldwide',
        uses: 'Aromatherapy, perfumes, culinary, ornamental',
        propagation: 'Cuttings, seeds'
      },
      oak: {
        scientificName: 'Quercus robur',
        commonName: 'Oak',
        family: 'Fagaceae',
        familyCommonName: 'Beech family',
        description: 'Oak trees are long-lived deciduous or evergreen trees known for their strength and hard wood. They produce acorns as fruit.',
        habitat: 'Temperate forests of Northern Hemisphere',
        care: 'Full sun to partial shade, deep soil, moderate watering',
        growth: 'Slow-growing tree, up to 40 meters tall, lives for centuries',
        distribution: 'Native to Europe, North Africa, Western Asia',
        uses: 'Timber, furniture, barrels, ornamental',
        propagation: 'Acorns (seeds)'
      },
      maple: {
        scientificName: 'Acer saccharum',
        commonName: 'Maple',
        family: 'Sapindaceae',
        familyCommonName: 'Soapberry family',
        description: 'Maple trees are known for their distinctive leaves and sweet sap used to make maple syrup. They are popular ornamental trees.',
        habitat: 'Temperate regions of Northern Hemisphere',
        care: 'Full sun to partial shade, well-drained soil',
        growth: 'Deciduous tree, 10-45 meters tall',
        distribution: 'Native to Asia, Europe, North America',
        uses: 'Maple syrup, timber, ornamental',
        propagation: 'Seeds, cuttings'
      },
      pine: {
        scientificName: 'Pinus sylvestris',
        commonName: 'Pine',
        family: 'Pinaceae',
        familyCommonName: 'Pine family',
        description: 'Pine trees are coniferous evergreen trees with needle-like leaves and cones. They are important timber trees.',
        habitat: 'Northern Hemisphere, various climates',
        care: 'Full sun, well-drained acidic soil',
        growth: 'Evergreen tree, 15-45 meters tall',
        distribution: 'Native to Northern Hemisphere',
        uses: 'Timber, paper pulp, ornamental, resin',
        propagation: 'Seeds (from cones)'
      },
      bamboo: {
        scientificName: 'Bambusa vulgaris',
        commonName: 'Bamboo',
        family: 'Poaceae',
        familyCommonName: 'Grass family',
        description: 'Bamboo is a fast-growing woody grass with hollow stems. It is one of the fastest-growing plants on Earth.',
        habitat: 'Tropical and subtropical regions',
        care: 'Full sun to partial shade, moist soil',
        growth: 'Fast-growing perennial, some species grow 91 cm per day',
        distribution: 'Native to Asia, Americas, Africa',
        uses: 'Construction, furniture, paper, edible shoots',
        propagation: 'Rhizome division, cuttings'
      },
      cactus: {
        scientificName: 'Cactaceae family',
        commonName: 'Cactus',
        family: 'Cactaceae',
        familyCommonName: 'Cactus family',
        description: 'Cacti are succulent plants adapted to dry environments. They store water in their thick stems and have spines instead of leaves.',
        habitat: 'Deserts and arid regions of Americas',
        care: 'Full sun, well-drained soil, minimal watering',
        growth: 'Slow-growing succulents, various sizes',
        distribution: 'Native to Americas, some species worldwide',
        uses: 'Ornamental, food (prickly pear), medicinal',
        propagation: 'Cuttings, seeds'
      },
      lily: {
        scientificName: 'Lilium candidum',
        commonName: 'Lily',
        family: 'Liliaceae',
        familyCommonName: 'Lily family',
        description: 'Lilies are herbaceous flowering plants grown from bulbs. They are known for their large, fragrant flowers.',
        habitat: 'Temperate regions of Northern Hemisphere',
        care: 'Full sun to partial shade, well-drained soil',
        growth: 'Perennial, 30-120 cm tall, blooms in summer',
        distribution: 'Native to Europe, Asia, North America',
        uses: 'Ornamental, cut flowers, medicinal',
        propagation: 'Bulbs, scales, seeds'
      },
      orchid: {
        scientificName: 'Orchidaceae family',
        commonName: 'Orchid',
        family: 'Orchidaceae',
        familyCommonName: 'Orchid family',
        description: 'Orchids are one of the largest families of flowering plants with over 28,000 species. They are known for their beautiful and complex flowers.',
        habitat: 'Tropical rainforests worldwide',
        care: 'Filtered light, high humidity, well-drained potting mix',
        growth: 'Epiphytic or terrestrial, various sizes',
        distribution: 'Worldwide, most diverse in tropics',
        uses: 'Ornamental, vanilla (from vanilla orchid)',
        propagation: 'Division, keikis, tissue culture'
      },
      fern: {
        scientificName: 'Polypodiopsida class',
        commonName: 'Fern',
        family: 'Various families',
        familyCommonName: 'Fern family',
        description: 'Ferns are vascular plants that reproduce via spores. They have feathery fronds and no flowers or seeds.',
        habitat: 'Moist, shady environments worldwide',
        care: 'Shade to partial sun, moist soil, high humidity',
        growth: 'Perennial, various sizes from small to tree ferns',
        distribution: 'Worldwide, especially in tropical rainforests',
        uses: 'Ornamental, some edible (fiddleheads)',
        propagation: 'Spores, division'
      },
      daisy: {
        scientificName: 'Bellis perennis',
        commonName: 'Daisy',
        family: 'Asteraceae',
        familyCommonName: 'Daisy family',
        description: 'Daisies are simple, cheerful flowers with white petals and yellow centers. They are common in meadows and gardens.',
        habitat: 'Temperate regions worldwide',
        care: 'Full sun, well-drained soil',
        growth: 'Perennial herb, 5-20 cm tall, blooms spring to fall',
        distribution: 'Native to Europe, naturalized worldwide',
        uses: 'Ornamental, medicinal (anti-inflammatory)',
        propagation: 'Seeds, division'
      },
      lotus: {
        scientificName: 'Nelumbo nucifera',
        commonName: 'Lotus',
        family: 'Nelumbonaceae',
        familyCommonName: 'Lotus family',
        description: 'Lotus is an aquatic perennial with large, beautiful flowers. It is sacred in Hinduism and Buddhism and symbolises purity.',
        habitat: 'Still freshwater ponds and lakes',
        care: 'Full sun, water depth 30-150 cm, rich soil',
        growth: 'Aquatic perennial, leaves float on water surface',
        distribution: 'Native to Asia and Australia',
        uses: 'Ornamental, edible (seeds, rhizomes), medicinal',
        propagation: 'Rhizome division, seeds'
      },
      jasmine: {
        scientificName: 'Jasminum officinale',
        commonName: 'Jasmine',
        family: 'Oleaceae',
        familyCommonName: 'Olive family',
        description: 'Jasmine is a climbing shrub known for its intensely fragrant white flowers. It is used in perfumes and teas.',
        habitat: 'Tropical and warm temperate regions',
        care: 'Full sun to partial shade, well-drained soil',
        growth: 'Climbing shrub, up to 6 meters, blooms summer',
        distribution: 'Native to tropical Asia, cultivated worldwide',
        uses: 'Perfumes, tea, ornamental, medicinal',
        propagation: 'Cuttings, layering'
      }
    };

    const key = plantName.toLowerCase().trim();
    return mockDatabase[key] || null;
  };

  const searchPlant = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    setPlantData(null);

    try {
      const wikiSearchUrl = `${WIKIPEDIA_API}?action=opensearch&format=json&origin=*&search=${encodeURIComponent(searchTerm)}&limit=1`;
      
      try {
        const wikiSearchRes = await fetch(wikiSearchUrl);
        const wikiSearchData = await wikiSearchRes.json();
        const pageTitle = wikiSearchData[1]?.[0];
        
        if (pageTitle) {
          const wikiUrl = `${WIKIPEDIA_API}?action=query&format=json&origin=*&prop=extracts|pageimages&exintro=true&explaintext=true&piprop=original&titles=${encodeURIComponent(pageTitle)}`;
          const wikiRes = await fetch(wikiUrl);
          const wikiData = await wikiRes.json();
          const pages = wikiData.query?.pages;
          const pageId = Object.keys(pages || {})[0];
          const page = pages?.[pageId];
          
          if (page && page.extract && pageId !== '-1') {
            const extract = page.extract;
            const scientificMatch = extract.match(/\(([A-Z][a-z]+\s+[a-z]+)\)/) || extract.match(/scientific name[:\s]+([A-Z][a-z]+\s+[a-z]+)/i);
            const familyMatch = extract.match(/family[:\s]+([A-Z][a-z]+aceae)/i) || extract.match(/([A-Z][a-z]+aceae)\s+family/i);
            const habitatMatch = extract.match(/native to ([^.]+)/i) || extract.match(/found in ([^.]+)/i);
            const usesMatch = extract.match(/used for ([^.]+)/i) || extract.match(/uses include ([^.]+)/i);
            
            const plantInfo = {
              scientificName: scientificMatch?.[1] || `${pageTitle} species`,
              commonName: pageTitle,
              family: familyMatch?.[1] || 'Family information in full article',
              familyCommonName: '',
              description: extract.length > 500 ? extract.substring(0, 500) + '...' : extract,
              habitat: habitatMatch?.[1] || 'Habitat details in Wikipedia article',
              care: 'For detailed care instructions, consult local gardening experts and botanical guides',
              growth: 'Growth characteristics vary by climate and conditions',
              distribution: habitatMatch?.[1] ? `Native to ${habitatMatch[1]}` : 'Distribution details in Wikipedia',
              uses: usesMatch?.[1] || 'Various uses including ornamental, medicinal, and culinary',
              propagation: 'Propagation methods vary by species'
            };

            setPlantData(plantInfo);
            setError('✅ Real data from Wikipedia Encyclopedia');
            setLoading(false);
            return;
          }
        }
      } catch (wikiErr) {
        console.log('Wikipedia API failed, trying Trefle...');
      }

      for (const apiKey of TREFLE_API_KEYS) {
        try {
          const searchUrl = `${TREFLE_BASE_URL}/plants/search?token=${apiKey}&q=${encodeURIComponent(searchTerm)}`;
          const searchRes = await fetch(searchUrl);
          
          if (searchRes.ok) {
            const searchData = await searchRes.json();
            
            if (searchData.data?.length > 0) {
              const plant = searchData.data[0];
              const detailUrl = `${TREFLE_BASE_URL}/plants/${plant.id}?token=${apiKey}`;
              const detailRes = await fetch(detailUrl);
              
              if (detailRes.ok) {
                const detailData = await detailRes.json();
                const plantDetail = detailData.data;
                
                const plantInfo = {
                  scientificName: plantDetail.scientific_name || 'Not available',
                  commonName: plantDetail.common_name || searchTerm,
                  family: plantDetail.family || 'Not specified',
                  familyCommonName: plantDetail.family_common_name || '',
                  description: plantDetail.observations || `${plantDetail.common_name || searchTerm} - botanical information from Trefle database`,
                  habitat: plantDetail.main_species?.distribution?.native?.slice(0, 5).join(', ') || 'Habitat data not available',
                  care: getCareInfo(plantDetail),
                  growth: getGrowthInfo(plantDetail),
                  distribution: getDistributionInfo(plantDetail),
                  uses: 'Various uses including ornamental, medicinal, and ecological',
                  propagation: 'Seeds, cuttings, or division depending on species'
                };

                setPlantData(plantInfo);
                setError('✅ Real data from Trefle Botanical API');
                setLoading(false);
                return;
              }
            }
          }
        } catch (trefleErr) {
          console.log('Trefle API error:', trefleErr);
          continue;
        }
      }

      const mockData = getMockPlantData(searchTerm);
      if (mockData) {
        setPlantData(mockData);
        setError('📚 Showing curated data from our comprehensive plant database');
        setLoading(false);
        return;
      }

      const capName = searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1);
      setPlantData({
        scientificName: `${capName} species`,
        commonName: capName,
        family: 'Plant family',
        familyCommonName: '',
        description: `${capName} is a plant species. For accurate botanical information, try searching common plant names like Rose, Mango, Neem, Tulip, Sunflower, Oak, or Lavender.`,
        habitat: 'Habitat varies by species',
        care: 'Consult local gardening resources for specific care instructions',
        growth: 'Growth varies by species and climate conditions',
        distribution: 'Distribution varies by species',
        uses: 'Various uses including ornamental, medicinal, and ecological',
        propagation: 'Propagation methods vary by species'
      });
      setError('ℹ️ Limited data available. Showing general information. Try common plant names for detailed data.');
    } catch (err) {
      console.error('Search error:', err);
      setError('⚠️ Search failed. Please try again with a different plant name.');
    } finally {
      setLoading(false);
    }
  };

  const getCareInfo = (plant) => {
    const care = [];
    const g = plant.main_species?.growth;
    if (g?.light) care.push(`Light: ${g.light}`);
    if (g?.atmospheric_humidity) care.push(`Humidity: ${g.atmospheric_humidity}`);
    if (g?.minimum_temperature?.deg_c) care.push(`Min temp: ${g.minimum_temperature.deg_c}°C`);
    return care.length > 0 ? care.join(', ') : 'Care information not available';
  };

  const getGrowthInfo = (plant) => {
    const info = [];
    const g = plant.main_species?.growth;
    if (g?.maximum_height?.cm) info.push(`Max height: ${g.maximum_height.cm}cm`);
    if (g?.growth_months?.length) info.push(`Growth months: ${g.growth_months.slice(0, 3).join(', ')}`);
    return info.length > 0 ? info.join(', ') : 'Growth information not available';
  };

  const getDistributionInfo = (plant) => {
    const dist = plant.main_species?.distribution;
    if (dist?.native?.length) return `Native to: ${dist.native.slice(0, 3).join(', ')}`;
    return 'Distribution data not available';
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-4">
          <Search className="text-green-600 animate-bounce" size={48} />
        </div>
        <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">🌿 Plant Identifier</h2>
        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Discover any plant with real-time botanical data</p>
      </div>

      <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' : 'bg-white/80 backdrop-blur-xl border border-gray-200'} p-4 md:p-8 rounded-3xl shadow-2xl mb-8`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter plant name (e.g., Rose, Mango, Tulip, Neem...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchPlant()}
            className={`flex-1 px-4 md:px-6 py-4 rounded-2xl border-2 ${darkMode ? 'bg-gray-900/50 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:border-green-500 outline-none transition-all text-base md:text-lg`}
          />
          <button
            onClick={searchPlant}
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 md:px-8 py-4 rounded-2xl hover:shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3 font-bold transition-all hover:scale-105 min-w-[120px] md:min-w-[140px] whitespace-nowrap"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span className="hidden md:inline">Searching...</span>
                <span className="md:hidden">...</span>
              </>
            ) : (
              <>
                <Search size={24} className="hidden md:block" />
                <span className="hidden md:inline">Search</span>
                <span className="md:hidden">🔍 Search</span>
              </>
            )}
          </button>
        </div>
        <p className={`text-xs md:text-sm mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2`}>
          <Sparkles size={16} className="text-yellow-500 hidden md:block" />
          <span className="text-xs md:text-sm">Real-time data from Wikipedia & Trefle Botanical API</span>
        </p>
      </div>

      {error && (
        <div className={`p-4 md:p-6 rounded-2xl mb-6 backdrop-blur-xl border-2 ${error.includes('⚠️') ? 'bg-red-500/10 border-red-500/30 text-red-600' : 'bg-blue-500/10 border-blue-500/30 text-blue-600'} flex items-center gap-3 font-medium text-sm md:text-base`}>
          <Star size={20} className="hidden md:block" />
          {error}
        </div>
      )}

      {plantData && (
        <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' : 'bg-white/80 backdrop-blur-xl border border-gray-200'} rounded-3xl shadow-2xl overflow-hidden hover:shadow-green-500/20 transition-all`}>
          <div className={`${darkMode ? 'bg-gradient-to-r from-green-900/50 to-blue-900/50' : 'bg-gradient-to-r from-green-50 to-blue-50'} p-6 md:p-8`}>
            <div className="text-center mb-6">
              <h3 className="text-3xl md:text-4xl font-black mb-2 text-green-700">{plantData.commonName}</h3>
              <p className="text-lg md:text-xl italic text-gray-600">{plantData.scientificName}</p>
            </div>
            
            <div className="flex flex-wrap gap-2 md:gap-3 mb-6 justify-center">
              <span className={`px-3 md:px-4 py-2 rounded-full text-sm md:text-base font-bold ${darkMode ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-green-100 text-green-700 border border-green-200'}`}>
                🌱 {plantData.family}
              </span>
              {plantData.familyCommonName && (
                <span className={`px-3 md:px-4 py-2 rounded-full text-sm md:text-base ${darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                  {plantData.familyCommonName}
                </span>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-white/80'} p-6 rounded-2xl shadow-lg`}>
                  <h4 className="font-black text-xl mb-4 flex items-center gap-2">
                    <BookOpen className="text-green-600" size={24} />
                    Description
                  </h4>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{plantData.description}</p>
                </div>
                
                <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-white/80'} p-6 rounded-2xl shadow-lg`}>
                  <h4 className="font-black text-xl mb-4 flex items-center gap-2">
                    <Globe className="text-blue-600" size={24} />
                    Distribution & Habitat
                  </h4>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <strong>Distribution:</strong> {plantData.distribution}<br/>
                    <strong>Habitat:</strong> {plantData.habitat}
                  </p>
                </div>
                
                <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-white/80'} p-6 rounded-2xl shadow-lg`}>
                  <h4 className="font-black text-xl mb-4 flex items-center gap-2">
                    <Sparkles className="text-purple-600" size={24} />
                    Uses & Benefits
                  </h4>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{plantData.uses}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-white/80'} p-6 rounded-2xl shadow-lg`}>
                  <h4 className="font-black text-xl mb-4 flex items-center gap-2">
                    <Droplets className="text-blue-600" size={24} />
                    Care Instructions
                  </h4>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{plantData.care}</p>
                </div>
                
                <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-white/80'} p-6 rounded-2xl shadow-lg`}>
                  <h4 className="font-black text-xl mb-4 flex items-center gap-2">
                    <TrendingUp className="text-orange-600" size={24} />
                    Growth Information
                  </h4>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{plantData.growth}</p>
                </div>
                
                <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-white/80'} p-6 rounded-2xl shadow-lg`}>
                  <h4 className="font-black text-xl mb-4 flex items-center gap-2">
                    <Leaf className="text-green-600" size={24} />
                    Propagation
                  </h4>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{plantData.propagation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!plantData && !loading && (
        <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' : 'bg-white/80 backdrop-blur-xl border border-gray-200'} p-4 md:p-8 rounded-3xl shadow-2xl`}>
          <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
            <Sparkles className="text-yellow-500" size={24} />
            Popular Plants to Explore
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-3">
            {['Rose', 'Mango', 'Neem', 'Tulip', 'Sunflower', 'Lavender', 'Oak', 'Maple', 'Pine', 'Bamboo', 'Cactus', 'Lily', 'Orchid', 'Fern', 'Daisy', 'Lotus', 'Jasmine'].map((plant) => (
              <button
                key={plant}
                onClick={() => { setSearchTerm(plant); setTimeout(searchPlant, 100); }}
                className={`px-2 md:px-4 py-2 md:py-3 rounded-xl text-xs md:text-sm font-bold transition-all hover:scale-105 ${
                  darkMode ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white' : 'bg-gradient-to-r from-green-100 to-blue-100 hover:from-green-200 hover:to-blue-200 text-gray-800'
                } shadow-lg`}
              >
                {plant}
              </button>
            ))}
          </div>
          <p className={`mt-4 md:mt-6 text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2 justify-center`}>
            <Heart size={14} className="text-red-500" />
            Real botanical data from trusted sources!
          </p>
        </div>
      )}
    </div>
  );
}

function PlannerPage({ darkMode, currentUser, updateUser }) {
  const [plants, setPlants] = useState([]);
  const [newPlant, setNewPlant] = useState('');
  const [plantingDate, setPlantingDate] = useState('');

  useEffect(() => {
    if (currentUser) {
      setPlants(currentUser.gardenPlants || []);
    }
  }, [currentUser]);

  const addPlant = () => {
    if (!currentUser) {
      alert('Please login first!');
      return;
    }

    if (newPlant && plantingDate) {
      const plant = {
        id: Date.now(),
        name: newPlant,
        plantingDate,
        nextWatering: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        nextFertilizing: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      const updatedPlants = [...plants, plant];
      setPlants(updatedPlants);
      updateUser({ gardenPlants: updatedPlants, points: currentUser.points + 10 });
      setNewPlant('');
      setPlantingDate('');
    }
  };

  const removePlant = (id) => {
    const updatedPlants = plants.filter(p => p.id !== id);
    setPlants(updatedPlants);
    updateUser({ gardenPlants: updatedPlants });
  };

  if (!currentUser) {
    return (
      <div className="text-center py-20">
        <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' : 'bg-white/80 backdrop-blur-xl border border-gray-200'} max-w-md mx-auto p-8 md:p-12 rounded-3xl shadow-2xl`}>
          <Calendar size={60} className="mx-auto mb-6 text-gray-400" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Login Required</h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Please login to access Garden Planner</p>
          <button 
            onClick={() => window.location.href = '#login'}
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl hover:shadow-2xl transition-all font-bold hover:scale-105"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8 md:mb-12">
        <div className="flex justify-center mb-4">
          <Calendar className="text-blue-600 animate-bounce" size={40} />
        </div>
        <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">🪴 Garden Planner</h2>
        <p className={`text-base md:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Organize and track your garden plants</p>
      </div>

      <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' : 'bg-white/80 backdrop-blur-xl border border-gray-200'} p-4 md:p-8 rounded-3xl shadow-2xl mb-8 md:mb-10`}>
        <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
          <Sparkles className="text-yellow-500" size={24} />
          Add New Plant
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          <input
            type="text"
            placeholder="Plant name"
            value={newPlant}
            onChange={(e) => setNewPlant(e.target.value)}
            className={`px-4 md:px-6 py-3 md:py-4 rounded-2xl border-2 ${darkMode ? 'bg-gray-900/50 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:border-blue-500 outline-none transition-all`}
          />
          <input
            type="date"
            value={plantingDate}
            onChange={(e) => setPlantingDate(e.target.value)}
            className={`px-4 md:px-6 py-3 md:py-4 rounded-2xl border-2 ${darkMode ? 'bg-gray-900/50 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:border-blue-500 outline-none transition-all`}
          />
          <button
            onClick={addPlant}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-2xl hover:shadow-2xl font-bold transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            <span>Add Plant</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {plants.map(plant => (
          <div key={plant.id} className={`${darkMode ? 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700' : 'bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-xl border border-gray-200'} p-4 md:p-6 rounded-3xl shadow-2xl hover:shadow-blue-500/20 transition-all hover:scale-105`}>
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg md:text-2xl font-bold flex items-center gap-2">
                <Leaf className="text-green-500" size={20} />
                {plant.name}
              </h3>
              <button
                onClick={() => removePlant(plant.id)}
                className="text-red-500 hover:text-red-700 text-xs md:text-sm font-bold hover:scale-110 transition-all"
              >
                Remove
              </button>
            </div>
            <div className="space-y-2 md:space-y-3">
              <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-blue-50'} p-2 md:p-3 rounded-xl`}>
                <p className="text-xs md:text-sm font-bold mb-1">🌱 Planted</p>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>{plant.plantingDate}</p>
              </div>
              <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-blue-50'} p-2 md:p-3 rounded-xl`}>
                <p className="text-xs md:text-sm font-bold mb-1">💧 Next Watering</p>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>{plant.nextWatering}</p>
              </div>
              <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-blue-50'} p-2 md:p-3 rounded-xl`}>
                <p className="text-xs md:text-sm font-bold mb-1">🌿 Next Fertilizing</p>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm`}>{plant.nextFertilizing}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {plants.length === 0 && (
        <div className="text-center py-12 md:py-16">
          <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' : 'bg-white/80 backdrop-blur-xl border border-gray-200'} max-w-md mx-auto p-8 md:p-12 rounded-3xl shadow-2xl`}>
            <Leaf size={60} className="mx-auto mb-6 text-gray-400 animate-bounce" />
            <p className={`text-lg md:text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No plants yet. Add your first plant! 🌱</p>
          </div>
        </div>
      )}
    </div>
  );
}

function QuizPage({ darkMode, currentUser, updateUser }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questions, setQuestions] = useState([
    {
      question: 'What is the scientific name of Rose?',
      options: ['Rosa rubiginosa', 'Quercus robur', 'Acer saccharum', 'Pinus sylvestris'],
      correct: 'Rosa rubiginosa',
      fact: 'Roses belong to the Rosaceae family and have over 300 species.'
    },
    {
      question: 'Which gas do plants absorb during photosynthesis?',
      options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
      correct: 'Carbon Dioxide',
      fact: 'Plants absorb CO2 and release oxygen, producing their own food.'
    },
    {
      question: 'What is the largest flower in the world?',
      options: ['Sunflower', 'Rafflesia', 'Rose', 'Lotus'],
      correct: 'Rafflesia',
      fact: 'Rafflesia arnoldii can grow up to 3 feet in diameter!'
    },
    {
      question: 'Which part of the plant absorbs water?',
      options: ['Leaves', 'Roots', 'Flowers', 'Stem'],
      correct: 'Roots',
      fact: 'Roots anchor plants and absorb water and minerals from soil.'
    },
    {
      question: 'What process do plants use to make food?',
      options: ['Respiration', 'Photosynthesis', 'Transpiration', 'Germination'],
      correct: 'Photosynthesis',
      fact: 'Photosynthesis converts sunlight into chemical energy.'
    }
  ]);

  if (!currentUser) {
    return (
      <div className="text-center py-20">
        <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' : 'bg-white/80 backdrop-blur-xl border border-gray-200'} max-w-md mx-auto p-8 md:p-12 rounded-3xl shadow-2xl`}>
          <BookOpen size={60} className="mx-auto mb-6 text-gray-400" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Login Required</h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Please login to take the quiz</p>
        </div>
      </div>
    );
  }

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    if (answer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
        const finalScore = answer === questions[currentQuestion].correct ? score + 1 : score;
        updateUser({ 
          points: currentUser.points + (finalScore * 20),
          quizScores: [...(currentUser.quizScores || []), { 
            score: finalScore, 
            total: questions.length,
            date: new Date().toISOString() 
          }]
        });
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setQuestions([...questions].sort(() => Math.random() - 0.5));
  };

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto text-center px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">🎉 Quiz Complete!</h2>
        <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' : 'bg-white/80 backdrop-blur-xl border border-gray-200'} p-4 md:p-6 rounded-3xl shadow-2xl`}>
          <Award size={48} className="mx-auto mb-4 text-yellow-500 animate-bounce" />
          <p className="text-xl md:text-2xl font-bold mb-4">Score: {score}/{questions.length}</p>
          <p className="text-lg md:text-xl mb-4">You earned {score * 20} points!</p>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {score === questions.length && "Perfect score! You're a botanical expert! 🌿"}
            {score >= questions.length * 0.7 && score < questions.length && "Great job! Keep learning! 🌱"}
            {score < questions.length * 0.7 && "Good attempt! Keep exploring the plant world! 🌼"}
          </p>
          <button
            onClick={resetQuiz}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 md:px-8 py-3 rounded-2xl hover:shadow-2xl font-bold transition-all hover:scale-105"
          >
            Take New Quiz
          </button>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="text-center mb-6 md:mb-8">
        <div className="flex justify-center mb-4">
          <BookOpen className="text-purple-600 animate-bounce" size={40} />
        </div>
        <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">📚 Plant Quiz</h2>
        <p className={`text-base md:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Test your botanical knowledge</p>
      </div>

      <div className="mb-6 md:mb-8">
        <div className="flex justify-between mb-2 text-sm md:text-base">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Question {currentQuestion + 1}/{questions.length}
          </span>
          <span className="font-bold">Score: {score}</span>
        </div>
        <div className={`h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-full`}>
          <div 
            className="h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' : 'bg-white/80 backdrop-blur-xl border border-gray-200'} p-4 md:p-6 rounded-3xl shadow-2xl`}>
        <h3 className="text-lg md:text-xl font-bold mb-4 md:mb-6">{q.question}</h3>
        <div className="space-y-2 md:space-y-3">
          {q.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`w-full p-3 md:p-4 rounded-2xl text-left transition-all text-sm md:text-base font-medium ${
                selectedAnswer === null
                  ? `${darkMode ? 'bg-gray-700 hover:bg-gray-600 hover:scale-105' : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'}`
                  : selectedAnswer === option
                  ? option === q.correct
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white scale-105'
                    : 'bg-gradient-to-r from-red-500 to-pink-600 text-white scale-105'
                  : option === q.correct
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                  : `${darkMode ? 'bg-gray-700' : 'bg-gray-100'} opacity-50`
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {selectedAnswer !== null && (
          <div className={`mt-4 md:mt-6 p-3 md:p-4 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-purple-50'} animate-fadeIn`}>
            <p className="font-bold mb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-500" />
              Did you know?
            </p>
            <p className={`text-sm md:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{q.fact}</p>
          </div>
        )}
      </div>

      <div className={`mt-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <p className="text-sm">Each correct answer gives you 20 points!</p>
      </div>
    </div>
  );
}

function TrackerPage({ darkMode, currentUser, updateUser }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [plantInfo, setPlantInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  const endangeredPlants = {
    'venus flytrap': {
      name: 'Venus Flytrap',
      scientificName: 'Dionaea muscipula',
      status: 'Vulnerable',
      threat: 'Habitat loss, poaching, fire suppression',
      description: 'The Venus flytrap is a carnivorous plant native to subtropical wetlands on the East Coast of the United States. It catches its prey—chiefly insects and arachnids—with a trapping structure formed by the terminal portion of each of the plant\'s leaves.',
      conservation: 'Protected in North Carolina, USA. Collection from the wild is illegal. Conservation efforts include habitat protection and propagation programs.',
      iucn: 'Vulnerable (IUCN Red List)',
      year: 2018
    },
    'monkey puzzle': {
      name: 'Monkey Puzzle Tree',
      scientificName: 'Araucaria araucana',
      status: 'Endangered',
      threat: 'Deforestation, fire, overharvesting',
      description: 'The monkey puzzle tree is an evergreen tree growing to 40 m tall with a trunk up to 2 m diameter. It is native to central and southern Chile and western Argentina.',
      conservation: 'Protected as a natural monument in Chile. International trade is restricted under CITES.',
      iucn: 'Endangered (IUCN Red List)',
      year: 2013
    },
    'ghost orchid': {
      name: 'Ghost Orchid',
      scientificName: 'Dendrophylax lindenii',
      status: 'Critically Endangered',
      threat: 'Habitat destruction, illegal collection, climate change',
      description: 'The ghost orchid is a rare, leafless orchid that grows on tree bark in swamps and humid forests. It is known for its beautiful white flowers that appear to float in air.',
      conservation: 'Strictly protected. Propagation programs underway in botanical gardens.',
      iucn: 'Critically Endangered (IUCN Red List)',
      year: 2020
    },
    'rafflesia': {
      name: 'Rafflesia',
      scientificName: 'Rafflesia arnoldii',
      status: 'Critically Endangered',
      threat: 'Deforestation, habitat fragmentation',
      description: 'Rafflesia is a genus of parasitic flowering plants containing approximately 28 species. It has the largest flower in the world, with some species measuring over 100 cm in diameter.',
      conservation: 'Protected in Indonesia and Malaysia. Habitat conservation critical.',
      iucn: 'Critically Endangered (IUCN Red List)',
      year: 2021
    },
    'franklin tree': {
      name: 'Franklin Tree',
      scientificName: 'Franklinia alatamaha',
      status: 'Extinct in Wild',
      threat: 'Unknown causes (possibly fungal disease)',
      description: 'The Franklin tree is a small deciduous tree with fragrant white flowers. It was discovered in 1765 but has been extinct in the wild since 1803.',
      conservation: 'Survives only in cultivation. Botanical gardens maintain living collections.',
      iucn: 'Extinct in Wild (IUCN Red List)',
      year: 1998
    }
  };

  const commonPlants = ['rose', 'tulip', 'sunflower', 'lavender', 'oak', 'maple', 'pine', 'bamboo', 'cactus', 'lily'];

  const searchEndangered = () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setSearchError('');
    setPlantInfo(null);

    setTimeout(() => {
      const plantKey = searchTerm.toLowerCase().trim();
      
      if (endangeredPlants[plantKey]) {
        setPlantInfo(endangeredPlants[plantKey]);
        setSearchError('');
      } else if (commonPlants.includes(plantKey)) {
        setPlantInfo({
          name: searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1),
          scientificName: `${searchTerm} species`,
          status: 'Not Endangered',
          threat: 'This plant is commonly found and not currently threatened',
          description: `This plant species is not currently listed as endangered. It is commonly cultivated and found in various habitats.`,
          conservation: 'No special conservation measures needed. Continue normal gardening practices.',
          iucn: 'Least Concern (IUCN Red List)',
          year: new Date().getFullYear(),
          isCommon: true
        });
        setSearchError('✅ This plant is not endangered. Continue enjoying it!');
      } else {
        setPlantInfo({
          name: searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1),
          scientificName: 'Unknown',
          status: 'Not Found',
          threat: 'Plant information not in our endangered database',
          description: 'This plant is not in our endangered species database. Try searching for: venus flytrap, monkey puzzle, ghost orchid, rafflesia, or franklin tree.',
          conservation: 'Check IUCN Red List for official conservation status.',
          iucn: 'Data Deficient',
          year: null
        });
        setSearchError('⚠️ Plant not found in endangered database. Try the suggested plants.');
      }
      setLoading(false);
    }, 1000);
  };

  const makePledge = () => {
    if (!currentUser) {
      alert('Please login to make a conservation pledge');
      return;
    }

    if (!plantInfo || plantInfo.status === 'Not Endangered' || plantInfo.status === 'Not Found') {
      alert('You can only pledge for endangered plants');
      return;
    }

    const pledge = {
      plant: plantInfo.name,
      date: new Date().toISOString(),
      status: plantInfo.status
    };

    updateUser({
      pledges: [...(currentUser.pledges || []), pledge],
      points: currentUser.points + 50,
      badges: [...new Set([...(currentUser.badges || []), '🌱 Plant Protector'])]
    });

    alert(`Thank you for pledging to protect ${plantInfo.name}! You earned 50 points!`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8 md:mb-12">
        <div className="flex justify-center mb-4">
          <Shield className="text-orange-600 animate-bounce" size={40} />
        </div>
        <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">🛡️ Conservation Tracker</h2>
        <p className={`text-base md:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Track and protect endangered plant species</p>
      </div>

      <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' : 'bg-white/80 backdrop-blur-xl border border-gray-200'} p-4 md:p-6 rounded-3xl shadow-2xl mb-6 md:mb-8`}>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Search endangered plants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchEndangered()}
            className={`flex-1 px-4 md:px-6 py-3 md:py-4 rounded-2xl border-2 ${darkMode ? 'bg-gray-900/50 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:border-red-500 outline-none transition-all text-base md:text-lg`}
          />
          <button
            onClick={searchEndangered}
            disabled={loading}
            className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-4 md:px-8 py-3 md:py-4 rounded-2xl hover:shadow-2xl disabled:opacity-50 font-bold transition-all hover:scale-105 min-w-[100px] md:min-w-[140px] whitespace-nowrap"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        <p className={`text-xs md:text-sm mt-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'} flex items-center gap-2`}>
          <AlertTriangle size={14} className="text-orange-500" />
          Try: venus flytrap, monkey puzzle, ghost orchid, rafflesia, franklin tree
        </p>
      </div>

      {searchError && (
        <div className={`p-4 md:p-6 rounded-2xl mb-6 backdrop-blur-xl border-2 ${searchError.includes('⚠️') ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600' : 'bg-green-500/10 border-green-500/30 text-green-600'} flex items-center gap-3 font-medium text-sm md:text-base`}>
          {searchError.includes('⚠️') ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
          {searchError}
        </div>
      )}

      {plantInfo && (
        <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' : 'bg-white/80 backdrop-blur-xl border border-gray-200'} rounded-3xl shadow-2xl overflow-hidden hover:shadow-red-500/20 transition-all`}>
          <div className={`${darkMode ? 'bg-gradient-to-r from-red-900/30 to-orange-900/30' : 'bg-gradient-to-r from-red-50 to-orange-50'} p-6 md:p-8`}>
            <div className="text-center mb-6">
              <h3 className="text-2xl md:text-3xl font-black mb-2 text-red-700">{plantInfo.name}</h3>
              <p className="text-lg md:text-xl italic text-gray-600">{plantInfo.scientificName}</p>
            </div>
            
            <div className="flex justify-center mb-6">
              <span className={`px-4 md:px-6 py-2 md:py-3 rounded-full font-bold text-sm md:text-base ${
                plantInfo.status === 'Critically Endangered' ? 'bg-red-600 text-white' :
                plantInfo.status === 'Endangered' ? 'bg-orange-600 text-white' :
                plantInfo.status === 'Vulnerable' ? 'bg-yellow-600 text-white' :
                plantInfo.status === 'Extinct in Wild' ? 'bg-gray-600 text-white' :
                plantInfo.status === 'Not Endangered' ? 'bg-green-600 text-white' :
                'bg-gray-400 text-white'
              }`}>
                {plantInfo.status}
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-white/80'} p-6 rounded-2xl shadow-lg`}>
                  <h4 className="font-black text-xl mb-4 flex items-center gap-2">
                    <BookOpen className="text-blue-600" size={24} />
                    Description
                  </h4>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{plantInfo.description}</p>
                </div>
                
                <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-white/80'} p-6 rounded-2xl shadow-lg`}>
                  <h4 className="font-black text-xl mb-4 flex items-center gap-2">
                    <AlertTriangle className="text-red-600" size={24} />
                    Threats
                  </h4>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{plantInfo.threat}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-white/80'} p-6 rounded-2xl shadow-lg`}>
                  <h4 className="font-black text-xl mb-4 flex items-center gap-2">
                    <Shield className="text-green-600" size={24} />
                    Conservation Status
                  </h4>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{plantInfo.conservation}</p>
                  {plantInfo.iucn && (
                    <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <strong>IUCN Status:</strong> {plantInfo.iucn}
                      {plantInfo.year && ` (${plantInfo.year})`}
                    </p>
                  )}
                </div>
                
                {plantInfo.status !== 'Not Endangered' && plantInfo.status !== 'Not Found' && (
                  <div className={`${darkMode ? 'bg-gray-900/50' : 'bg-white/80'} p-6 rounded-2xl shadow-lg`}>
                    <button
                      onClick={makePledge}
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-4 rounded-2xl hover:shadow-2xl transition-all font-bold hover:scale-105 flex items-center justify-center gap-3"
                    >
                      <Shield size={24} />
                      Pledge to Protect {plantInfo.name}
                      <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs ml-2">+50 pts</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!plantInfo && !loading && (
        <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' : 'bg-white/80 backdrop-blur-xl border border-gray-200'} p-4 md:p-6 rounded-3xl shadow-2xl`}>
          <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
            <AlertTriangle className="text-orange-500" size={24} />
            Endangered Plants Database
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {Object.entries(endangeredPlants).map(([key, plant]) => (
              <button
                key={key}
                onClick={() => {
                  setSearchTerm(key);
                  setTimeout(searchEndangered, 100);
                }}
                className={`p-3 md:p-4 rounded-2xl text-left transition-all hover:scale-105 ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-50 hover:bg-red-100'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${
                    plant.status === 'Critically Endangered' ? 'bg-red-500' :
                    plant.status === 'Endangered' ? 'bg-orange-500' :
                    plant.status === 'Vulnerable' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`}></div>
                  <span className="text-xs font-bold">{plant.status}</span>
                </div>
                <p className="font-semibold text-base md:text-lg mb-1">{plant.name}</p>
                <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{plant.scientificName}</p>
              </button>
            ))}
          </div>
          <div className={`mt-4 md:mt-6 p-3 md:p-4 rounded-2xl ${darkMode ? 'bg-blue-900/30' : 'bg-blue-50'} text-center`}>
            <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>Note:</strong> Common plants like Rose, Tulip, Sunflower are not endangered.
              Search any plant to check its conservation status.
            </p>
          </div>
        </div>
      )}

      {currentUser && currentUser.pledges && currentUser.pledges.length > 0 && (
        <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' : 'bg-white/80 backdrop-blur-xl border border-gray-200'} p-4 md:p-6 rounded-3xl shadow-2xl mt-6 md:mt-8`}>
          <h3 className="text-lg md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-3">
            <Shield className="text-green-600" size={24} />
            Your Conservation Pledges ({currentUser.pledges.length})
          </h3>
          <div className="space-y-2 md:space-y-3">
            {currentUser.pledges.map((pledge, idx) => (
              <div 
                key={idx} 
                className={`p-3 md:p-4 rounded-2xl ${darkMode ? 'bg-gray-700' : 'bg-gradient-to-r from-green-50 to-blue-50'} flex justify-between items-center hover:scale-105 transition-all`}
              >
                <div>
                  <span className="font-bold text-base md:text-lg">{pledge.plant}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      pledge.status === 'Critically Endangered' ? 'bg-red-100 text-red-800' :
                      pledge.status === 'Endangered' ? 'bg-orange-100 text-orange-800' :
                      pledge.status === 'Vulnerable' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {pledge.status}
                    </span>
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {new Date(pledge.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Shield size={18} className="text-green-600" />
              </div>
            ))}
          </div>
          <p className={`mt-3 md:mt-4 text-center text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Thank you for your conservation efforts! Every pledge helps protect our planet's biodiversity. 🌍
          </p>
        </div>
      )}
    </div>
  );
}

function LoginPage({ setCurrentPage, darkMode }) {
  const { login, register } = React.useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (password.length < 3) {
      setError('Password must be at least 3 characters');
      return;
    }

    const result = isLogin ? login(username, password) : register(username, password);

    if (result.success) {
      setCurrentPage('home');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4">
      <div className={`${darkMode ? 'bg-gray-800/50 backdrop-blur-xl border border-gray-700' : 'bg-white/80 backdrop-blur-xl border border-gray-200'} p-6 md:p-8 rounded-3xl shadow-2xl`}>
        <div className="text-center mb-8 md:mb-10">
          <div className="relative inline-block">
            <Leaf className="mx-auto mb-6 text-green-600 animate-bounce" size={48} />
            <Sparkles className="absolute -top-2 -right-2 text-yellow-400 w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black mb-3">{isLogin ? 'Welcome Back!' : 'Join Us'}</h2>
          <p className={`text-base md:text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {isLogin ? 'Login to continue your botanical journey' : 'Create your botanical account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className="block mb-2 md:mb-3 font-bold text-base md:text-lg">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full px-4 md:px-6 py-3 md:py-4 rounded-2xl border-2 ${darkMode ? 'bg-gray-900/50 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:border-green-500 outline-none transition-all text-base md:text-lg`}
              placeholder="Enter username (min 3 chars)"
            />
          </div>

          <div>
            <label className="block mb-2 md:mb-3 font-bold text-base md:text-lg">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 md:px-6 py-3 md:py-4 rounded-2xl border-2 ${darkMode ? 'bg-gray-900/50 border-gray-600 text-white' : 'bg-white border-gray-300'} focus:border-green-500 outline-none transition-all text-base md:text-lg`}
              placeholder="Enter password (min 3 chars)"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border-2 border-red-500/30 text-red-600 px-4 md:px-6 py-3 md:py-4 rounded-2xl text-sm font-medium flex items-center gap-3">
              <XCircle size={18} />
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 md:px-6 py-3 md:py-4 rounded-2xl hover:shadow-2xl font-bold text-base md:text-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            {isLogin ? (
              <>
                <CheckCircle size={20} />
                Login
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="mt-6 md:mt-8 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setUsername('');
              setPassword('');
            }}
            className={`text-sm font-medium ${darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-700'} transition-colors`}
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

function Footer({ darkMode, t }) {
  return (
    <footer className={`${darkMode ? 'bg-gray-900/95 backdrop-blur-xl border-t border-gray-700' : 'bg-white/95 backdrop-blur-xl border-t border-gray-200'} mt-12 md:mt-20 py-8 md:py-12 transition-all`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="text-red-500 animate-pulse" size={24} />
          </div>
          <p className={`italic mb-4 md:mb-6 text-base md:text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {t.ecoQuote}
          </p>
        </div>
        <div className="text-center">
          <p className={`font-bold text-base md:text-lg mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            ©  Smart Botanical Assistant. All rights reserved. Built by Sahani Abhishek.
          </p>
          <p className={`text-xs md:text-sm flex items-center justify-center gap-2 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            <Sparkles size={14} className="text-yellow-500" />
            Using Trefle API, Wikipedia 
            <Leaf size={14} className="text-green-500" />
          </p>
          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
            Data sources:  Trefle Botanical API, Wikipedia.
          </p>
        </div>
      </div>
    </footer>
  );
}