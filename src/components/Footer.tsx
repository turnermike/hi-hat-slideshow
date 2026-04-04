import React from 'react';
import hiHatLogo from '@/assets/hi-hat-logo-transparent.png';

export const Footer: React.FC = () => {
  return (
    <footer className="pt-24 pb-12 border-t border-dark-border bg-dark-surface text-text-primary">
      <div className="inner-wrapper mx-auto w-full px-6">
        <a href="/" className="flex items-center gap-3 group cursor-pointer mb-12">
          <div className="relative h-10 w-10 overflow-hidden transition-transform duration-500 group-hover:rotate-3 group-hover:scale-105 flex items-center justify-center">
            <img 
              src={hiHatLogo} 
              alt="Hi-hat Consulting logo" 
              className="w-full h-full object-contain p-1.5"
            />
          </div>
          <span className="text-2xl font-bold text-text-primary tracking-tight">Hi-hat Consulting</span>
        </a>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 mb-16">
          <div className="md:col-span-2">
            <p className="text-text-secondary max-w-sm leading-relaxed mb-8 text-left">
              Engineering high-performance digital ecosystems with Headless WordPress and React. Transforming standard web pages into growth-focused engines.
            </p>
            <div className="flex items-center gap-6">
              <a 
                href="https://github.com" 
                aria-label="GitHub" 
                className="text-text-secondary hover:text-text-primary transition-all hover:-translate-y-0.5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              </a>
              <a 
                href="https://linkedin.com" 
                aria-label="LinkedIn" 
                className="text-text-secondary hover:text-text-primary transition-all hover:-translate-y-0.5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                aria-label="Instagram" 
                className="text-text-secondary hover:text-text-primary transition-all hover:-translate-y-0.5"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
      
          <div className="text-left">
            <h2 className="text-text-primary font-bold uppercase tracking-[0.2em] text-[11px] mb-4">Navigation</h2>
            <ul className="space-y-2">
              <li>
                <a 
                  href="/" 
                  className="inline-flex items-center text-sm font-bold transition-all transform-gpu text-text-secondary hover:text-text-primary hover:translate-x-0.5 underline decoration-2 underline-offset-8 decoration-primary"
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="/about" 
                  className="inline-flex items-center text-sm font-bold transition-all transform-gpu text-text-secondary hover:text-text-primary hover:translate-x-0.5"
                >
                  About
                </a>
              </li>
              <li>
                <a 
                  href="/portfolio" 
                  className="inline-flex items-center text-sm font-bold transition-all transform-gpu text-text-secondary hover:text-text-primary hover:translate-x-0.5"
                >
                  Portfolio
                </a>
              </li>
            </ul>
          </div>

          <div className="text-left">
            <h2 className="text-text-primary font-bold uppercase tracking-[0.2em] text-[11px] mb-4">Contact</h2>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:turner.mike@gmail.com" 
                  className="inline-flex items-center text-sm font-bold text-text-secondary transition-all transform-gpu hover:text-text-primary hover:translate-x-0.5"
                >
                  turner.mike@gmail.com
                </a>
              </li>
              <li className="text-sm font-bold text-text-secondary">
                Based in Toronto, Canada
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-dark-border flex flex-col md:flex-row justify-between items-start gap-4">
          <p className="text-xs text-text-secondary font-medium text-left">
            Built with Headless WordPress & React.
          </p>
          <div className="flex gap-8">
            <a 
              href="#" 
              className="inline-flex items-center text-[10px] uppercase font-bold tracking-[0.25em] transition-all transform-gpu text-text-secondary hover:text-text-primary hover:translate-x-0.5 text-left"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="inline-flex items-center text-[10px] uppercase font-bold tracking-[0.25em] transition-all transform-gpu text-text-secondary hover:text-text-primary hover:translate-x-0.5 text-left"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
