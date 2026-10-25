import React, { Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import Navbar from './components/Navbar.jsx';
import DetailModal from './components/DetailModal.jsx';
import QuizModal from './components/QuizModal.jsx';
import Footer from './components/Footer.jsx';

// Lazy-loaded pages for code-splitting & high Lighthouse performance
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const HeroesPage = lazy(() => import('./pages/HeroesPage.jsx'));
const ItemsPage = lazy(() => import('./pages/ItemsPage.jsx'));
const SearchPage = lazy(() => import('./pages/SearchPage.jsx'));
const MyListPage = lazy(() => import('./pages/MyListPage.jsx'));

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#141414] pt-28 px-4 sm:px-8 max-w-[1440px] mx-auto space-y-6">
      <div className="h-10 w-72 nf-skeleton rounded" />
      <div className="h-64 w-full nf-skeleton rounded-xl" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-44 nf-skeleton rounded-md" />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-[#141414] text-white flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/heroes" element={<HeroesPage />} />
                <Route path="/items" element={<ItemsPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/my-list" element={<MyListPage />} />
              </Routes>
            </Suspense>
          </main>
          <DetailModal />
          <QuizModal />
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}
