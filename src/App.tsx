/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Layout from './components/Layout';
import Home from './pages/Home';
import Subjects from './pages/Subjects';
import SubjectDetails from './pages/SubjectDetails';
import BookViewer from './pages/BookViewer';
import SolutionViewer from './pages/SolutionViewer';
import SamplePapers from './pages/SamplePapers';
import PdfViewer from './pages/PdfViewer';

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/class/:classId" element={<Layout><Subjects /></Layout>} />
          
          {/* New SEO Friendly Routes */}
          <Route path="/class/:classId/subject/:subjectId" element={<Layout><SubjectDetails /></Layout>} />
          <Route path="/class/:classId/:subjectId/book" element={<BookViewer />} />
          <Route path="/class/:classId/:subjectId/solution/:chapterId" element={<SolutionViewer />} />
          
          <Route path="/class/:classId/sample-papers" element={<Layout><SamplePapers /></Layout>} />
          
          {/* Legacy/Fallback Route */}
          <Route path="/view/:contentId" element={<PdfViewer />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
