import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, AlertCircle } from 'lucide-react';
import SEO from '../components/SEO';
import AdPlaceholder from '../components/AdPlaceholder';
import { studyData } from '../data/mockData';

export default function SolutionViewer() {
  const { classId, subjectId, chapterId } = useParams<{ classId: string; subjectId: string; chapterId: string }>();
  const navigate = useNavigate();

  const classData = studyData.find(c => c.id === classId);
  const subjectData = classData?.subjects.find(s => s.id === subjectId);
  // Mock finding chapter - in real app use ID
  const chapter = subjectData?.chapters.find(ch => ch.id === chapterId);

  if (!classData || !subjectData) {
    return <div className="p-8 text-center">Solution not found</div>;
  }

  const handleBack = () => {
    navigate(`/class/${classId}/subject/${subjectId}`);
  };

  return (
    <>
      <SEO 
        title={`Class ${classId} ${subjectData.name} ${chapter?.title || 'Chapter'} Solution – BSE Odisha`}
        description={`Get detailed solutions for Class ${classId} ${subjectData.name} ${chapter?.title}. Step by step answers for BSE Odisha students.`}
      />
      
      <div className="flex flex-col h-screen bg-slate-900">
        {/* Toolbar */}
        <div className="bg-slate-900 text-white p-3 flex items-center justify-between border-b border-slate-700 relative z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors"
              title="Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex flex-col">
              <span className="font-medium text-sm text-slate-200">
                {subjectData.name} - {chapter?.title}
              </span>
              <span className="text-xs text-orange-400">Solution</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-full transition-colors text-sm font-medium">
              <Download size={16} />
              <span className="hidden sm:inline">Download Solution</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow bg-slate-200 relative">
          {chapter ? (
            <iframe
              src="https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&embedded=true"
              className="w-full h-full border-0"
              title="PDF Viewer"
              allowFullScreen
            />
          ) : (
             <div className="flex items-center justify-center h-full flex-col p-8 text-center">
                <AlertCircle size={48} className="text-slate-400 mb-4" />
                <h2 className="text-xl font-bold text-slate-700">Solution Not Available</h2>
                <p className="text-slate-500 mt-2">Detailed Exercise Solutions Coming Soon.</p>
                <AdPlaceholder type="rectangle" className="mt-8" />
             </div>
          )}
        </div>
      </div>
    </>
  );
}
