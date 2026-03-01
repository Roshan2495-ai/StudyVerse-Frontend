import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { fetchClasses, fetchSubjects, fetchChapters } from '../../services/api';
import { Plus, Trash2, FileText, Link as LinkIcon, ChevronRight, FolderPlus, Upload, Globe, Settings } from 'lucide-react';

// We need to add these to the API service, but for now we'll define them here or assume they exist
// In a real app, move these to src/services/api.ts
const API_BASE_URL = 'https://studyverse-backend-8wgj.onrender.com/api';

const createContent = async (data: any) => {
  const res = await fetch(`${API_BASE_URL}/content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to save content. Ensure backend is deployed.');
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
  if (!res.ok) throw new Error('Failed to save chapter. Ensure backend is deployed.');
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
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [uploading, setUploading] = useState(false);
  const [cloudinaryConfig, setCloudinaryConfig] = useState({
    cloudName: localStorage.getItem('cloudinary_cloud_name') || '',
    uploadPreset: localStorage.getItem('cloudinary_preset') || ''
  });
  const [showConfig, setShowConfig] = useState(false);

  const { register: registerChapter, handleSubmit: handleChapterSubmit, reset: resetChapter } = useForm();
  const { register: registerContent, handleSubmit: handleContentSubmit, reset: resetContent, setValue } = useForm();

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

  const saveConfig = () => {
    localStorage.setItem('cloudinary_cloud_name', cloudinaryConfig.cloudName);
    localStorage.setItem('cloudinary_preset', cloudinaryConfig.uploadPreset);
    setShowConfig(false);
    alert('Configuration saved!');
  };

  const uploadToCloudinary = async (file: File) => {
    if (!cloudinaryConfig.cloudName || !cloudinaryConfig.uploadPreset) {
      alert('Please configure Cloudinary settings first (click the gear icon).');
      return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) return data.secure_url;
      throw new Error(data.error?.message || 'Upload failed');
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      alert('Upload failed. Check your Cloudinary configuration.');
      return null;
    }
  };

  const onAddChapter = async (data: any) => {
    if (!selectedSubject) return;
    try {
      await createChapter({ ...data, subject_id: selectedSubject });
      setIsAddingChapter(false);
      resetChapter();
      fetchChapters(selectedSubject).then(setChapters); // Refresh
    } catch (error) {
      alert('Error creating chapter. Has the backend been redeployed with the new API routes?');
    }
  };

  const onAddContent = async (data: any) => {
    if (!selectedChapter) return;
    
    let finalUrl = data.url;

    if (uploadMode === 'file') {
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput?.files?.[0]) {
        setUploading(true);
        const uploadedUrl = await uploadToCloudinary(fileInput.files[0]);
        setUploading(false);
        if (!uploadedUrl) return;
        finalUrl = uploadedUrl;
      } else {
        alert('Please select a file');
        return;
      }
    }

    try {
      await createContent({ ...data, url: finalUrl, chapter_id: selectedChapter });
      setIsAddingContent(false);
      resetContent();
      fetchChapters(selectedSubject).then(setChapters);
    } catch (error) {
      alert('Error saving content. Has the backend been redeployed?');
    }
  };

  const onDeleteContent = async (id: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      await deleteContent(id);
      fetchChapters(selectedSubject).then(setChapters);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Content Manager</h1>
          <p className="text-slate-500">Manage subjects, chapters, and upload PDFs</p>
        </div>
        <button 
          onClick={() => setShowConfig(!showConfig)}
          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
          title="Configure Upload Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Configuration Panel */}
      {showConfig && (
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-800">Cloudinary Configuration (For File Uploads)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Cloud Name</label>
              <input 
                value={cloudinaryConfig.cloudName}
                onChange={e => setCloudinaryConfig({...cloudinaryConfig, cloudName: e.target.value})}
                className="w-full p-2 rounded border border-slate-300"
                placeholder="e.g., dxy..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Upload Preset (Unsigned)</label>
              <input 
                value={cloudinaryConfig.uploadPreset}
                onChange={e => setCloudinaryConfig({...cloudinaryConfig, uploadPreset: e.target.value})}
                className="w-full p-2 rounded border border-slate-300"
                placeholder="e.g., ml_default"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={saveConfig} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm">Save Settings</button>
          </div>
          <p className="text-xs text-slate-400">
            1. Sign up at <a href="https://cloudinary.com" target="_blank" className="underline">cloudinary.com</a><br/>
            2. Go to Settings {'>'} Upload {'>'} Add upload preset (Mode: Unsigned)<br/>
            3. Copy Cloud Name and Preset here.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select 
          className="p-3 rounded-xl border border-slate-200 bg-white"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">Select Class</option>
          {Array.isArray(classes) && classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
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

                      {/* Upload Mode Toggle */}
                      <div className="flex gap-4 border-b border-blue-200 pb-2">
                        <button 
                          type="button"
                          onClick={() => setUploadMode('url')}
                          className={`text-sm font-medium flex items-center gap-2 ${uploadMode === 'url' ? 'text-blue-600' : 'text-slate-400'}`}
                        >
                          <Globe size={16} /> External URL
                        </button>
                        <button 
                          type="button"
                          onClick={() => setUploadMode('file')}
                          className={`text-sm font-medium flex items-center gap-2 ${uploadMode === 'file' ? 'text-blue-600' : 'text-slate-400'}`}
                        >
                          <Upload size={16} /> Upload File
                        </button>
                      </div>

                      {uploadMode === 'url' ? (
                        <input 
                          {...registerContent('url', { required: uploadMode === 'url' })}
                          placeholder="PDF URL (e.g., https://drive.google.com/...)"
                          className="p-2 rounded-lg border border-blue-200 w-full"
                        />
                      ) : (
                        <div className="space-y-2">
                          <input 
                            type="file"
                            id="file-upload"
                            accept=".pdf"
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                          />
                          {!cloudinaryConfig.cloudName && (
                            <p className="text-xs text-red-500">
                              * Please configure Cloudinary settings (Gear Icon) to enable uploads.
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => setIsAddingContent(false)} className="px-3 py-1.5 text-sm text-blue-600">Cancel</button>
                        <button 
                          type="submit" 
                          disabled={uploading}
                          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center gap-2"
                        >
                          {uploading ? 'Uploading...' : 'Add PDF'}
                        </button>
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
