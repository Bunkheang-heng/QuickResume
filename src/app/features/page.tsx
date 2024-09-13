"use client";

import React from 'react';
import Navbar from '@/components/nav';
import Footer from '@/components/footer';
import { FaFileAlt, FaRobot, FaDownload, FaEdit, FaPencilAlt } from 'react-icons/fa';
import Link from 'next/link';

const FeaturesPage: React.FC = () => {
  const features = [
    {
      icon: <FaFileAlt className="text-4xl mb-4 text-indigo-600" />,
      title: 'Easy Resume Creation',
      description: 'Create professional resumes with our user-friendly form. Input your details and choose your preferred generation method.',
      link: '/formwithtemplate',
      buttonText: 'Create Resume',
    },
    {
      icon: <FaRobot className="text-4xl mb-4 text-indigo-600" />,
      title: 'AI-Powered Generation',
      description: 'Let our AI refine your input, fixing grammar and rephrasing content for a polished, professional resume.',
      link: '/form',
      buttonText: 'Try AI Generation',
    },
    {
      icon: <FaPencilAlt className="text-4xl mb-4 text-indigo-600" />,
      title: 'Manual Generation',
      description: 'Generate your resume based solely on the information you provide, without AI rephrasing or corrections.',
      link: '/formnoai',
      buttonText: 'Try Manual Generation',
    },
    {
      icon: <FaDownload className="text-4xl mb-4 text-indigo-600" />,
      title: 'PDF Download',
      description: 'Download your generated resume as a PDF file, ready for sharing or printing.',
    },
    {
      icon: <FaEdit className="text-4xl mb-4 text-indigo-600" />,
      title: 'Customizable Content',
      description: 'Easily add, edit, or remove sections like education, experience, and skills to tailor your resume.',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Features</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                {feature.icon}
                <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                {feature.link && (
                  <Link href={feature.link}>
                    <button className="mt-auto bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300">
                      {feature.buttonText}
                    </button>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
