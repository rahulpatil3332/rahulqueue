
import React, { useEffect, useRef, useState } from 'react';

type AnimationVariant = 
  | 'slide-left' 
  | 'scale' 
  | 'slide-right' 
  | 'blur' 
  | 'flip' 
  | 'zoom-out' 
  | 'slide-up';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  variant?: AnimationVariant;
}

const Section: React.FC<SectionProps> = ({ id, title, children, variant = 'slide-up' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // We toggle the state based on whether the item is currently intersecting.
        // This ensures the animation re-triggers every time the user scrolls to the section.
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger slightly earlier for a more responsive feel
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const getVariantClass = () => {
    switch (variant) {
      case 'slide-left': return 'reveal-slide-left';
      case 'scale': return 'reveal-scale';
      case 'slide-right': return 'reveal-slide-right';
      case 'blur': return 'reveal-blur';
      case 'flip': return 'reveal-flip';
      case 'zoom-out': return 'reveal-zoom-out';
      default: return 'reveal-slide-up';
    }
  };

  return (
    <section 
      id={id} 
      ref={sectionRef}
      className={`scroll-mt-24 reveal-base ${getVariantClass()} ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className={`h-10 w-2 bg-blue-600 rounded-full transition-all duration-700 ease-out ${isVisible ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`}></div>
        <h2 className={`text-3xl font-extrabold text-gray-900 tracking-tight transition-all duration-700 delay-100 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}>
          {title}
        </h2>
      </div>
      <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-8 blur-sm'}`}>
        {children}
      </div>
    </section>
  );
};

export default Section;
