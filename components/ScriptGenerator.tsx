import React, { useState, useEffect } from 'react';
import { TestCase, UploadedFile } from '../types';
import { generateSeleniumScript } from '../services/geminiService';

interface ScriptGeneratorProps {
  testCase: TestCase;
  files: UploadedFile[];
  onBack: () => void;
}

export const ScriptGenerator: React.FC<ScriptGeneratorProps> = ({ testCase, files, onBack }) => {
  const [script, setScript] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const generate = async () => {
      setLoading(true);
      try {
        const htmlFile = files.find(f => f.type === 'html');
        const docFiles = files.filter(f => f.type === 'doc');
        
        if (htmlFile) {
          const code = await generateSeleniumScript(testCase, htmlFile, docFiles);
          setScript(code);
        }
      } catch (error) {
        setScript("# Error generating script. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    if (testCase) {
      generate();
    }
  }, [testCase, files]);

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col animate-fade-in">
      <button 
        onClick={onBack}
        className="mb-4 text-sm text-slate-500 hover:text-slate-800 flex items-center"
      >
        &larr; Back to Test Cases
      </button>

      <div className="grid lg:grid-cols-3 gap-6 h-full overflow-hidden">
        {/* Info Panel */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 h-fit">
          <div className="mb-4 pb-4 border-b border-slate-100">
            <h2 className="font-bold text-xl text-slate-800">{testCase.id}</h2>
            <p className="text-slate-500 text-sm">{testCase.feature}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scenario</label>
              <p className="text-sm text-slate-700 mt-1">{testCase.scenario}</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Expected Result</label>
              <p className="text-sm text-slate-700 mt-1 bg-green-50 p-2 rounded border border-green-100">
                {testCase.expectedResult}
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Source Document</label>
              <p className="text-xs text-slate-500 mt-1 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                {testCase.groundedIn}
              </p>
            </div>
          </div>
        </div>

        {/* Code Editor Panel */}
        <div className="lg:col-span-2 bg-[#1e1e1e] rounded-xl shadow-lg flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-[#3e3e3e]">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-3 text-xs text-gray-400 font-mono">test_{testCase.id.toLowerCase().replace('-', '_')}.py</span>
            </div>
            <button 
              onClick={handleCopy}
              className="text-xs text-gray-300 hover:text-white bg-[#3e3e3e] hover:bg-[#4e4e4e] px-3 py-1 rounded transition"
            >
              Copy Code
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-4 relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <svg className="animate-spin mb-3 h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                <span className="font-mono text-sm">Generating Selenium Script...</span>
              </div>
            ) : (
              <pre className="font-mono text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                {script}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
