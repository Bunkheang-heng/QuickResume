// components/Navbar.tsx

"use client"; // Marks this as a Client Component in Next.js

import React, { useState } from 'react';
import Link from 'next/link';

type NavLink = {
  id: number;
  path: string;
  label: string;
};

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const navLinks: NavLink[] = [
    { id: 1, path: "/", label: "Home" },
    { id: 2, path: "/about", label: "About" },
    { id: 3, path: "/features", label: "Features" },
    { id: 4, path: "/pricing", label: "Pricing" },
    { id: 5, path: "/contact", label: "Contact" },
  ];

  return (
    <>
      <nav className="navbar">
        <div className="container">
          {/* Logo */}
          <h1 className="logo">
            <Link href="/">QuickResume</Link>
          </h1>

          {/* Desktop Menu */}
          <ul className="menu">
            {navLinks.map(({ id, path, label }) => (
              <li key={id}>
                <Link href={path}>{label}</Link>
              </li>
            ))}
          </ul>

          {/* Action Buttons */}
          <div className="action-buttons">
            <Link href="/login">Login</Link>
            <Link href="/signup" className="signup-btn">Sign Up</Link>
          </div>
        </div>
      </nav>
      <style jsx>{`
        .navbar {
          background-color: #333;
          color: white;
          box-shadow: 0 2px 4px rgba(0,0,0,.1);
        }
        .container {
          max-width: 1200px;
          margin: auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 60px;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
        }
        .menu {
          display: flex;
          list-style: none;
          gap: 20px;
        }
        .menu li a {
          transition: color 0.3s ease;
        }
        .menu li a:hover {
          color: #04c;
        }
        .action-buttons a {
          padding: 8px 16px;
          margin-left: 20px;
          border: 2px solid transparent;
          border-radius: 5px;
          transition: all 0.3s ease;
        }
        .action-buttons a:hover {
          border-color: #04c;
          color: #04c;
        }
        .signup-btn {
          background-color: #0056b3;
          color: white;
        }
        .signup-btn:hover {
          background-color: #004494;
        }
      `}</style>
    </>
  );
};

export default Navbar;
