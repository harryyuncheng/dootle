'use client';

import { useState } from 'react';
import Image from 'next/image';
import DootleLogo from '../../public/Dootle.png';
import { useAuth } from '@/contexts/AuthContext';

interface NavBarProps {
  onHomeClick: () => void;
  onLibraryClick?: () => void;
  onLogoutClick?: () => void;
}

export default function NavBar({ onHomeClick, onLibraryClick, onLogoutClick }: NavBarProps) {
  const { isLoggedIn, username } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={onHomeClick}
            className="cursor-pointer"
          >
            <Image src={DootleLogo} alt="Dootle Logo" height={50} />
          </button>

          {isLoggedIn && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg hover:bg-white/30 transition-all duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {username[0]}
                </div>
                <span className="font-medium">{username}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onLibraryClick?.();
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Library
                  </button>
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      onLogoutClick?.();
                    }}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
