import React, { useEffect, useState } from 'react';
import { fetchClasses } from '../../services/api';
import { Users, Book, FileText, Activity } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    classes: 0,
    subjects: 0,
    chapters: 0,
    files: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      const classes = await fetchClasses();
      let subjectCount = 0;
      let chapterCount = 0;
      
      // Calculate basic stats from available data
      // Note: This is a rough count based on what we fetch
      classes.forEach((c: any) => {
        if (c.subjects) {
          subjectCount += c.subjects.length;
          c.subjects.forEach((s: any) => {
             if (s.chapters) chapterCount += s.chapters.length;
          });
        }
      });

      setStats({
        classes: classes.length,
        subjects: subjectCount,
        chapters: chapterCount,
        files: 0 // We'd need a specific API to count total files efficiently
      });
    };
    loadStats();
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
      <p className="text-slate-500 text-sm">{label}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500">Welcome back, Admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Classes" value={stats.classes} color="bg-blue-500" />
        <StatCard icon={Book} label="Total Subjects" value={stats.subjects} color="bg-orange-500" />
        <StatCard icon={FileText} label="Total Chapters" value={stats.chapters} color="bg-green-500" />
        <StatCard icon={Activity} label="Active Users" value="1.2k" color="bg-purple-500" />
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
            <Book size={20} /> Add New Subject
          </button>
          <button className="p-4 border border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
            <FileText size={20} /> Upload PDF
          </button>
        </div>
      </div>
    </div>
  );
}
