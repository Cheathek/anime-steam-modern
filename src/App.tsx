import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { AnimeDetailPage } from './pages/AnimeDetailPage';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-white">
          <Navbar />
          
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/top" element={<CategoryPage />} />
              <Route path="/seasonal" element={<CategoryPage />} />
              <Route path="/movies" element={<CategoryPage />} />
              <Route path="/browse" element={<CategoryPage />} />
              <Route path="/anime/:id" element={<AnimeDetailPage />} />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;