// pages/signup.tsx
"use client"; // Marks this component as a Client Component

import React, { useState } from 'react';
import Link from 'next/link';
import { FaGoogle, FaFacebookF } from 'react-icons/fa';

const SignupPage: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here, you would typically handle integration with your authentication service
    console.log(`Name: ${name}, Email: ${email}, Password: ${password}`);
    alert('Signup functionality not implemented yet');
  };

  return (
    <div className="flex min-h-screen bg-gray-100 items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg z-10">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign Up
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSignup}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none
                 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mb-2"
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email Address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border
                 border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none
                  focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm mb-2"
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="mt-6 grid grid-cols-1 gap-3">
          <button
            onClick={() => console.log('Sign up with Google')}
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FaGoogle className="text-xl mr-2" /> Sign up with Google
          </button>
          <button
            onClick={() => console.log('Sign up with Facebook')}
            className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
          >
            <FaFacebookF className="text-xl mr-2" /> Sign up with Facebook
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? {' '}
          <Link href="/login">
            <span className="text-indigo-600 hover:text-indigo-500">
              Log in
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;