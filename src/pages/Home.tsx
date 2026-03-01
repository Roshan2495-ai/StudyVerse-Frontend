import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchClasses } from '../services/api';
import { GraduationCap, ArrowRight, BookOpen, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import AdPlaceholder from '../components/AdPlaceholder';

export default function Home() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchClasses();
      setClasses(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const scrollToClasses = () => {
    document.getElementById('classes-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="space-y-20 pb-20">
      <SEO 
        title="BSE Odisha Learning Platform – Free Books & Solutions"
        description="Studyverse is the #1 free learning platform for BSE Odisha students. Get Class 1 to 10 Textbooks, Solutions, and Sample Papers in Odia Medium."
      />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-10">
        {/* Background Shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              #1 Learning Platform for Odisha
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight">
              BSE Odisha <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
                Learning Platform
              </span>
            </h1>
            
            <p className="text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Access free textbooks, detailed solutions, and sample papers for Class 1 to 10. 
              Designed specifically for Odia medium students to excel in their studies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={scrollToClasses}
                className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold text-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Learning <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
               {/* Abstract Illustration */}
               <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
                  <path fill="#2563EB" d="M45.7,-76.3C58.9,-69.3,69.1,-55.6,76.3,-41.2C83.5,-26.8,87.7,-11.7,85.6,2.6C83.5,16.9,75.1,30.4,65.6,42.2C56.1,54,45.5,64.1,33.2,70.5C20.9,76.9,6.9,79.6,-6.2,78.3C-19.3,77,-31.5,71.7,-42.6,64.1C-53.7,56.5,-63.7,46.6,-70.8,34.8C-77.9,23,-82.1,9.3,-80.4,-3.6C-78.7,-16.5,-71.1,-28.6,-61.8,-38.7C-52.5,-48.8,-41.5,-56.9,-30.1,-65.1C-18.7,-73.3,-6.9,-81.6,6.2,-82.9C19.3,-84.2,32.5,-78.5,45.7,-76.3Z" transform="translate(100 100) scale(1.1)" opacity="0.1" />
                  <image href="https://cdn.jsdelivr.net/npm/lucide-static@0.344.0/icons/graduation-cap.svg" x="50" y="50" height="100" width="100" />
               </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Ad Below Hero */}
      <AdPlaceholder type="banner" />

      {/* Section Divider */}
      <div id="classes-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
          Choose Your Class
        </h2>
        <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Select your standard to access tailored study materials, solutions, and exam resources.
        </p>
      </div>

      {/* Classes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(classes) && classes.map((cls, index) => {
            const isHighSchool = parseInt(cls.id) >= 8;
            const isBoardExam = cls.id === '10';
            
            return (
              <React.Fragment key={cls.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Link 
                    to={`/class/${cls.id}`}
                    className="group block relative bg-white rounded-[24px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(37,99,235,0.1)] border-t-4 border-transparent hover:border-blue-500 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col overflow-hidden"
                  >
                    {/* Gradient Top Border Effect (simulated with before element if needed, but using border-t for simplicity) */}
                    
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold transition-colors duration-300 ${isBoardExam ? 'bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                        {cls.id}
                      </div>
                      {isBoardExam && (
                        <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                          Board Exam
                        </span>
                      )}
                    </div>

                    <h3 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {cls.name}
                    </h3>
                    
                    <div className="mt-auto space-y-3">
                      <div className="flex flex-wrap gap-2">
                         <span className="inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-600">
                           Book
                         </span>
                         {cls.hasSolutions && (
                           <span className="inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-orange-50 text-orange-600">
                             Solution
                           </span>
                         )}
                         {cls.hasSamplePapers && (
                           <span className="inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-purple-50 text-purple-600">
                             Sample Paper
                           </span>
                         )}
                      </div>
                      
                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-slate-400 group-hover:text-blue-500 transition-colors">
                        <span className="text-sm font-medium">{cls.subjects.length} Subjects</span>
                        <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
                
                {/* Ad between rows (insert after every 3rd item or specific logic) */}
                {(index + 1) % 3 === 0 && index !== classes.length - 1 && (
                  <div className="col-span-full flex justify-center py-8">
                    <AdPlaceholder type="banner" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
