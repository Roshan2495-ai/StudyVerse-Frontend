import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { fetchClassById } from '../services/api';
import { Book, ChevronRight, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import SEO from '../components/SEO';
import AdPlaceholder from '../components/AdPlaceholder';

export default function Subjects() {
  const { classId } = useParams<{ classId: string }>();
  const [classData, setClassData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (classId) {
        const data = await fetchClassById(classId);
        setClassData(data);
      }
      setLoading(false);
    };
    loadData();
  }, [classId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  if (!classData) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-8">
      <SEO 
        title={`Class ${classId} Books & Solutions – BSE Odisha`}
        description={`Download Class ${classId} Odia Medium Textbooks, Solutions, and Syllabus. Free PDF download for all subjects.`}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="font-semibold text-slate-900">{classData.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-bold text-slate-900">Subjects</h2>
           <p className="text-slate-500 mt-1">Select a subject to view books and solutions</p>
        </div>
        
        {classData.hasSamplePapers && (
          <Link 
            to={`/class/${classId}/sample-papers`}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:shadow-lg hover:shadow-orange-200 transition-all font-bold text-sm"
          >
            <FileText size={18} className="mr-2" />
            Sample Papers
          </Link>
        )}
      </div>

      {/* Ad Space */}
      <AdPlaceholder type="banner" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classData.subjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link 
              to={`/class/${classId}/subject/${subject.id}`}
              className="group flex items-center p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 h-full"
            >
              <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mr-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Book size={28} />
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">{subject.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{subject.chapters.length} Chapters</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" size={20} />
            </Link>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12">
        <AdPlaceholder type="rectangle" className="mx-auto" />
      </div>
    </div>
  );
}
