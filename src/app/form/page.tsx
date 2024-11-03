"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBriefcase, FaPlus, FaTrash, FaDownload, FaSpinner, FaMapMarkerAlt } from 'react-icons/fa';
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
    address: '',
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
        Address: ${formData.address}
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
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      pdf.setFont("helvetica");
      
      const lines = resumeText.split('\n');
      let yPosition = 20;  // Start position for the first line
      
      lines.forEach((line: string) => {
        if (line.trim().endsWith(':')) {
          pdf.setFontSize(14);
          pdf.setFont("helvetica", "bold");
          pdf.text(line, 20, yPosition);
          yPosition += 7;  // Space before the next section
        } else if (line.includes('|')) {
          const [content, date] = line.split('|');
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "normal");
          pdf.text(content.trim(), 20, yPosition);
          pdf.text(date.trim(), 190, yPosition, { align: 'right' });
          yPosition += 6;  // Regular line spacing
        } else {
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "normal");
          pdf.text(line, 20, yPosition);
          yPosition += 6;  // Regular line spacing
        }
      
        if (yPosition > 280) {  // Ensure there's room for footer or next section
          pdf.addPage();
          yPosition = 20;
        }
      });
      
      // Finalize PDF
      const pdfBlob = pdf.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      

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
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Create Your Professional Resume</h2>
            <p className="mt-2 text-lg text-gray-600">
              Build a standout resume that captures your professional journey
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Personal Information Section */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="space-y-6">
                <div className="form-group">
                  <label className="flex items-center text-lg font-semibold text-gray-700 mb-4">
                    <FaUser className="mr-2 text-gray-600" /> Personal Information
                  </label>
                  <div className="space-y-4">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleChange(e, undefined, 'fullName')}
                      placeholder="Full Name"
                      className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200"
                      required
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => handleChange(e, undefined, 'email')}
                      placeholder="Email Address"
                      className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200"
                      required
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange(e, undefined, 'phone')}
                      placeholder="Phone Number"
                      className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200"
                      required
                    />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={(e) => handleChange(e, undefined, 'address')}
                      placeholder="Your Address"
                      className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="form-group">
                <label className="flex items-center text-lg font-semibold text-gray-700 mb-4">
                  <FaGraduationCap className="mr-2 text-gray-600" /> Education
                </label>
                {formData.education.map((edu, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg mb-4">
                    <div className="grid grid-cols-1 gap-4">
                      <input
                        type="text"
                        name="school"
                        value={edu.school}
                        onChange={(e) => handleChange(e, index, 'education')}
                        placeholder="Institution Name"
                        className="w-full text-black px-4 py-2 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200"
                        required
                      />
                      <input
                        type="text"
                        name="major"
                        value={edu.major}
                        onChange={(e) => handleChange(e, index, 'education')}
                        placeholder="Field of Study"
                        className="w-full text-black px-4 py-2 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200"
                        required
                      />
                      <input
                        type="text"
                        name="graduationDate"
                        value={edu.graduationDate}
                        onChange={(e) => handleChange(e, index, 'education')}
                        placeholder="Graduation Date"
                        className="w-full text-black px-4 py-2 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200"
                        required
                      />
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveField('education', index)}
                        className="mt-2 text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        <FaTrash className="inline mr-1" /> Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddField('education')}
                  className="flex items-center text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-200"
                >
                  <FaPlus className="mr-1" /> Add Education
                </button>
              </div>
            </div>

            {/* Work Experience Section */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="space-y-6">
                <label className="flex items-center text-lg font-semibold text-gray-700 mb-4">
                  <FaBriefcase className="mr-2 text-gray-600" /> Work Experience
                </label>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="p-6 bg-white rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="company"
                        value={exp.company}
                        onChange={(e) => handleChange(e, index, 'experience')}
                        placeholder="Company Name"
                        className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200"
                        required
                      />
                      <input
                        type="text"
                        name="position"
                        value={exp.position}
                        onChange={(e) => handleChange(e, index, 'experience')}
                        placeholder="Position Title"
                        className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200"
                        required
                      />
                      <input
                        type="text"
                        name="startDate"
                        value={exp.startDate}
                        onChange={(e) => handleChange(e, index, 'experience')}
                        placeholder="Start Date"
                        className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200"
                        required
                      />
                      <input
                        type="text"
                        name="endDate"
                        value={exp.endDate}
                        onChange={(e) => handleChange(e, index, 'experience')}
                        placeholder="End Date"
                        className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200"
                        required
                      />
                    </div>
                    <textarea
                      name="description"
                      value={exp.description}
                      onChange={(e) => handleChange(e, index, 'experience')}
                      placeholder="Describe your responsibilities and achievements..."
                      className="mt-4 w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200 h-32"
                      required
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveField('experience', index)}
                        className="mt-2 text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        <FaTrash className="inline mr-1" /> Remove Experience
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleAddField('experience')}
                  className="flex items-center text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-200"
                >
                  <FaPlus className="mr-1" /> Add Experience
                </button>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-gray-50 p-8 rounded-lg shadow-sm">
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-700 mb-4">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleChange(e, index, 'skills')}
                        className="px-4 text-black py-2 rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-200"
                        placeholder="Enter a skill"
                        required
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveField('skills', index)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => handleAddField('skills')}
                  className="flex items-center text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-200"
                >
                  <FaPlus className="mr-1" /> Add Skill
                </button>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Creating Your Resume...
                  </>
                ) : (
                  'Generate Professional Resume'
                )}
              </button>
            </div>
          </form>

          {generatedResume && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Generated Resume</h3>
              <div className="bg-gray-50 rounded-lg p-6">
                <pre className="whitespace-pre-wrap text-gray-700 font-sans">{generatedResume}</pre>
              </div>
              <button
                onClick={handleDownload}
                className="mt-6 flex items-center justify-center w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-bold hover:bg-gray-800 transition-all duration-300"
              >
                <FaDownload className="mr-2" /> Download PDF Version
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
