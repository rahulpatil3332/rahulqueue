
import React from 'react';
import { User, Layers, Share2, Award, IdCard } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="relative bg-[#F8FAFC] pt-20 pb-28 px-4 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-100/30 -skew-x-12 transform origin-top-right"></div>
      <div className="absolute top-20 right-40 w-12 h-12 bg-indigo-100 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40"></div>
      
      <div className="max-w-6xl mx-auto relative flex flex-col lg:flex-row justify-between items-center gap-16">
        <div className="text-center lg:text-left max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full mb-8 shadow-lg shadow-blue-200 border border-blue-500">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-widest">Interactive Education</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-6 tracking-tight leading-[1]">
            Circular <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Queue</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-lg leading-relaxed">
            Master the Ring Buffer: Concepts, Operations, and Python Implementation.
          </p>
        </div>
        
        {/* Enhanced Presenter Block */}
        <div className="relative group">
          {/* Animated Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative bg-white p-1 rounded-[2.4rem] shadow-2xl min-w-[340px] transform transition-all duration-500 hover:-translate-y-2">
            <div className="bg-white rounded-[2.3rem] overflow-hidden">
              {/* Card Header Background */}
              <div className="h-24 bg-gradient-to-br from-slate-900 to-slate-800 relative">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="absolute bottom-0 left-8 transform translate-y-1/2">
                  <div className="w-20 h-20 bg-white p-1.5 rounded-2xl shadow-xl">
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-700 rounded-[0.8rem] flex items-center justify-center text-white">
                      <User size={36} strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="pt-14 pb-8 px-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Award size={14} className="text-amber-500 fill-amber-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Author & Presenter</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">Rahul Dilip Patil</h2>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer">
                    <Share2 size={20} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                      <IdCard size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Academic Identity</p>
                      <p className="font-black text-slate-800 text-lg">2547029</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 py-1">
                    <div className="h-[1px] flex-1 bg-slate-100"></div>
                    <span className="uppercase tracking-tighter">Student Submission</span>
                    <div className="h-[1px] flex-1 bg-slate-100"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
