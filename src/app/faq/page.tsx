"use client"; // Add this at the top of the file

import React from 'react';
import { useState } from 'react';
import Navbar from '@/components/nav';
import Footer from '@/components/footer';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "How quickly can I create a resume with QuickResume?",
      answer: "With QuickResume, you can create a professional resume in as little as 15 minutes. Our intuitive interface and pre-designed templates make the process quick and effortless."
    },
    {
      question: "Is my information secure on QuickResume?",
      answer: "Absolutely. We take your privacy and data security very seriously. We use industry-standard encryption protocols to protect your information, and we never share your data with third parties."
    },
    {
      question: "Can I try QuickResume for free?",
      answer: "Yes! We offer a free trial for all new users. This allows you to explore our features and create your first resume without any commitment."
    },
    {
      question: "How often can I update my resume?",
      answer: "With our premium plans, you can update your resume as often as you like. We understand that your career evolves, and we want to ensure your resume always reflects your most recent accomplishments."
    },
    {
      question: "Are QuickResume's templates ATS-friendly?",
      answer: "Yes, all of our templates are designed to be ATS (Applicant Tracking System) friendly. This means your resume will be easily readable by the software many companies use to screen applicants."
    },
    {
      question: "Can I download my resume in different formats?",
      answer: "Certainly! QuickResume allows you to download your resume in multiple formats including PDF, Word, and plain text, ensuring compatibility with various application requirements."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold text-center text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-12">
            Frequently Asked Questions
          </h1>
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
                <button
                  className="w-full text-left p-6 focus:outline-none"
                  onClick={() => toggleFAQ(index)}
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">{faq.question}</h2>
                    {openIndex === index ? (
                      <FaChevronUp className="text-indigo-600" />
                    ) : (
                      <FaChevronDown className="text-indigo-600" />
                    )}
                  </div>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="text-xl text-gray-700 mb-6">
              Didn't find the answer you were looking for?
            </p>
            <a
              href="/contact"
              className="inline-block bg-indigo-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-indigo-700 transition duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FAQPage;
