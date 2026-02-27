import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Share2, ZoomIn, ZoomOut } from 'lucide-react';

export default function PdfViewer() {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();

  // In a real app, we would fetch the PDF URL based on contentId
  // For this demo, we'll just show a placeholder
  
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
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
          <span className="font-medium text-sm truncate max-w-[200px] text-slate-200">
            Document: {contentId}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-800 rounded-full transition-colors" title="Zoom Out">
            <ZoomOut size={18} />
          </button>
          <span className="text-xs bg-slate-800 px-3 py-1 rounded-full border border-slate-700">100%</span>
          <button className="p-2 hover:bg-slate-800 rounded-full transition-colors" title="Zoom In">
            <ZoomIn size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-800 rounded-full transition-colors hidden sm:block" title="Print">
            <Printer size={18} />
          </button>
          <button className="p-2 hover:bg-slate-800 rounded-full transition-colors hidden sm:block" title="Share">
            <Share2 size={18} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors text-sm font-medium">
            <Download size={16} />
            <span className="hidden sm:inline">Download</span>
          </button>
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
  );
}
