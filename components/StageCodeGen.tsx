import React, { useEffect, useState, useRef } from 'react';
import { FileCode, Lock } from 'lucide-react';

interface Props {
  onComplete: () => void;
  blueprint: string;
}

const MOCK_FILES = [
  'src/config/database.ts',
  'src/models/User.ts',
  'src/controllers/authController.ts',
  'src/routes/api.ts',
  'src/middleware/security.ts',
  'src/services/paymentService.ts',
];

const CODE_SNIPPETS = [
  `import { createPool } from 'pg';\nexport const pool = createPool({ connectionString: process.env.DATABASE_URL });`,
  `@Entity()\nexport class User extends BaseEntity {\n  @PrimaryGeneratedColumn()\n  id: number;\n\n  @Column({ unique: true })\n  email: string;\n}`,
  `export const login = async (req, res) => {\n  const { email, password } = req.body;\n  // Secure verification logic\n  const token = signToken(user);\n  res.json({ token });\n}`,
];

export const StageCodeGen: React.FC<Props> = ({ onComplete, blueprint }) => {
  const [currentFile, setCurrentFile] = useState('');
  const [codeContent, setCodeContent] = useState('');
  const [progress, setProgress] = useState(0);
  const codeContainerRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    let fileIndex = 0;
    let charIndex = 0;
    let currentSnippet = CODE_SNIPPETS[0];
    
    const fileInterval = setInterval(() => {
      if (fileIndex >= MOCK_FILES.length) {
        clearInterval(fileInterval);
        setTimeout(onComplete, 1000);
        return;
      }

      setCurrentFile(MOCK_FILES[fileIndex]);
      currentSnippet = CODE_SNIPPETS[fileIndex % CODE_SNIPPETS.length];
      setCodeContent('');
      charIndex = 0;
      
      // Simulate typing within the file duration
      const typeInterval = setInterval(() => {
        if (charIndex < currentSnippet.length) {
          setCodeContent(prev => prev + currentSnippet.charAt(charIndex));
          charIndex++;
          // Auto scroll
          if (codeContainerRef.current) {
            codeContainerRef.current.scrollTop = codeContainerRef.current.scrollHeight;
          }
        } else {
          clearInterval(typeInterval);
        }
      }, 10);

      setProgress(((fileIndex + 1) / MOCK_FILES.length) * 100);
      fileIndex++;

    }, 2000); // New file every 2 seconds

    return () => clearInterval(fileInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-[500px] gap-4 animate-fade-in">
      {/* Blueprint Summary */}
      <div className="bg-slate-900/50 border-l-4 border-blue-500 p-4 rounded-r-lg">
        <h3 className="text-blue-400 text-sm font-bold mb-1">AI ARCHITECT BLUEPRINT</h3>
        <p className="text-slate-400 text-xs line-clamp-2">{blueprint.split('\n')[0] || 'Generating architecture...'}</p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left: File List */}
        <div className="md:col-span-1 glass-panel rounded-lg p-4 overflow-hidden flex flex-col">
          <h4 className="text-slate-400 text-sm font-bold mb-4 uppercase tracking-wider">Generated Assets</h4>
          <div className="space-y-2">
            {MOCK_FILES.map((file, idx) => {
               const isActive = file === currentFile;
               const isDone = MOCK_FILES.indexOf(currentFile) > idx || progress === 100;
               
               return (
                 <div key={file} className={`flex items-center space-x-2 text-sm ${isActive ? 'text-cyan-400' : isDone ? 'text-green-500' : 'text-slate-600'}`}>
                   <FileCode size={14} />
                   <span>{file}</span>
                   {isActive && <span className="ml-auto w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>}
                 </div>
               )
            })}
          </div>
        </div>

        {/* Right: Live Code View */}
        <div className="md:col-span-2 glass-panel rounded-lg p-0 overflow-hidden flex flex-col border-slate-700 bg-slate-950 relative">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
             <div className="flex items-center space-x-2">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
             </div>
             <div className="text-xs text-slate-400 font-mono flex items-center">
               <Lock size={10} className="mr-1" /> {currentFile || 'initializing...'}
             </div>
          </div>
          <pre ref={codeContainerRef} className="flex-1 p-4 font-mono text-sm text-cyan-300 overflow-y-auto scrollbar-hide">
            <code>
              {codeContent}
              <span className="animate-pulse">_</span>
            </code>
          </pre>
          
          {/* Progress Bar */}
          <div className="h-1 bg-slate-800 w-full mt-auto">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};