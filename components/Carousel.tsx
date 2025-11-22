import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  btnText: string;
  link: string;
  align?: 'left' | 'center' | 'right';
}

interface CarouselProps {
  slides: Slide[];
  autoPlay?: boolean;
  interval?: number;
}

export const Carousel: React.FC<CarouselProps> = ({ slides, autoPlay = true, interval = 5000 }) => {
  const [current, setCurrent] = useState(0);

  // Reset current slide when slides array changes (e.g. changing categories)
  useEffect(() => {
    setCurrent(0);
  }, [slides]);

  useEffect(() => {
    if (!autoPlay || slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, slides.length, slides]); // Added slides dependency to reset timer if slides change

  const next = () => setCurrent((current + 1) % slides.length);
  const prev = () => setCurrent((current - 1 + slides.length) % slides.length);

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-2xl shadow-xl group bg-gray-900">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover opacity-80"
          />
          
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

          {/* Content */}
          <div className={`absolute inset-0 flex flex-col justify-center px-8 sm:px-16 md:px-24 ${
            slide.align === 'left' ? 'items-start text-left' : 
            slide.align === 'right' ? 'items-end text-right' : 
            'items-center text-center'
          }`}>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 transform transition-all duration-700 translate-y-0 drop-shadow-lg leading-tight">
              {slide.title}
            </h2>
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-xl drop-shadow-md font-medium">
              {slide.subtitle}
            </p>
            <Link
              to={slide.link}
              className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 hover:text-indigo-700 transition-all transform hover:scale-105 shadow-lg"
            >
              {slide.btnText}
            </Link>
          </div>
        </div>
      ))}

      {/* Controls (Only show if > 1 slide) */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition opacity-0 group-hover:opacity-100 border border-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/30 text-white backdrop-blur-md transition opacity-0 group-hover:opacity-100 border border-white/20"
          >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  current === idx ? 'bg-white w-8' : 'bg-white/40 w-4 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};