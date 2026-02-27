import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { studyData } from '../data/mockData';
import { BookOpen, CheckCircle, ChevronRight, FileText } from 'lucide-react';
import { motion } from 'motion/react';

export default function Chapters() {
  const { classId, subjectId } = useParams<{ classId: string; subjectId: string }>();
  
  const classData = studyData.find(c => c.id === classId);
  const subjectData = classData?.subjects.find(s => s.id === subjectId);

  if (!classData || !subjectData) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-slate-500 mb-6 overflow-x-auto whitespace-nowrap pb-2">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight size={16} className="mx-2 min-w-[16px]" />
        <Link to={`/class/${classId}`} className="hover:text-blue-600">{classData.name}</Link>
        <ChevronRight size={16} className="mx-2 min-w-[16px]" />
        <span className="font-semibold text-slate-900">{subjectData.name}</span>
      </nav>

      <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
        <h2 className="text-2xl font-bold mb-2">{subjectData.name}</h2>
        <p className="text-blue-100 opacity-90">
          {classData.name} • {subjectData.chapters.length} Chapters available
        </p>
      </div>

      <div className="space-y-4">
        {subjectData.chapters.map((chapter, index) => (
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-slate-100 shadow-sm p-5"
          >
            <h3 className="font-bold text-lg text-slate-800 mb-4">{chapter.title}</h3>
            
            <div className="flex flex-wrap gap-3">
              {/* View Book Button - Available for all */}
              <Link
                to={`/view/${chapter.content.find(c => c.type === 'book')?.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
              >
                <BookOpen size={16} />
                View Book
              </Link>

              {/* View Solution - Available for Class 6+ */}
              {classData.hasSolutions && (
                <Link
                  to={`/view/${chapter.content.find(c => c.type === 'solution')?.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
                >
                  <CheckCircle size={16} />
                  View Solution
                </Link>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
