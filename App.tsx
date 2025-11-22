import React, { useState } from 'react';
import { Ingestion } from './components/Ingestion';
import { TestCaseGenerator } from './components/TestCaseGenerator';
import { ScriptGenerator } from './components/ScriptGenerator';
import { UploadedFile, TestCase, AppView } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.INGESTION);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(null);

  const handleSelectTestCase = (tc: TestCase) => {
    setSelectedTestCase(tc);
    setView(AppView.SCRIPT_GENERATION);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">AutoQA<span className="text-indigo-600">Agent</span></span>
            </div>
            
            <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
              {[
                { id: AppView.INGESTION, label: '1. Knowledge' },
                { id: AppView.TEST_GENERATION, label: '2. Plan' },
                { id: AppView.SCRIPT_GENERATION, label: '3. Code' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === AppView.INGESTION || (files.length > 0)) {
                      setView(tab.id);
                    }
                  }}
                  disabled={tab.id !== AppView.INGESTION && files.length === 0}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    view === tab.id 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  } ${tab.id !== AppView.INGESTION && files.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === AppView.INGESTION && (
          <Ingestion 
            files={files} 
            setFiles={setFiles} 
            onNext={() => setView(AppView.TEST_GENERATION)} 
          />
        )}

        {view === AppView.TEST_GENERATION && (
          <TestCaseGenerator 
            files={files}
            testCases={testCases}
            setTestCases={setTestCases}
            onSelectTestCase={handleSelectTestCase}
          />
        )}

        {view === AppView.SCRIPT_GENERATION && selectedTestCase && (
          <ScriptGenerator 
            testCase={selectedTestCase}
            files={files}
            onBack={() => setView(AppView.TEST_GENERATION)}
          />
        )}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>Powered by Google Gemini 2.5 Flash • Autonomous QA Agent Demo</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
