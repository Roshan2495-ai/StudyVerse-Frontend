import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, AlertCircle, FileText, Printer, Share2, ZoomIn, ZoomOut } from 'lucide-react';
import SEO from '../components/SEO';
import AdPlaceholder from '../components/AdPlaceholder';
import { studyData } from '../data/mockData';

export default function BookViewer() {
  const { classId, subjectId } = useParams<{ classId: string; subjectId: string }>();
  const navigate = useNavigate();

  const classData = studyData.find(c => c.id === classId);
  const subjectData = classData?.subjects.find(s => s.id === subjectId);

  if (!classData || !subjectData) {
    return <div className="p-8 text-center">Book not found</div>;
  }

  const handleBack = () => {
    navigate(`/class/${classId}/subject/${subjectId}`);
  };

  return (
    <>
      <SEO 
        title={`Class ${classId} ${subjectData.name} Book PDF – BSE Odisha`}
        description={`Download and read Class ${classId} ${subjectData.name} textbook PDF for BSE Odisha students. Free full book PDF.`}
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
                {subjectData.name} - Class {classId}
              </span>
              <span className="text-xs text-slate-400">Complete Book PDF</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors text-sm font-medium">
              <Download size={16} />
              <span className="hidden sm:inline">Download Book</span>
            </button>
          </div>
        </div>

        {/* Ad Space */}
        <div className="bg-slate-100 p-2 text-center hidden md:block">
           <div className="text-xs text-slate-400 mb-1">Advertisement</div>
           <div className="w-[728px] h-[90px] bg-slate-200 mx-auto border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
             728x90 Ad Banner
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow bg-slate-200 relative">
          <iframe
            src="https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf&embedded=true"
            className="w-full h-full border-0"
            title="PDF Viewer"
            allowFullScreen
          />
        </div>
      </div>
    </>
  );
}
