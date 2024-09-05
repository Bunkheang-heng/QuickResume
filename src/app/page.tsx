// pages/index.js

import React from 'react';
import Link from 'next/link';
import Navbar from '../compounent/nav'; // Updated path for Navbar component

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header Section */}
      <header>
        <Navbar />
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="bg-blue-600 text-white py-20 text-center">
          <h2 className="text-5xl font-bold mb-4">
            Create a Professional Resume in Minutes
          </h2>
          <p className="text-xl mb-8">
            QuickResume helps you build a job-ready resume effortlessly.
          </p>
          <Link
            href="/start"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition duration-300"
          >
            Get Started
          </Link>
        </section>

        {/* Features Section */}
        <section className="container mx-auto py-16 text-center">
          <h3 className="text-4xl font-bold mb-10 text-gray-800">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-white p-8 shadow-lg rounded-lg">
              <h4 className="text-2xl font-semibold mb-4">Easy to Use</h4>
              <p>
                QuickResume’s interface is simple and intuitive, allowing anyone
                to create a resume without hassle.
              </p>
            </div>
            <div className="bg-white p-8 shadow-lg rounded-lg">
              <h4 className="text-2xl font-semibold mb-4">Custom Templates</h4>
              <p>
                Choose from a variety of professionally designed resume
                templates to match your style and industry.
              </p>
            </div>
            <div className="bg-white p-8 shadow-lg rounded-lg">
              <h4 className="text-2xl font-semibold mb-4">ChatGPT-Powered AI</h4>
              <p>
                Let our AI assist in crafting a personalized resume that stands
                out from the competition.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-gray-200 py-16">
          <div className="container mx-auto text-center">
            <h3 className="text-4xl font-bold mb-10 text-gray-800">
              What Our Users Say
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 shadow-lg rounded-lg">
                <p className="italic">
                  "QuickResume helped me land my dream job! The templates were
                  professional and easy to use."
                </p>
                <h5 className="text-lg font-bold mt-4">— Jane Doe</h5>
              </div>
              <div className="bg-white p-8 shadow-lg rounded-lg">
                <p className="italic">
                  "I was able to create a resume in just minutes! This platform
                  is a game-changer for job seekers."
                </p>
                <h5 className="text-lg font-bold mt-4">— John Smith</h5>
              </div>
              <div className="bg-white p-8 shadow-lg rounded-lg">
                <p className="italic">
                  "The AI-generated content was spot on and really made my
                  resume shine!"
                </p>
                <h5 className="text-lg font-bold mt-4">— Sarah Lee</h5>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="bg-blue-600 text-white py-16 text-center">
          <h3 className="text-4xl font-bold mb-6">Ready to Get Started?</h3>
          <p className="text-xl mb-8">
            Join thousands of professionals who have used QuickResume to land
            their next job.
          </p>
          <Link
            href="/register"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition duration-300"
          >
            Create an Account Now
          </Link>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 QuickResume. All rights reserved.</p>
          <p className="mt-2">Contact us at support@quickresume.com</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
