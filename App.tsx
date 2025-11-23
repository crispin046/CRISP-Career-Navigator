import React, { useState } from 'react';
import { UserSegment } from './types';
import { KidsExplorer } from './components/KidsExplorer';
import { PathwaysGuide } from './components/PathwaysGuide';
import { CareerPlanner } from './components/CareerPlanner';
import { LayoutGrid, User, Briefcase, GraduationCap } from 'lucide-react';

const App: React.FC = () => {
  // Simple state-based routing for single-file architecture compliance
  const [currentSegment, setCurrentSegment] = useState<UserSegment | null>(null);

  const renderContent = () => {
    switch (currentSegment) {
      case UserSegment.KIDS:
        return <KidsExplorer />;
      case UserSegment.PATHWAYS:
        return <PathwaysGuide />;
      case UserSegment.CAREER:
        return <CareerPlanner />;
      default:
        return <LandingPage onSelect={setCurrentSegment} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-off-white font-sans text-brand-dark">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setCurrentSegment(null)}>
              <div className="flex-shrink-0 flex items-center gap-2">
                <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold shadow-sm">C</div>
                <span className="font-bold text-xl tracking-tight text-brand-dark">CRISP</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {currentSegment && (
                <button 
                  onClick={() => setCurrentSegment(null)}
                  className="text-sm font-medium text-gray-500 hover:text-brand-primary transition-colors"
                >
                  Switch Mode
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 CRISP Career Navigator. Empowering African Learners.
          </p>
          <div className="mt-2 text-xs text-gray-300 flex justify-center gap-4">
            <span>Powered by Google Vertex AI</span>
            <span>•</span>
            <span>Built for CBC</span>
            <span>•</span>
            <span> By Crispin Oigara </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Internal Landing Page Component
const LandingPage: React.FC<{ onSelect: (s: UserSegment) => void }> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow p-6 bg-gradient-to-b from-brand-primary-light/50 to-white">
      <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
        <h1 className="text-5xl font-extrabold text-brand-dark mb-6 tracking-tight">
          Shape Your Future with <span className="text-brand-primary">Confidence</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          CRISP helps African learners discover their strengths, navigate CBC pathways, and find the perfect STEM career. 
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Card 1: Kids - GOLD Theme */}
        <div 
          onClick={() => onSelect(UserSegment.KIDS)}
          className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-transparent hover:border-brand-secondary flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <User size={40} className="text-brand-secondary" />
          </div>
          <h3 className="text-2xl font-bold text-brand-dark mb-3 font-kids">CRISP Kids</h3>
          <p className="text-brand-secondary font-bold text-sm mb-6 tracking-wide uppercase">Grades 1-6</p>
          <p className="text-gray-600 text-sm">Discover interests through fun, home-based STEM activities.</p>
        </div>

        {/* Card 2: Pathways - TEAL Theme */}
        <div 
          onClick={() => onSelect(UserSegment.PATHWAYS)}
          className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-transparent hover:border-brand-primary flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-brand-accent rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <LayoutGrid size={40} className="text-brand-primary" />
          </div>
          <h3 className="text-2xl font-bold text-brand-dark mb-3">JSS Pathways</h3>
          <p className="text-brand-primary font-bold text-sm mb-6 tracking-wide uppercase">Grades 7-9</p>
          <p className="text-gray-600 text-sm">Match your strengths to the right CBC pathway (STEM, Arts, Social Sciences).</p>
        </div>

        {/* Card 3: Career - CHARCOAL/DARK Theme */}
        <div 
          onClick={() => onSelect(UserSegment.CAREER)}
          className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all cursor-pointer border-2 border-transparent hover:border-brand-dark flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <GraduationCap size={40} className="text-brand-dark" />
          </div>
          <h3 className="text-2xl font-bold text-brand-dark mb-3">Career Planner</h3>
          <p className="text-brand-dark font-bold text-sm mb-6 tracking-wide uppercase">Grades 10-12</p>
          <p className="text-gray-600 text-sm">Explore future-ready careers, TVET options, and scholarship opportunities.</p>
        </div>
      </div>
    </div>
  );
};

export default App;