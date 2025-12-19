
import React from 'react';
import { User, Layers } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-700 via-indigo-800 to-purple-900 text-white pt-12 pb-20 px-4 shadow-2xl">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center bg-white/20 px-3 py-1 rounded-full mb-4 backdrop-blur-sm border border-white/30">
            <Layers className="w-4 h-4 mr-2" />
            <span className="text-xs font-bold uppercase tracking-widest">Data Structures Visualization</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight">Circular Queue – Visualization App</h1>
          <p className="text-xl text-blue-100/90 font-medium">Concept, Operations & Step-by-Step Working</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl min-w-[280px]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-800">
              <User size={24} />
            </div>
            <div>
              <p className="text-xs text-blue-200 uppercase font-bold tracking-wider">Presenter</p>
              <h2 className="text-lg font-bold">Rahul Dilip Patil</h2>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm border-t border-white/10 pt-4">
            <span className="text-blue-200">Roll No.</span>
            <span className="font-mono font-bold text-white bg-indigo-500/50 px-2 py-1 rounded">2547029</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
