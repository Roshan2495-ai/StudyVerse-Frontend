import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchClasses, fetchSubjects, fetchChapters } from '../../services/api';
import { Plus, Trash2, FileText, Link as LinkIcon, ChevronRight, FolderPlus } from 'lucide-react';

// We need to add these to the API service, but for now we'll define them here or assume they exist
// In a real app, move these to src/services/api.ts
const API_BASE_URL = 'https://studyverse-backend-8wgj.onrender.com/api';

const createContent = async (data: any) => {
  const res = await fetch(`${API_BASE_URL}/content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

const deleteContent = async (id: string) => {
  await fetch(`${API_BASE_URL}/content/${id}`, { method: 'DELETE' });
};

const createChapter = async (data: any) => {
  const res = await fetch(`${API_BASE_URL}/chapters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export default function ContentManager() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [chapters, setChapters] = useState<any[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [isAddingContent, setIsAddingContent] = useState(false);

  const { register: registerChapter, handleSubmit: handleChapterSubmit, reset: resetChapter } = useForm();
  const { register: registerContent, handleSubmit: handleContentSubmit, reset: resetContent } = useForm();

  // Load Classes
  useEffect(() => {
    fetchClasses().then(setClasses);
  }, []);

  // Load Subjects when Class changes
  useEffect(() => {
    if (selectedClass) {
      fetchSubjects(selectedClass).then(setSubjects);
      setSelectedSubject('');
      setChapters([]);
    }
  }, [selectedClass]);

  // Load Chapters when Subject changes
  useEffect(() => {
    if (selectedSubject) {
      fetchChapters(selectedSubject).then(setChapters);
      setSelectedChapter('');
    }
  }, [selectedSubject]);

  const onAddChapter = async (data: any) => {
    if (!selectedSubject) return;
    await createChapter({ ...data, subject_id: selectedSubject });
    setIsAddingChapter(false);
    resetChapter();
    fetchChapters(selectedSubject).then(setChapters); // Refresh
  };

  const onAddContent = async (data: any) => {
    if (!selectedChapter) return;
    await createContent({ ...data, chapter_id: selectedChapter });
    setIsAddingContent(false);
    resetContent();
    // Refresh chapters to show new content (would be better to just fetch content for chapter)
    fetchChapters(selectedSubject).then(setChapters);
  };

  const onDeleteContent = async (id: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      await deleteContent(id);
      fetchChapters(selectedSubject).then(setChapters);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Content Manager</h1>
        <p className="text-slate-500">Manage subjects, chapters, and upload PDFs</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select 
          className="p-3 rounded-xl border border-slate-200 bg-white"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>

        <select 
          className="p-3 rounded-xl border border-slate-200 bg-white"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          disabled={!selectedClass}
        >
          <option value="">Select Subject</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {/* Content Area */}
      {selectedSubject && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-bold text-lg">Chapters</h2>
            <button 
              onClick={() => setIsAddingChapter(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-100"
            >
              <Plus size={16} /> Add Chapter
            </button>
          </div>

          {/* Add Chapter Form */}
          {isAddingChapter && (
            <form onSubmit={handleChapterSubmit(onAddChapter)} className="p-6 bg-slate-50 border-b border-slate-100">
              <div className="flex gap-4">
                <input 
                  {...registerChapter('title', { required: true })}
                  placeholder="Chapter Title (e.g., Chapter 1: Motion)"
                  className="flex-1 p-2 rounded-lg border border-slate-200"
                />
                <input 
                  {...registerChapter('order_index')}
                  type="number"
                  placeholder="Order"
                  className="w-24 p-2 rounded-lg border border-slate-200"
                />
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Save</button>
                <button type="button" onClick={() => setIsAddingChapter(false)} className="px-4 py-2 text-slate-500">Cancel</button>
              </div>
            </form>
          )}

          <div className="divide-y divide-slate-100">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <FolderPlus size={18} className="text-slate-400" />
                    {chapter.title}
                  </h3>
                  <button 
                    onClick={() => {
                      setSelectedChapter(chapter.id);
                      setIsAddingContent(true);
                    }}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} /> Add PDF
                  </button>
                </div>

                {/* Content List */}
                <div className="space-y-2 pl-6">
                  {chapter.content?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group">
                      <div className="flex items-center gap-3">
                        <FileText size={16} className={item.type === 'solution' ? 'text-green-500' : 'text-orange-500'} />
                        <span className="text-sm font-medium text-slate-700">{item.title}</span>
                        <span className="text-xs px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-500 uppercase">{item.type}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <a href={item.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-600">
                          <LinkIcon size={16} />
                        </a>
                        <button 
                          onClick={() => onDeleteContent(item.id)}
                          className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {(!chapter.content || chapter.content.length === 0) && (
                    <p className="text-xs text-slate-400 italic">No files uploaded yet.</p>
                  )}
                </div>

                {/* Add Content Form (Inline) */}
                {isAddingContent && selectedChapter === chapter.id && (
                  <div className="mt-4 pl-6">
                    <form onSubmit={handleContentSubmit(onAddContent)} className="p-4 bg-blue-50 rounded-xl space-y-3">
                      <h4 className="text-sm font-bold text-blue-900">Add New PDF</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input 
                          {...registerContent('title', { required: true })}
                          placeholder="Title (e.g., Textbook PDF)"
                          className="p-2 rounded-lg border border-blue-200 w-full"
                        />
                        <select 
                          {...registerContent('type', { required: true })}
                          className="p-2 rounded-lg border border-blue-200 w-full"
                        >
                          <option value="book">Textbook</option>
                          <option value="solution">Solution</option>
                          <option value="paper">Sample Paper</option>
                        </select>
                      </div>
                      <input 
                        {...registerContent('url', { required: true })}
                        placeholder="PDF URL (e.g., https://drive.google.com/...)"
                        className="p-2 rounded-lg border border-blue-200 w-full"
                      />
                      <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => setIsAddingContent(false)} className="px-3 py-1.5 text-sm text-blue-600">Cancel</button>
                        <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold">Add PDF</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))}
            {chapters.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                No chapters found. Create one to get started.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
