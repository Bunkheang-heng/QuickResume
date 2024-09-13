"use client"; // Add this at the top of the file

import React from 'react';
import Navbar from '@/components/nav';
import Footer from '@/components/footer';
import { FaFileContract, FaUserShield, FaBalanceScale } from 'react-icons/fa';

const TermsPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-8">
            Terms and Conditions
          </h1>
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <FaFileContract className="mx-auto text-5xl text-indigo-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Agreement</h3>
                  <p className="text-gray-600">By using our service, you agree to these terms.</p>
                </div>
                <div className="text-center">
                  <FaUserShield className="mx-auto text-5xl text-indigo-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Privacy</h3>
                  <p className="text-gray-600">Your privacy is important to us. See our Privacy Policy.</p>
                </div>
                <div className="text-center">
                  <FaBalanceScale className="mx-auto text-5xl text-indigo-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Legal Use</h3>
                  <p className="text-gray-600">Use our service only for lawful purposes.</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-indigo-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-6">
                By accessing or using QuickResume, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our service.
              </p>

              <h2 className="text-2xl font-bold text-indigo-900 mb-4">2. Use of Service</h2>
              <p className="text-gray-700 mb-6">
                QuickResume provides a platform for creating resumes. You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account. You agree to use the service only for lawful purposes and in accordance with these Terms.
              </p>

              <h2 className="text-2xl font-bold text-indigo-900 mb-4">3. Intellectual Property</h2>
              <p className="text-gray-700 mb-6">
                The content, features, and functionality of QuickResume are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>

              <h2 className="text-2xl font-bold text-indigo-900 mb-4">4. Limitation of Liability</h2>
              <p className="text-gray-700 mb-6">
                QuickResume shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
              </p>

              <h2 className="text-2xl font-bold text-indigo-900 mb-4">5. Changes to Terms</h2>
              <p className="text-gray-700 mb-6">
                We reserve the right to modify or replace these Terms at any time. It is your responsibility to check these Terms periodically for changes. Your continued use of the service following the posting of any changes constitutes acceptance of those changes.
              </p>

              <div className="bg-indigo-100 rounded-lg p-6 mt-8">
                <h3 className="text-xl font-semibold text-indigo-900 mb-2">Contact Us</h3>
                <p className="text-gray-700">
                  If you have any questions about these Terms, please contact us. We're here to help ensure you understand and agree with our terms of service.
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

export default TermsPage;
