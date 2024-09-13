"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBriefcase, FaPlus, FaTrash, FaDownload, FaSpinner } from 'react-icons/fa';
import Navbar from '@/components/nav';
import Footer from '@/components/footer';
import { jsPDF } from 'jspdf';
import {auth, db} from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function FormPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(user.email || '');
      } else {
        setIsLoggedIn(false);
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: [{ school: '', major: '', graduationDate: '' }],
    experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
    skills: [''],
  });

  const [generatedResume, setGeneratedResume] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateResume = async () => {
    try {
      setIsLoading(true);
      const API_KEY = 'AIzaSyCaE02HKfzI_FJhS3v4ZWfAVC_QERow_hI';
      const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

      const prompt = `Generate a professional resume based on the following information. Format it similar to the example provided in this image: https://cdn.enhancv.com/ivy_league_cover_letter_template_1_439b5cab58.png. The resume should have clear sections, dates aligned to the right, and a clean layout. Use the following details:

        Full Name: ${formData.fullName}
        
        Email: ${formData.email}
        Phone: ${formData.phone}
        Education: ${formData.education.map(edu => `${edu.school}, ${edu.major}, Graduation: ${edu.graduationDate}`).join('\n')}
        Work Experience: ${formData.experience.map(exp => `${exp.company}, ${exp.position}, ${exp.startDate} - ${exp.endDate}\n${exp.description}`).join('\n\n')}
        Skills: ${formData.skills.join(', ')}`;

      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate resume');
      }

      const data = await response.json();
      const resumeText = data.candidates[0].content.parts[0].text;
      setGeneratedResume(resumeText);
      
      const pdf = new jsPDF();
      const lines = resumeText.split('\n');
      let yPosition = 20;
      
      lines.forEach((line: string) => {
        if (line.trim().endsWith(':')) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(14);
          pdf.text(line, 20, yPosition);
          yPosition += 7;
        } else if (line.includes('|')) {
          const [content, date] = line.split('|');
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(12);
          pdf.text(content.trim(), 20, yPosition);
          pdf.text(date.trim(), 190, yPosition, { align: 'right' });
          yPosition += 6;
        } else {
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(12);
          pdf.text(line, 20, yPosition);
          yPosition += 6;
        }

        if (yPosition > 280) {
          pdf.addPage();
          yPosition = 20;
        }
      });

      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);

      // Store resume information in Firestore
      await addDoc(collection(db, 'resumes'), {
        userEmail: userEmail,
        resumeTitle: formData.fullName + "'s Resume",
        createdAt: serverTimestamp(),
      });

    } catch (error) {
      console.error('Error generating resume:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `${formData.fullName.replace(/\s+/g, '_')}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number | undefined, field: string) => {
    const { name, value } = e.target;
    if (field === 'education' && typeof index === 'number') {
      setFormData((prevState) => ({
        ...prevState,
        education: prevState.education.map((edu, i) => (i === index ? { ...edu, [name]: value } : edu)),
      }));
    } else if (field === 'experience' && typeof index === 'number') {
      setFormData((prevState) => ({
        ...prevState,
        experience: prevState.experience.map((exp, i) => (i === index ? { ...exp, [name]: value } : exp)),
      }));
    } else if (field === 'skills' && typeof index === 'number') {
      setFormData((prevState) => ({
        ...prevState,
        skills: prevState.skills.map((skill, i) => (i === index ? value : skill)),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddField = (field: 'education' | 'experience' | 'skills') => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: field === 'education'
        ? [...prevState[field], { school: '', major: '', graduationDate: '' }]
        : field === 'experience'
        ? [...prevState[field], { company: '', position: '', startDate: '', endDate: '', description: '' }]
        : [...prevState[field], ''],
    }));
  };

  const handleRemoveField = (field: 'education' | 'experience' | 'skills', index: number) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: prevState[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    generateResume();
  };

  if (!isLoggedIn) {
    return null; // Or you can return a loading indicator
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-purple-700 to-indigo-800 text-white">
        <div className="max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-2xl overflow-hidden my-12 p-8">
          <h2 className="text-4xl font-bold mb-6 text-center text-gray-900">Create Your Professional Resume</h2>
          <p className="text-lg text-gray-600 text-center mb-8">
            Fill in your details and generate a beautifully designed resume.
          </p>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-lg font-semibold text-gray-700">
                  <FaUser className="inline mr-2" /> Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleChange(e, undefined, 'fullName')}
                  className="mt-1 w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-lg font-semibold text-gray-700">
                  <FaEnvelope className="inline mr-2" /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleChange(e, undefined, 'email')}
                  className="mt-1 w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-lg font-semibold text-gray-700">
                  <FaPhone className="inline mr-2" /> Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange(e, undefined, 'phone')}
                  className="mt-1 w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700">
                  <FaGraduationCap className="inline mr-2" /> Education
                </label>
                {formData.education.map((edu, index) => (
                  <div key={index} className="space-y-2">
                    <input
                      type="text"
                      name="school"
                      value={edu.school}
                      onChange={(e) => handleChange(e, index, 'education')}
                      placeholder="School"
                      className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                    <input
                      type="text"
                      name="major"
                      value={edu.major}
                      onChange={(e) => handleChange(e, index, 'education')}
                      placeholder="Major"
                      className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                    <input
                      type="text"
                      name="graduationDate"
                      value={edu.graduationDate}
                      onChange={(e) => handleChange(e, index, 'education')}
                      placeholder="Graduation Date"
                      className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveField('education', index)}
                        className="text-red-600"
                      >
                        <FaTrash className="inline mr-1" /> Remove Education
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddField('education')}
                  className="mt-2 text-purple-600 font-semibold"
                >
                  <FaPlus className="inline mr-1" /> Add Education
                </button>
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700">
                  <FaBriefcase className="inline mr-2" /> Work Experience
                </label>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="space-y-2">
                    <input
                      type="text"
                      name="company"
                      value={exp.company}
                      onChange={(e) => handleChange(e, index, 'experience')}
                      placeholder="Company"
                      className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                    <input
                      type="text"
                      name="position"
                      value={exp.position}
                      onChange={(e) => handleChange(e, index, 'experience')}
                      placeholder="Position"
                      className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        name="startDate"
                        value={exp.startDate}
                        onChange={(e) => handleChange(e, index, 'experience')}
                        placeholder="Start Date"
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                      />
                      <input
                        type="text"
                        name="endDate"
                        value={exp.endDate}
                        onChange={(e) => handleChange(e, index, 'experience')}
                        placeholder="End Date"
                        className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                        required
                      />
                    </div>
                    <textarea
                      name="description"
                      value={exp.description}
                      onChange={(e) => handleChange(e, index, 'experience')}
                      placeholder="Job Description"
                      className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveField('experience', index)}
                        className="text-red-600"
                      >
                        <FaTrash className="inline mr-1" /> Remove Experience
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddField('experience')}
                  className="mt-2 text-purple-600 font-semibold"
                >
                  <FaPlus className="inline mr-1" /> Add Experience
                </button>
              </div>
              <div>
                <label className="block text-lg font-semibold text-gray-700">
                  Skills
                </label>
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center mt-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleChange(e, index, 'skills')}
                      className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      placeholder="Enter a skill"
                      required
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveField('skills', index)}
                        className="ml-2 text-red-600"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddField('skills')}
                  className="mt-2 text-purple-600 font-semibold"
                >
                  <FaPlus className="inline mr-1" /> Add Skill
                </button>
              </div>
            </div>
            <div className="mt-8">
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-bold text-white bg-purple-600 hover:bg-purple-700 transition duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  'Generate Resume'
                )}
              </button>
            </div>
          </form>
          {generatedResume && (
            <div className="mt-8">
              <h3 className="text-2xl font-semibold text-gray-900">Generated Resume</h3>
              <pre className="whitespace-pre-wrap mt-4 p-4 bg-gray-100 rounded-lg text-gray-800">{generatedResume}</pre>
              <button
                onClick={handleDownload}
                className="mt-4 flex items-center justify-center px-4 py-2 border border-transparent text-lg font-bold rounded-lg text-white bg-purple-600 hover:bg-purple-700 transition duration-300"
              >
                <FaDownload className="mr-2" /> Download PDF
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
