import React, { useState } from 'react';
import { generateCareerGuidance, findMentors } from '../services/gemini';
import { CareerPath, LoadingState, Mentor } from '../types';
import { Briefcase, GraduationCap, Hammer, Loader2, MapPin, BookOpen, Users, MessageCircle, CheckCircle2, Building2, Leaf, Cpu, Zap } from 'lucide-react';

export const CareerPlanner: React.FC = () => {
  const [tab, setTab] = useState<'plan' | 'mentor'>('plan');
  
  // Career State
  const [subjects, setSubjects] = useState('');
  const [hobbies, setHobbies] = useState('');
  const [careers, setCareers] = useState<CareerPath[]>([]);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);

  // Mentor State
  const [mentorInterest, setMentorInterest] = useState('');
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [mentorStatus, setMentorStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [requestedMentors, setRequestedMentors] = useState<string[]>([]);

  const handlePlan = async () => {
    if (!subjects || !hobbies) return;
    setStatus(LoadingState.LOADING);
    try {
      const result = await generateCareerGuidance(subjects, hobbies);
      setCareers(result);
      setStatus(LoadingState.SUCCESS);
    } catch (e) {
      setStatus(LoadingState.ERROR);
    }
  };

  const handleFindMentors = async () => {
    if (!mentorInterest) return;
    setMentorStatus(LoadingState.LOADING);
    try {
      const result = await findMentors(mentorInterest);
      setMentors(result);
      setMentorStatus(LoadingState.SUCCESS);
    } catch (e) {
      setMentorStatus(LoadingState.ERROR);
    }
  };

  const toggleRequest = (id: string) => {
    if (requestedMentors.includes(id)) return;
    setRequestedMentors([...requestedMentors, id]);
  };

  const getCategoryStyle = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('green') || lower.includes('conservation') || lower.includes('agri') || lower.includes('sustain')) {
      return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-100', icon: <Leaf size={14} /> };
    }
    if (lower.includes('tech') || lower.includes('data') || lower.includes('ai') || lower.includes('robotics') || lower.includes('cyber')) {
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100', icon: <Cpu size={14} /> };
    }
    if (lower.includes('health') || lower.includes('medical')) {
      return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100', icon: <Zap size={14} /> };
    }
    return { bg: 'bg-brand-off-white', text: 'text-gray-700', border: 'border-gray-200', icon: <Briefcase size={14} /> };
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
       <div className="bg-brand-dark text-white p-8 rounded-2xl mb-8 shadow-xl relative overflow-hidden">
         <div className="relative z-10">
           <h2 className="text-3xl font-bold mb-2">Future Career Planner</h2>
           <p className="text-gray-300 max-w-2xl">
             Grade 10-12 is critical. We help you match your subject combinations to careers and connect you with real mentors.
           </p>
         </div>
         <div className="absolute right-0 top-0 opacity-5 transform translate-x-10 -translate-y-10">
           <Briefcase size={200} />
         </div>
       </div>

       <div className="flex gap-6 mb-8 border-b border-gray-200 pb-1">
          <button 
            onClick={() => setTab('plan')}
            className={`pb-3 px-4 font-semibold text-lg transition-colors ${tab === 'plan' ? 'text-brand-cta border-b-4 border-brand-cta' : 'text-gray-400 hover:text-brand-dark'}`}
          >
            Career Guidance
          </button>
          <button 
            onClick={() => setTab('mentor')}
            className={`pb-3 px-4 font-semibold text-lg transition-colors ${tab === 'mentor' ? 'text-brand-cta border-b-4 border-brand-cta' : 'text-gray-400 hover:text-brand-dark'}`}
          >
            Virtual Mentorship
          </button>
       </div>

       {tab === 'plan' ? (
         <>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                 <label className="block text-sm font-semibold text-brand-dark mb-2">Subject Combination</label>
                 <input 
                    type="text"
                    className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    placeholder="e.g. Math, Physics, Geography"
                    value={subjects}
                    onChange={(e) => setSubjects(e.target.value)}
                 />
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                 <label className="block text-sm font-semibold text-brand-dark mb-2">Passions & Hobbies</label>
                 <input 
                    type="text"
                    className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    placeholder="e.g. Coding, Environmental conservation"
                    value={hobbies}
                    onChange={(e) => setHobbies(e.target.value)}
                 />
              </div>
              <div className="flex items-end">
                <button 
                  onClick={handlePlan}
                  disabled={status === LoadingState.LOADING}
                  className="w-full bg-brand-cta hover:bg-brand-primary-hover text-white font-bold py-4 px-6 rounded-xl transition-all flex flex-col justify-center items-center gap-1 shadow-md text-center"
                >
                  {status === LoadingState.LOADING ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <span>Generate Future-Ready Career Plan</span>
                      <span className="text-[10px] opacity-80 font-normal uppercase tracking-wide">
                        (Includes Green Economy & Tech)
                      </span>
                    </>
                  )}
                </button>
              </div>
           </div>

           {status === LoadingState.SUCCESS && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {careers.map((career, idx) => {
                  const style = getCategoryStyle(career.category);
                  return (
                    <div key={idx} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full border-t-4 border-brand-cta relative overflow-hidden group">
                       <div className="p-6 flex-grow">
                          <div className="flex flex-col gap-2 mb-4">
                             <div className="flex justify-between items-start">
                               <h3 className="text-xl font-bold text-brand-dark leading-tight">{career.title}</h3>
                               {/* Category Badge */}
                               <span className={`flex-shrink-0 px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border ${style.bg} ${style.text} ${style.border}`}>
                                  {style.icon} {career.category}
                               </span>
                             </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-6 line-clamp-3">{career.description}</p>
                          
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                                <BookOpen size={12}/> Essential Subjects
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {career.requiredSubjects.map(sub => (
                                  <span key={sub} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                    {sub}
                                  </span>
                                ))}
                              </div>
                            </div>
  
                            <div className="grid grid-cols-1 gap-3">
                              {/* University Degrees Section */}
                              <div className="bg-brand-sky/10 p-3 rounded-lg border border-brand-sky/20">
                                <h4 className="text-xs font-bold text-blue-700 uppercase mb-1 flex items-center gap-1">
                                  <GraduationCap size={12}/> University Degrees
                                </h4>
                                {career.universityPrograms && career.universityPrograms.length > 0 ? (
                                  <ul className="text-xs text-gray-700 list-disc list-inside">
                                    {career.universityPrograms.slice(0, 3).map(opt => (
                                      <li key={opt} className="truncate" title={opt}>{opt}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-gray-500 italic">None specified</p>
                                )}
                              </div>
  
                              {/* TVET Options Section */}
                              <div className="bg-brand-secondary/10 p-3 rounded-lg border border-brand-secondary/20">
                                <h4 className="text-xs font-bold text-yellow-700 uppercase mb-1 flex items-center gap-1">
                                   <Hammer size={12}/> TVET / Diplomas
                                </h4>
                                {career.tvetOptions && career.tvetOptions.length > 0 ? (
                                  <ul className="text-xs text-gray-700 list-disc list-inside">
                                     {career.tvetOptions.slice(0, 3).map(opt => (
                                       <li key={opt} className="truncate" title={opt}>{opt}</li>
                                     ))}
                                  </ul>
                                ) : (
                                  <p className="text-xs text-gray-500 italic">None specified</p>
                                )}
                              </div>
                            </div>
                          </div>
                       </div>
                       <div className="bg-brand-off-white p-4 rounded-b-xl border-t border-gray-100">
                          <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Potential Job Roles</h4>
                          <div className="flex flex-wrap gap-2">
                             {career.potentialJobs.slice(0,3).map(job => (
                               <span key={job} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded shadow-sm text-gray-600">
                                 {job}
                               </span>
                             ))}
                          </div>
                       </div>
                    </div>
                  );
                })}
             </div>
           )}
         </>
       ) : (
         // MENTORSHIP UI
         <div className="animate-fade-in">
           <div className="flex flex-col md:flex-row gap-6 items-end mb-8">
             <div className="flex-grow w-full">
                <label className="block text-sm font-semibold text-brand-dark mb-2">Find a Mentor in...</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary"
                    placeholder="e.g. Data Science, Civil Engineering, Medicine"
                    value={mentorInterest}
                    onChange={(e) => setMentorInterest(e.target.value)}
                  />
                </div>
             </div>
             <button 
               onClick={handleFindMentors}
               disabled={mentorStatus === LoadingState.LOADING || !mentorInterest}
               className="w-full md:w-auto px-8 py-3 bg-brand-dark hover:bg-gray-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md transition-all"
             >
               {mentorStatus === LoadingState.LOADING ? <Loader2 className="animate-spin"/> : <><Users size={20}/> Find Mentors</>}
             </button>
           </div>

           {mentorStatus === LoadingState.SUCCESS && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mentors.map((mentor) => {
                  const isRequested = requestedMentors.includes(mentor.id);
                  return (
                    <div key={mentor.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col sm:flex-row gap-6 hover:shadow-lg transition-shadow">
                       <div className="flex-shrink-0">
                         <div className="w-20 h-20 bg-brand-accent rounded-full flex items-center justify-center text-2xl font-bold text-brand-cta">
                           {mentor.name.charAt(0)}
                         </div>
                       </div>
                       <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold text-brand-dark">{mentor.name}</h3>
                              <p className="text-brand-primary font-medium">{mentor.role}</p>
                              <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                                <Building2 size={12}/> {mentor.company}
                              </p>
                              <p className="text-gray-500 text-sm flex items-center gap-1">
                                <MapPin size={12}/> {mentor.location}
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 text-sm mt-3 italic">"{mentor.bio}"</p>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            {mentor.expertise.map(skill => (
                              <span key={skill} className="px-2 py-1 bg-brand-off-white text-gray-600 text-xs rounded-full font-medium border border-gray-100">
                                {skill}
                              </span>
                            ))}
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <button 
                              onClick={() => toggleRequest(mentor.id)}
                              disabled={isRequested}
                              className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                                isRequested 
                                  ? 'bg-brand-accent text-green-800 cursor-default' 
                                  : 'bg-brand-cta text-white hover:bg-brand-primary-hover'
                              }`}
                            >
                              {isRequested ? (
                                <><CheckCircle2 size={16}/> Session Request Sent</>
                              ) : (
                                <><MessageCircle size={16}/> Request Virtual Session</>
                              )}
                            </button>
                          </div>
                       </div>
                    </div>
                  );
                })}
             </div>
           )}
           
           {mentorStatus === LoadingState.IDLE && (
             <div className="text-center py-12 text-gray-300 bg-brand-off-white rounded-xl border-2 border-dashed border-gray-200">
               <Users size={48} className="mx-auto mb-3 opacity-30"/>
               <p>Enter your career interest to find tailored mentors.</p>
             </div>
           )}
         </div>
       )}
    </div>
  );
};