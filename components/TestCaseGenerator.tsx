import React, { useState } from 'react';
import { TestCase, UploadedFile } from '../types';
import { generateTestCases } from '../services/geminiService';

interface TestCaseGeneratorProps {
  files: UploadedFile[];
  testCases: TestCase[];
  setTestCases: React.Dispatch<React.SetStateAction<TestCase[]>>;
  onSelectTestCase: (tc: TestCase) => void;
}

export const TestCaseGenerator: React.FC<TestCaseGeneratorProps> = ({ 
  files, 
  testCases, 
  setTestCases, 
  onSelectTestCase 
}) => {
  const [prompt, setPrompt] = useState("Generate all positive and negative test cases for the discount code feature.");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const htmlFile = files.find(f => f.type === 'html') || null;
      const docFiles = files.filter(f => f.type === 'doc');
      
      const results = await generateTestCases(htmlFile, docFiles, prompt);
      setTestCases(results);
    } catch (err) {
      setError("Failed to generate test cases. Please check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Test Strategy Prompt</label>
        <div className="flex gap-3">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="Describe what you want to test..."
          />
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Analyzing...
              </>
            ) : 'Generate Tests'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="flex-1 overflow-auto">
        {testCases.length === 0 && !loading && (
           <div className="text-center text-slate-400 py-20 border-2 border-dashed border-slate-200 rounded-xl">
             <p>No test cases generated yet.</p>
           </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
          {testCases.map((tc) => (
            <div 
              key={tc.id} 
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition cursor-pointer group relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${tc.type === 'positive' ? 'bg-green-500' : 'bg-red-500'}`} />
              
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-mono text-slate-400">{tc.id}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tc.type === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {tc.type}
                </span>
              </div>
              
              <h3 className="font-semibold text-slate-800 mb-1">{tc.feature}</h3>
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{tc.scenario}</p>
              
              <div className="text-xs text-slate-500 mb-4 bg-slate-50 p-2 rounded">
                <strong>Expected:</strong> {tc.expectedResult}
              </div>

              <div className="flex justify-between items-center mt-auto">
                <span className="text-xs text-slate-400 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  {tc.groundedIn}
                </span>
                <button 
                  onClick={() => onSelectTestCase(tc)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 group-hover:translate-x-1 transition-transform flex items-center"
                >
                  Automate &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
