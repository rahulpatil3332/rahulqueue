
import React from 'react';
import { Terminal } from 'lucide-react';

interface CodeBlockProps {
  title: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ title, code }) => {
  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-gray-400" />
          <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">{title}</span>
        </div>
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
        </div>
      </div>
      <pre className="p-6 overflow-x-auto text-sm leading-relaxed text-gray-300 code-font">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
