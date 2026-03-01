import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, ChevronLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fbff] to-[#eef5ff] flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => navigate('/')}
          >
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform duration-300">
              <BookOpen size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                Studyverse
              </h1>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                BSE ODISHA LEARNING
              </p>
            </div>
          </div>
          
          {!isHome && (
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 hover:bg-slate-100 rounded-full text-slate-600 transition-all hover:text-blue-600"
              aria-label="Go back"
            >
              <ChevronLeft size={24} />
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <div className="bg-blue-50 p-2 rounded-lg">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <span className="font-bold text-slate-800 text-lg">Studyverse</span>
          </div>
          <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto leading-relaxed">
            Empowering BSE Odisha students with free, high-quality educational resources. 
            Books, solutions, and papers at your fingertips.
          </p>
          
          <div className="flex justify-center gap-6 mb-8 text-sm font-medium text-slate-600">
            <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
            <a href="/admin" className="hover:text-blue-600 transition-colors">Admin Panel</a>
          </div>

          <div className="text-slate-400 text-xs font-medium">
            © {new Date().getFullYear()} Studyverse. Built for Education.
          </div>
        </div>
      </footer>
    </div>
  );
}
