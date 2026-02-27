import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { studyData, samplePapers } from '../data/mockData';
import { ChevronRight, FileText, Download } from 'lucide-react';
import { motion } from 'motion/react';

export default function SamplePapers() {
  const { classId } = useParams<{ classId: string }>();
  
  // Security check - only for class 10
  if (classId !== '10') {
    return <Navigate to={`/class/${classId}`} replace />;
  }

  const classData = studyData.find(c => c.id === classId);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <ChevronRight size={16} className="mx-2" />
        <Link to={`/class/${classId}`} className="hover:text-blue-600">{classData?.name}</Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="font-semibold text-slate-900">Sample Papers</span>
      </nav>

      <div className="bg-orange-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-200">
        <h2 className="text-2xl font-bold mb-2">Sample Papers & Resources</h2>
        <p className="text-orange-100 opacity-90">
          Prepare for your board exams with these resources
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {samplePapers.map((paper, index) => (
          <motion.div
            key={paper.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                <FileText size={20} />
              </div>
              <span className="font-medium text-slate-800">{paper.title}</span>
            </div>
            
            <Link
              to={`/view/${paper.id}`}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            >
              <Download size={20} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
