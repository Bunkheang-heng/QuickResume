"use client"; // Add this at the top of the file

import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/nav';
import Footer from '@/components/footer';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { db } from '../../firebase'; // Make sure to import your Firebase configuration
import { collection, addDoc } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'userMessage'), formData);
      toast.success('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' }); // Clear form after submission
    } catch (error) {
      console.error('Error adding document: ', error);
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Get in Touch
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              We'd love to hear from you. Our team is always here to chat.
            </p>
          </div>

          <div className="mt-16 bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 sm:p-12 md:border-r border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={4} 
                      value={formData.message}
                      onChange={handleChange}
                      className="mt-1 block w-full text-black border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                  </div>
                  <div>
                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
              <div className="p-6 sm:p-12 bg-indigo-700 text-white flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  <div className="space-y-4">
                    <p className="flex items-center">
                      <FaEnvelope className="mr-3" />
                      contact@quickresume.com
                    </p>
                    <p className="flex items-center">
                      <FaPhone className="mr-3" />
                      +1 (555) 123-4567
                    </p>
                    <p className="flex items-center">
                      <FaMapMarkerAlt className="mr-3" />
                      123 Resume Street, Career City, 90210
                    </p>
                  </div>
                </div>
                <div className="mt-8">
                  <Image
                    src="https://instaresume.io/section_1.webp"
                    alt="Contact illustration"
                    width={400}
                    height={300}
                    className="rounded-lg shadow-lg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { question: "How quickly can I create a resume?", answer: "With QuickResume, you can create a professional resume in as little as 15 minutes." },
                { question: "Is my information secure?", answer: "Yes, we use industry-standard encryption to protect your data." },
                { question: "Can I try QuickResume for free?", answer: "Absolutely! We offer a free trial for all new users." },
                { question: "How often can I update my resume?", answer: "You can update your resume as often as you like with our premium plans." },
              ].map((faq, index) => (
                <div key={index} className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-500">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}
