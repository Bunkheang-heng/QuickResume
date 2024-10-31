"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

type NavLink = {
  id: number;
  path: string;
  label: string;
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
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
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 flex items-center"
          >
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                QuickResume
              </span>
            </Link>
          </motion.div>
          
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(({ id, path, label }) => (
              <motion.div
                key={id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  href={path}
                  className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-indigo-50"
                >
                  {label}
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link 
                  href="/profile"
                  className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  <Image 
                    src="https://media.tenor.com/b9_3aZ4FLOkAAAAM/black-man-staring.gif" 
                    alt="Profile"
                    width={28}
                    height={28}
                    className="rounded-full border-2 border-white"
                  />
                  <span>Profile</span>
                </Link>
              </motion.div>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link 
                    href="/login"
                    className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-all duration-300"
                  >
                    Login
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Link 
                    href="/signup"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    Sign Up
                  </Link>
                </motion.div>
              </>
            )}
          </div>
          
          <div className="md:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navLinks.map(({ id, path, label }) => (
                  <motion.div
                    key={id}
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={path}
                      className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300"
                      onClick={toggleMenu}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex flex-col space-y-3 px-5">
                  {isLoggedIn ? (
                    <motion.div whileHover={{ x: 10 }}>
                      <Link
                        href="/profile"
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300"
                        onClick={toggleMenu}
                      >
                        <Image 
                          src="https://cdn.dribbble.com/users/1841402/screenshots/6137915/siswa.gif" 
                          alt="Profile"
                          width={28}
                          height={28}
                          className="rounded-full"
                        />
                        <span>Profile</span>
                      </Link>
                    </motion.div>
                  ) : (
                    <>
                      <motion.div whileHover={{ x: 10 }}>
                        <Link
                          href="/login"
                          className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300"
                          onClick={toggleMenu}
                        >
                          Login
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ x: 10 }}>
                        <Link
                          href="/signup"
                          className="block px-3 py-2 rounded-lg text-base font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg transition-all duration-300"
                          onClick={toggleMenu}
                        >
                          Sign Up
                        </Link>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
