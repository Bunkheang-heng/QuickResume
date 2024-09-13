// components/Navbar.tsx

"use client"; // Marks this as a Client Component in Next.js

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { auth } from '../firebase'; // make sure the path to your firebase config is correct
import { onAuthStateChanged } from 'firebase/auth';

type NavLink = {
  id: number;
  path: string;
  label: string;
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setIsLoggedIn(true);
      } else {
        // User is signed out
        setIsLoggedIn(false);
      }
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  const navLinks: NavLink[] = [
    { id: 1, path: "/", label: "Home" },
    { id: 2, path: "/about", label: "About" },
    { id: 3, path: "/features", label: "Features" },
    { id: 4, path: "/pricing", label: "Pricing" },
    { id: 5, path: "/contact", label: "Contact" },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600">
              QuickResume
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map(({ id, path, label }) => (
              <Link 
                key={id} 
                href={path}
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
              >
                {label}
              </Link>
            ))}
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <Link 
                href="/profile"
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center"
              >
                <Image 
                  src="https://media.tenor.com/b9_3aZ4FLOkAAAAM/black-man-staring.gif" 
                  alt="Profile" 
                  width={24} 
                  height={24} 
                  className="rounded-full mr-2"
                />
                Profile
              </Link>
            ) : (
              <>
                <Link 
                  href="/login"
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Login
                </Link>
                <Link 
                  href="/signup"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map(({ id, path, label }) => (
                <Link
                  key={id}
                  href={path}
                  className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={toggleMenu}
                >
                  {label}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                {isLoggedIn ? (
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 flex items-center"
                    onClick={toggleMenu}
                  >
                    <Image 
                      src="https://cdn.dribbble.com/users/1841402/screenshots/6137915/siswa.gif" 
                      alt="Profile" 
                      width={24} 
                      height={24} 
                      className="rounded-full mr-2"
                    />
                    Profile
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                      onClick={toggleMenu}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="ml-4 block px-3 py-2 rounded-md text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                      onClick={toggleMenu}
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
