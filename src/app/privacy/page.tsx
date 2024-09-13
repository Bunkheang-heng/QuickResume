"use client";

import React from 'react';
import Navbar from '@/components/nav';
import Footer from '@/components/footer';
import { FaShieldAlt, FaUserSecret, FaLock } from 'react-icons/fa';

const PrivacyPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-indigo-100 to-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-indigo-900 text-center mb-8">
            Privacy Policy
          </h1>
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="p-8">
              <p className="text-lg text-gray-700 mb-6">
                At QuickResume, we take your privacy seriously. We want to assure you that we do not collect, store, or process any personal information from our users.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <FaShieldAlt className="mx-auto text-5xl text-indigo-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Collection</h3>
                  <p className="text-gray-600">We do not collect any personal data from our users.</p>
                </div>
                <div className="text-center">
                  <FaUserSecret className="mx-auto text-5xl text-indigo-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Complete Anonymity</h3>
                  <p className="text-gray-600">Use our service with full confidence in your privacy.</p>
                </div>
                <div className="text-center">
                  <FaLock className="mx-auto text-5xl text-indigo-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Experience</h3>
                  <p className="text-gray-600">Your resume creation process is entirely private.</p>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-indigo-900 mb-4">Our Commitment to Your Privacy</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li className="mb-2">We do not require any personal information to use our service.</li>
                <li className="mb-2">No cookies or tracking technologies are used on our website.</li>
                <li className="mb-2">We do not store any data entered during the resume creation process.</li>
                <li className="mb-2">All resume generation is done client-side, ensuring your information never leaves your device.</li>
              </ul>
              <p className="text-lg text-gray-700 mb-6">
                Our goal is to provide you with a powerful resume creation tool while respecting your right to privacy. We believe that your personal and professional information should remain solely in your control.
              </p>
              <div className="bg-indigo-100 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-indigo-900 mb-2">Questions or Concerns?</h3>
                <p className="text-gray-700">
                  If you have any questions about our privacy practices, please don't hesitate to contact us. We're here to ensure you feel confident and secure while using QuickResume.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPage;
