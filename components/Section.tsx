
import React from 'react';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, title, children }) => {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-10 w-2 bg-blue-600 rounded-full"></div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
};

export default Section;
