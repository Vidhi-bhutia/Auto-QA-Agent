import React, { useCallback } from 'react';
import { UploadedFile } from '../types';
import { DEMO_HTML, DEMO_DOC_SPECS, DEMO_DOC_UI } from '../constants';

interface IngestionProps {
  files: UploadedFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
  onNext: () => void;
}

export const Ingestion: React.FC<IngestionProps> = ({ files, setFiles, onNext }) => {
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'html' | 'doc') => {
    if (e.target.files) {
      Array.from(e.target.files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setFiles(prev => [
              ...prev,
              {
                id: Math.random().toString(36).substring(7),
                name: file.name,
                content: event.target.result as string,
                type
              }
            ]);
          }
        };
        reader.readAsText(file);
      });
    }
  };

  const loadDemoData = () => {
    setFiles([
      { id: 'demo-html', name: 'checkout.html', content: DEMO_HTML, type: 'html' },
      { id: 'demo-specs', name: 'product_specs.md', content: DEMO_DOC_SPECS, type: 'doc' },
      { id: 'demo-ui', name: 'ui_ux_guide.txt', content: DEMO_DOC_UI, type: 'doc' },
    ]);
  };

  const htmlFiles = files.filter(f => f.type === 'html');
  const docFiles = files.filter(f => f.type === 'doc');
  const canProceed = htmlFiles.length > 0 && docFiles.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-3">Build Knowledge Base</h2>
        <p className="text-slate-600">Upload your project assets to create the "Testing Brain".</p>
        <button 
          onClick={loadDemoData}
          className="mt-4 text-sm text-indigo-600 font-medium hover:text-indigo-800 underline"
        >
          Load Demo Data (Quick Start)
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* HTML Upload */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-slate-800">Target HTML</h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Required</span>
          </div>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50">
            <input
              type="file"
              id="html-upload"
              accept=".html,.htm"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'html')}
            />
            <label htmlFor="html-upload" className="cursor-pointer flex flex-col items-center">
              <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 2H7a2 2 0 00-2 2v15a2 2 0 002 2z" /></svg>
              <span className="text-indigo-600 hover:underline font-medium">Upload HTML</span>
            </label>
          </div>
          <ul className="mt-4 space-y-2">
            {htmlFiles.map(f => (
              <li key={f.id} className="flex items-center text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                <svg className="w-4 h-4 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                {f.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Docs Upload */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-slate-800">Support Docs</h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Markdown, Txt, JSON</span>
          </div>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50">
            <input
              type="file"
              id="doc-upload"
              accept=".md,.txt,.json"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'doc')}
            />
            <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center">
              <svg className="w-8 h-8 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              <span className="text-indigo-600 hover:underline font-medium">Upload Docs</span>
            </label>
          </div>
          <ul className="mt-4 space-y-2">
            {docFiles.map(f => (
              <li key={f.id} className="flex items-center text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                 <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                {f.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`
            px-8 py-3 rounded-full font-semibold shadow-lg transition-all transform
            ${canProceed 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105' 
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'}
          `}
        >
          {canProceed ? 'Process Knowledge Base →' : 'Upload Files to Continue'}
        </button>
      </div>
    </div>
  );
};