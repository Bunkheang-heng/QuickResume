"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/nav';
import Footer from '@/components/footer';
import Link from 'next/link';

const templates = [
  {
    id: 1,
    name: 'Professional',
    image: 'https://d.novoresume.com/images/doc/general-resume-template.png',
    description: 'A clean and modern design suitable for most industries.',
  },
  {
    id: 2,
    name: 'Creative',
    image: 'https://marketplace.canva.com/EAFGTvvkUdo/1/0/1131w/canva-grey-white-modern-graphic-designer-resume-2joEmdrOsls.jpg',
    description: 'A vibrant layout perfect for creative professionals.',
  },
  {
    id: 3,
    name: 'Executive',
    image: 'https://www.myperfectresume.com/wp-content/uploads/2023/12/business-operations-manager-resume-example.svg',
    description: 'An elegant design for senior-level positions.',
  },
  {
    id: 4,
    name: 'Simple',
    image: 'https://d25zcttzf44i59.cloudfront.net/executive-resume-example.png',
    description: 'A minimalist design that focuses on content.',
  },
];

const TemplatePage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<typeof templates[0] | null>(null);

  const handleTemplateClick = (template: typeof templates[0]) => {
    setSelectedTemplate(template);
  };

  const handleCloseModal = () => {
    setSelectedTemplate(null);
  };

  const handleUseTemplate = (templateId: number) => {
    // Implement the logic to use the selected template
    console.log(`Using template with id: ${templateId}`);
    setSelectedTemplate(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-4">
            Choose Your Resume Template
          </h1>
          <p className="text-xl text-gray-600 text-center mb-12">
            Select a professional design to kickstart your career journey
          </p>
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {templates.map((template) => (
              <div key={template.id} className="group cursor-pointer" onClick={() => handleTemplateClick(template)}>
                <div className="bg-white rounded-xl overflow-hidden shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
                  <div className="relative w-full h-64 justify-center items-center flex">
                    <Image
                      src={template.image}
                      alt={template.name}
                      objectFit="cover"
                      width={200}
                      height={200}
                      className="group-hover:opacity-75 transition-opacity duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />

      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-3xl w-full">
            <Image
              src={selectedTemplate.image}
              alt={selectedTemplate.name}
              width={500}
              height={500}
              objectFit="contain"
            />
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Close
              </button>
              <Link
                href="/formwithtamplate/form2"
                onClick={() => handleUseTemplate(selectedTemplate.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Use Template
            </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplatePage;
