import React, { useState } from 'react';
import { generatePathwayAdvice } from '../services/gemini';
import { PathwayRecommendation, LoadingState } from '../types';
import { Compass, CheckCircle2, Trophy, Loader2, ArrowRight } from 'lucide-react';

export const PathwaysGuide: React.FC = () => {
  const [interests, setInterests] = useState('');
  const [strengths, setStrengths] = useState('');
  const [recommendations, setRecommendations] = useState<PathwayRecommendation[]>([]);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);

  const handleAnalyze = async () => {
    if (!interests || !strengths) return;
    setStatus(LoadingState.LOADING);
    try {
      const result = await generatePathwayAdvice(interests, strengths);
      setRecommendations(result);
      setStatus(LoadingState.SUCCESS);
    } catch (e) {
      setStatus(LoadingState.ERROR);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <div className="mb-8 border-b border-gray-200 pb-4">
        <h2 className="text-3xl font-bold text-brand-dark flex items-center gap-3">
          <Compass className="text-brand-primary" size={32} />
          JSS Pathway Navigator
        </h2>
        <p className="text-gray-600 mt-2">
          Junior Secondary (Grade 7-9) is the time to explore your specific <strong>CBC Career Tracks</strong>. Let AI guide you to the right specialization (e.g., STEM Engineering, Visual Arts, or Social Sciences).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-brand-dark mb-2">My Hobbies & Interests</label>
            <textarea
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent min-h-[100px] bg-brand-off-white"
              placeholder="e.g. Playing football, solving puzzles, reading history books..."
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <label className="block text-sm font-medium text-brand-dark mb-2">My Strongest Subjects</label>
            <textarea
              className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-primary focus:border-transparent min-h-[100px] bg-brand-off-white"
              placeholder="e.g. Mathematics, Pre-Technical Studies, English..."
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={status === LoadingState.LOADING || !interests || !strengths}
            className="w-full py-3 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg font-semibold shadow-md transition-all flex items-center justify-center gap-2"
          >
            {status === LoadingState.LOADING ? <Loader2 className="animate-spin" /> : 'Analyze My Pathway'}
          </button>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-8">
          {status === LoadingState.IDLE && (
            <div className="h-full flex flex-col items-center justify-center text-gray-300 p-12 border-2 border-dashed border-gray-200 rounded-xl">
              <Compass size={64} className="mb-4 opacity-20" />
              <p>Enter your details to discover your path.</p>
            </div>
          )}

          {status === LoadingState.SUCCESS && (
            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-brand-primary hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-brand-dark">{rec.pathwayName}</h3>
                        <div className="mt-1 flex items-center gap-2">
                           <span className="text-sm font-medium text-gray-400">Fit Score:</span>
                           <div className="h-3 w-32 bg-gray-100 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-brand-primary" 
                                style={{ width: `${rec.fitScore}%` }}
                             ></div>
                           </div>
                           <span className="text-sm font-bold text-brand-primary">{rec.fitScore}%</span>
                        </div>
                      </div>
                      <div className="bg-brand-mint p-2 rounded-lg">
                         <Trophy className="text-brand-primary-hover" size={24} />
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4 bg-brand-off-white p-4 rounded-lg text-sm leading-relaxed border border-gray-100">
                      {rec.reasoning}
                    </p>

                    <div>
                      <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Recommended School Clubs</h4>
                      <div className="flex flex-wrap gap-2">
                        {rec.recommendedClubs.map((club, i) => (
                          <span key={i} className="px-3 py-1 bg-brand-sky/20 text-blue-800 text-sm rounded-full font-medium border border-brand-sky/30">
                            {club}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};