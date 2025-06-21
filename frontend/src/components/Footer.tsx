import { FilmIcon } from 'lucide-react';

// Footer component that displays app branding and copyright information
export const Footer = () => {
  return (
    <footer className="bg-[#111] py-6 w-full">
      {/* Main footer container with max width and responsive padding */}
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Centered flex container for footer content */}
        <div className="flex flex-col items-center gap-4">
          
          {/* App logo and name */}
          <div className="flex items-center gap-2">
            {/* Film icon */}
            <FilmIcon className="text-red-600" />
            {/* App name */}
            <span className="font-bold text-white">PELLICULA</span>
          </div>
          
          {/* Copyright notice with current year */}
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Pellicula. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};