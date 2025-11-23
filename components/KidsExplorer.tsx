import React, { useState } from 'react';
import { generateKidActivity, generateQuest } from '../services/gemini';
import { Activity, Quest, LoadingState, Badge } from '../types';
import { Rocket, Star, BookOpen, Loader2, Sparkles, Trophy, Brain, FlaskConical, Languages } from 'lucide-react';

export const KidsExplorer: React.FC = () => {
  const [mode, setMode] = useState<'activity' | 'learn'>('activity');
  const [interest, setInterest] = useState('');
  const [activity, setActivity] = useState<Activity | null>(null);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  
  // Gamification State
  const [points, setPoints] = useState(120); // Start with some points for encouragement
  const [quest, setQuest] = useState<Quest | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [questResult, setQuestResult] = useState<'correct' | 'incorrect' | null>(null);
  const [badges, setBadges] = useState<Badge[]>([
    { id: '1', name: 'Explorer', icon: '🚀', description: 'Started the journey' }
  ]);
  
  // Mastery Tracking
  const [subjectMastery, setSubjectMastery] = useState<Record<string, number>>({
    Math: 0,
    Science: 0,
    English: 0
  });

  // Mock Leaderboard
  const leaderboard = [
    { name: "Simba", points: 450 },
    { name: "You", points: points },
    { name: "Amani", points: 380 },
    { name: "Kofi", points: 320 },
  ].sort((a, b) => b.points - a.points);

  const handleExplore = async () => {
    if (!interest.trim()) return;
    setStatus(LoadingState.LOADING);
    try {
      const result = await generateKidActivity(interest);
      setActivity(result);
      setStatus(LoadingState.SUCCESS);
    } catch (e) {
      setStatus(LoadingState.ERROR);
    }
  };

  const handleStartQuest = async (subject: string) => {
    setStatus(LoadingState.LOADING);
    setQuest(null);
    setQuestResult(null);
    setSelectedOption(null);
    try {
      const result = await generateQuest(subject);
      setQuest(result);
      setStatus(LoadingState.SUCCESS);
    } catch (e) {
      setStatus(LoadingState.ERROR);
    }
  };

  const handleAnswer = (index: number) => {
    if (questResult !== null || !quest) return;
    setSelectedOption(index);
    
    if (index === quest.correctIndex) {
      setQuestResult('correct');
      const newPoints = points + quest.points;
      setPoints(newPoints);
      
      // Determine subject key for mastery
      let subjectKey = '';
      if (quest.subject.toLowerCase().includes('math')) subjectKey = 'Math';
      else if (quest.subject.toLowerCase().includes('science')) subjectKey = 'Science';
      else if (quest.subject.toLowerCase().includes('english')) subjectKey = 'English';

      if (subjectKey) {
        const newCount = (subjectMastery[subjectKey] || 0) + 1;
        setSubjectMastery(prev => ({ ...prev, [subjectKey]: newCount }));
        
        const newBadges = [...badges];
        
        // Check for Brainiac (Points based)
        if (newPoints >= 200 && !badges.find(b => b.id === '2')) {
          newBadges.push({ id: '2', name: 'Brainiac', icon: '🧠', description: 'Reached 200 points' });
        }

        // Check for Subject Mastery Badges
        if (subjectKey === 'Math' && newCount === 3 && !badges.find(b => b.id === 'math-master')) {
          newBadges.push({ id: 'math-master', name: 'Math Master', icon: '🧮', description: 'Answered 3 Math questions correctly!' });
        }
        if (subjectKey === 'Science' && newCount === 3 && !badges.find(b => b.id === 'science-whiz')) {
          newBadges.push({ id: 'science-whiz', name: 'Science Whiz', icon: '🔬', description: 'Answered 3 Science questions correctly!' });
        }
        if (subjectKey === 'English' && newCount === 3 && !badges.find(b => b.id === 'word-wizard')) {
          newBadges.push({ id: 'word-wizard', name: 'Word Wizard', icon: '📚', description: 'Answered 3 English questions correctly!' });
        }

        setBadges(newBadges);
      }
      
    } else {
      setQuestResult('incorrect');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 font-kids">
      {/* Header / Top Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border-b-4 border-brand-secondary mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-brand-secondary text-white p-3 rounded-full shadow-sm">
            <Star fill="currentColor" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-bold uppercase">My Score</p>
            <p className="text-3xl font-bold text-brand-secondary">{points}</p>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 max-w-[50%]">
          {badges.map(b => (
            <div key={b.id} className="flex-shrink-0 w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-2xl border-2 border-brand-secondary cursor-help relative group" title={b.name}>
              {b.icon}
              <div className="absolute top-full mt-2 hidden group-hover:block bg-brand-dark text-white text-xs p-2 rounded w-32 text-center z-10 shadow-lg">
                <p className="font-bold">{b.name}</p>
                <p>{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-brand-secondary mb-2">CRISP Kids 🚀</h2>
        <div className="flex justify-center gap-4 mt-4">
          <button 
            onClick={() => setMode('activity')}
            className={`px-6 py-2 rounded-full font-bold text-lg transition-all ${mode === 'activity' ? 'bg-brand-secondary text-white shadow-md scale-105' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
          >
            Do Activity
          </button>
          <button 
            onClick={() => setMode('learn')}
            className={`px-6 py-2 rounded-full font-bold text-lg transition-all ${mode === 'learn' ? 'bg-brand-primary text-white shadow-md scale-105' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
          >
            Play & Learn
          </button>
        </div>
      </div>

      {mode === 'activity' ? (
        // Existing Activity Explorer
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border-4 border-brand-secondary/10">
          <div className="bg-brand-mint/20 p-8 text-center">
            <label className="block text-2xl text-brand-dark font-bold mb-4">
              What do you like?
            </label>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              {['Cars 🚗', 'Space 🪐', 'Animals 🦁', 'Drawing 🎨', 'Robots 🤖', 'Plants 🌱'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setInterest(tag)}
                  className={`px-4 py-2 rounded-full text-lg transition-all transform hover:scale-105 ${
                    interest === tag 
                      ? 'bg-brand-secondary text-white shadow-md rotate-1' 
                      : 'bg-white text-gray-600 border-2 border-gray-100 hover:border-brand-secondary'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            
            <div className="relative max-w-lg mx-auto">
              <input
                type="text"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                placeholder="Or type here (e.g. 'Cooking')"
                className="w-full px-6 py-4 text-xl rounded-full border-2 border-brand-secondary/30 focus:outline-none focus:ring-4 focus:ring-brand-secondary/20 text-brand-dark placeholder-gray-400"
              />
              <button
                onClick={handleExplore}
                disabled={status === LoadingState.LOADING || !interest}
                className="mt-4 w-full md:w-auto px-8 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xl rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto shadow-lg"
              >
                {status === LoadingState.LOADING ? (
                  <><Loader2 className="animate-spin" /> Magic Happening...</>
                ) : (
                  <><Sparkles /> Create Activity!</>
                )}
              </button>
            </div>
          </div>

          {status === LoadingState.SUCCESS && activity && (
            <div className="p-8 bg-gradient-to-b from-white to-brand-mint/10">
              <div className="border-dashed border-4 border-brand-secondary/30 rounded-2xl p-6 bg-white">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-3xl font-bold text-brand-dark">{activity.title}</h3>
                   <span className="bg-brand-sky/30 text-brand-dark px-4 py-1 rounded-full font-bold text-sm">
                     ⏱ {activity.duration}
                   </span>
                </div>
                
                <p className="text-xl text-gray-700 mb-6 leading-relaxed">
                  {activity.description}
                </p>

                <div className="bg-yellow-50 rounded-xl p-5 border border-brand-secondary/20">
                  <h4 className="text-lg font-bold text-brand-secondary mb-3 flex items-center gap-2">
                    <BookOpen size={24}/> What you need:
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {activity.materials.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700 text-lg">
                        <Star size={16} className="text-brand-secondary" fill="currentColor" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                 <p className="text-gray-400 italic">Ask a parent to help you start!</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        // New Learning Quests
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <button onClick={() => handleStartQuest('Math')} className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all relative overflow-hidden border border-blue-100">
                <Brain size={32} />
                <span className="font-bold">Math</span>
                <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all" style={{width: `${(subjectMastery['Math'] / 3) * 100}%`}}></div>
              </button>
              <button onClick={() => handleStartQuest('Science')} className="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all relative overflow-hidden border border-green-100">
                <FlaskConical size={32} />
                <span className="font-bold">Science</span>
                <div className="absolute bottom-0 left-0 h-1 bg-green-500 transition-all" style={{width: `${(subjectMastery['Science'] / 3) * 100}%`}}></div>
              </button>
              <button onClick={() => handleStartQuest('English')} className="bg-purple-50 hover:bg-purple-100 text-purple-700 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all relative overflow-hidden border border-purple-100">
                <Languages size={32} />
                <span className="font-bold">English</span>
                <div className="absolute bottom-0 left-0 h-1 bg-purple-500 transition-all" style={{width: `${(subjectMastery['English'] / 3) * 100}%`}}></div>
              </button>
            </div>

            <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-50 p-6 min-h-[300px] flex flex-col justify-center items-center text-center">
              {status === LoadingState.LOADING ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-brand-primary" size={48} />
                  <p className="text-xl text-gray-400">Thinking of a fun question...</p>
                </div>
              ) : quest ? (
                <div className="w-full animate-fade-in">
                   <span className="inline-block bg-brand-secondary/10 text-brand-secondary px-3 py-1 rounded-full text-sm font-bold mb-4">
                     {quest.subject} • {quest.points} Points
                   </span>
                   <h3 className="text-2xl font-bold text-brand-dark mb-8">{quest.question}</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl mx-auto">
                     {quest.options.map((opt, i) => (
                       <button 
                         key={i}
                         onClick={() => handleAnswer(i)}
                         disabled={questResult !== null}
                         className={`p-4 rounded-xl text-lg font-medium border-2 transition-all ${
                           selectedOption === i 
                             ? (questResult === 'correct' ? 'bg-brand-mint border-green-500 text-green-800' : questResult === 'incorrect' ? 'bg-red-50 border-red-500 text-red-800' : 'bg-brand-sky border-blue-500')
                             : 'bg-white border-gray-100 hover:border-brand-primary text-gray-600'
                         } ${quest.correctIndex === i && questResult !== null ? 'bg-brand-mint border-green-500 !text-green-800 ring-2 ring-green-300' : ''}`}
                       >
                         {opt}
                       </button>
                     ))}
                   </div>
                   
                   {questResult && (
                     <div className={`mt-8 p-4 rounded-xl ${questResult === 'correct' ? 'bg-brand-mint/50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                       <p className="text-lg font-bold mb-2">
                         {questResult === 'correct' ? '🎉 Awesome! You got it!' : '😅 Oops! Good try!'}
                       </p>
                       <p className="text-base">{quest.explanation}</p>
                       {questResult === 'correct' && (
                         <button onClick={() => handleStartQuest(quest.subject)} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-full font-bold hover:bg-green-700">
                           Next Question
                         </button>
                       )}
                       {questResult === 'incorrect' && (
                         <button onClick={() => handleStartQuest(quest.subject)} className="mt-4 bg-brand-primary text-white px-6 py-2 rounded-full font-bold hover:opacity-90">
                           Try Another
                         </button>
                       )}
                     </div>
                   )}
                </div>
              ) : (
                <div className="text-gray-300">
                  <Brain size={64} className="mx-auto mb-4 opacity-20" />
                  <p className="text-xl">Pick a subject above to start a quest!</p>
                </div>
              )}
            </div>
          </div>

          {/* Leaderboard Sidebar */}
          <div className="bg-white rounded-3xl shadow-lg border-2 border-gray-50 p-6 h-fit">
            <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
              <Trophy className="text-brand-secondary" /> Leaderboard
            </h3>
            <div className="space-y-3">
              {leaderboard.map((player, idx) => (
                <div key={idx} className={`flex justify-between items-center p-3 rounded-xl ${player.name === 'You' ? 'bg-brand-secondary/10 border border-brand-secondary' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`font-bold w-6 text-center ${idx === 0 ? 'text-brand-secondary' : 'text-gray-400'}`}>
                      {idx + 1}
                    </span>
                    <span className={`font-medium ${player.name === 'You' ? 'text-brand-dark font-bold' : 'text-gray-600'}`}>
                      {player.name}
                    </span>
                  </div>
                  <span className="font-bold text-brand-primary">{player.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};