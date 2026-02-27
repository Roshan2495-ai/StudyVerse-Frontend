import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { fetchClassById, fetchChapters } from '../services/api';
import { BookOpen, CheckCircle, ChevronRight, FileText, Book } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import AdPlaceholder from '../components/AdPlaceholder';

export default function SubjectDetails() {
  const { classId, subjectId } = useParams<{ classId: string; subjectId: string }>();
  const [classData, setClassData] = useState<any>(null);
  const [subjectData, setSubjectData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (classId && subjectId) {
        const cData = await fetchClassById(classId);
        setClassData(cData);
        
        if (cData) {
          // If using API, we might need to fetch chapters separately if not included in class data
          // For now, assuming hybrid/mock structure or that fetchClassById returns nested data
          // But let's try to fetch chapters specifically if we have an API
          const sData = cData.subjects.find((s: any) => s.id === subjectId);
          
          // If we are in "real API" mode, sData might not have chapters loaded yet
          // So let's fetch chapters
          const chapters = await fetchChapters(subjectId);
          
          setSubjectData({ ...sData, chapters: chapters || sData?.chapters || [] });
        }
      }
      setLoading(false);
    };
    loadData();
  }, [classId, subjectId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!classData || !subjectData) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <SEO 
        title={`Class ${classId} ${subjectData.name} Book & Solutions – BSE Odisha`}
        description={`Download Class ${classId} ${subjectData.name} Book PDF and Chapter-wise Solutions. Free study material for BSE Odisha.`}
      />

      <div className="space-y-8 pb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-slate-500 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <ChevronRight size={16} className="mx-2 min-w-[16px]" />
          <Link to={`/class/${classId}`} className="hover:text-blue-600">{classData.name}</Link>
          <ChevronRight size={16} className="mx-2 min-w-[16px]" />
          <span className="font-semibold text-slate-900">{subjectData.name}</span>
        </nav>

        {/* Ad Below Header */}
        <AdPlaceholder type="banner" />

        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{subjectData.name}</h1>
            <p className="text-blue-100 text-lg opacity-90">
              {classData.name} • BSE Odisha
            </p>
            
            <div className="mt-8">
              <Link 
                to={`/class/${classId}/${subjectId}/book`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg"
              >
                <BookOpen size={20} />
                Read Full Book PDF
              </Link>
            </div>
          </div>
          
          {/* Decorative Icon */}
          <div className="absolute -right-6 -bottom-6 opacity-10 rotate-12">
            <Book size={200} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content - Chapters */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Chapter Solutions</h2>
              <span className="text-sm text-slate-500">{subjectData.chapters.length} Chapters</span>
            </div>

            <div className="space-y-4">
              {subjectData.chapters.map((chapter, index) => (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={classData.hasSolutions ? `/class/${classId}/${subjectId}/solution/${chapter.id}` : '#'}
                    className={`block bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-300 group ${!classData.hasSolutions ? 'opacity-75 cursor-not-allowed' : 'hover:-translate-y-1'}`}
                    onClick={(e) => !classData.hasSolutions && e.preventDefault()}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {chapter.title}
                          </h3>
                          {!classData.hasSolutions && (
                            <span className="text-xs text-slate-400">Solution coming soon</span>
                          )}
                        </div>
                      </div>
                      {classData.hasSolutions && (
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          <ChevronRight size={18} />
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* In-feed Ad */}
            <AdPlaceholder type="rectangle" className="mx-auto my-8" />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4">Study Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link to={`/class/${classId}/${subjectId}/book`} className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors p-2 hover:bg-slate-50 rounded-lg">
                    <BookOpen size={18} />
                    <span className="text-sm font-medium">Full Textbook</span>
                  </Link>
                </li>
                {classData.hasSamplePapers && (
                  <li>
                    <Link to={`/class/${classId}/sample-papers`} className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors p-2 hover:bg-slate-50 rounded-lg">
                      <FileText size={18} />
                      <span className="text-sm font-medium">Sample Papers</span>
                    </Link>
                  </li>
                )}
              </ul>
              
              <div className="mt-6 pt-6 border-t border-slate-100">
                <AdPlaceholder type="rectangle" className="w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
