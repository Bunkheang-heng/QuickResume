"use client";

import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBriefcase, FaPlus, FaTrash, FaDownload, FaGithub, FaLinkedin } from 'react-icons/fa';
import Navbar from '@/components/nav';
import Footer from '@/components/footer';
import { jsPDF } from 'jspdf';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';

export default function FormNoAIPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    github: '',
    linkedin: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
    },
    education: [{ school: '', major: '', graduationDate: '' }],
    experience: [{ company: '', position: '', startDate: '', endDate: '', description: '' }],
    skills: [''],
  });

  const [pdfUrl, setPdfUrl] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number | undefined, field: string) => {
    const { name, value } = e.target;

    if (field === 'address') {
      setFormData((prevState) => ({
        ...prevState,
        address: { ...prevState.address, [name]: value },
      }));
    } else if (field === 'education' && typeof index === 'number') {
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

  const generateResume = () => {
    const pdf = new jsPDF();
    let yPosition = 20;

    // Add name
    pdf.setFontSize(20);
    pdf.setFont("helvetica", "bold");
    pdf.text(formData.fullName, 20, yPosition);
    yPosition += 10;

    // Add contact info
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Email: ${formData.email} | Phone: ${formData.phone}`, 20, yPosition);
    yPosition += 10;

    // Add social media
    if (formData.github || formData.linkedin) {
      pdf.text(`Social: ${formData.github ? `GitHub: ${formData.github}` : ''} ${formData.linkedin ? `| LinkedIn: ${formData.linkedin}` : ''}`, 20, yPosition);
      yPosition += 10;
    }

    // Add address
    const { street, city, state, zip } = formData.address;
    pdf.text(`Address: ${street}, ${city}, ${state}, ${zip}`, 20, yPosition);
    yPosition += 10;

    // Add education
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Education", 20, yPosition);
    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    formData.education.forEach((edu) => {
      pdf.text(`${edu.school} - ${edu.major}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Graduation: ${edu.graduationDate}`, 20, yPosition);
      yPosition += 8;
    });

    // Add experience
    yPosition += 5;
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Experience", 20, yPosition);
    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    formData.experience.forEach((exp) => {
      pdf.text(`${exp.company} - ${exp.position}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`${exp.startDate} - ${exp.endDate}`, 20, yPosition);
      yPosition += 6;
      pdf.text(exp.description, 20, yPosition);
      yPosition += 8;
    });

    // Add skills
    yPosition += 5;
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Skills", 20, yPosition);
    yPosition += 8;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(formData.skills.join(", "), 20, yPosition);

    const pdfBlob = pdf.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    setPdfUrl(url);
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

  if (!isLoggedIn) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-8 py-10">
              <h1 className="text-4xl font-bold text-white text-center">Create Your Professional Resume</h1>
              <p className="mt-3 text-lg text-indigo-100 text-center">Build a standout resume that will help you land your dream job</p>
            </div>
            
            <form onSubmit={(e) => { e.preventDefault(); generateResume(); }} className="px-8 py-10 space-y-8">
              {/* Personal Information */}
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                      <FaUser className="inline mr-2 text-indigo-600" />Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleChange(e, undefined, '')}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      <FaEnvelope className="inline mr-2 text-indigo-600" />Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => handleChange(e, undefined, '')}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      <FaPhone className="inline mr-2 text-indigo-600" />Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange(e, undefined, '')}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
                      <FaGithub className="inline mr-2 text-indigo-600" />GitHub Profile
                    </label>
                    <input
                      type="url"
                      id="github"
                      name="github"
                      value={formData.github}
                      onChange={(e) => handleChange(e, undefined, '')}
                      placeholder="https://github.com/username"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 mb-1">
                      <FaLinkedin className="inline mr-2 text-indigo-600" />LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      id="linkedin"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={(e) => handleChange(e, undefined, '')}
                      placeholder="https://linkedin.com/in/username"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <input
                      type="text"
                      name="street"
                      value={formData.address.street}
                      onChange={(e) => handleChange(e, undefined, 'address')}
                      placeholder="Street Address"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="city"
                      value={formData.address.city}
                      onChange={(e) => handleChange(e, undefined, 'address')}
                      placeholder="City"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="state"
                      value={formData.address.state}
                      onChange={(e) => handleChange(e, undefined, 'address')}
                      placeholder="State"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    />
                    <input
                      type="text"
                      name="zip"
                      value={formData.address.zip}
                      onChange={(e) => handleChange(e, undefined, 'address')}
                      placeholder="ZIP Code"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Education Section */}
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    <FaGraduationCap className="inline mr-2 text-indigo-600" />Education
                  </h2>
                  <button 
                    type="button" 
                    onClick={() => handleAddField('education')}
                    className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition duration-200"
                  >
                    <FaPlus className="mr-2" /> Add Education
                  </button>
                </div>
                
                {formData.education.map((edu, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="school"
                        value={edu.school}
                        onChange={(e) => handleChange(e, index, 'education')}
                        placeholder="School/University"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                      <input
                        type="text"
                        name="major"
                        value={edu.major}
                        onChange={(e) => handleChange(e, index, 'education')}
                        placeholder="Major/Field of Study"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                      <input
                        type="text"
                        name="graduationDate"
                        value={edu.graduationDate}
                        onChange={(e) => handleChange(e, index, 'education')}
                        placeholder="Graduation Date"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                      {index > 0 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveField('education', index)}
                          className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition duration-200"
                        >
                          <FaTrash className="mr-2" /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Experience Section */}
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    <FaBriefcase className="inline mr-2 text-indigo-600" />Experience
                  </h2>
                  <button 
                    type="button" 
                    onClick={() => handleAddField('experience')}
                    className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition duration-200"
                  >
                    <FaPlus className="mr-2" /> Add Experience
                  </button>
                </div>

                {formData.experience.map((exp, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="company"
                        value={exp.company}
                        onChange={(e) => handleChange(e, index, 'experience')}
                        placeholder="Company Name"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                      <input
                        type="text"
                        name="position"
                        value={exp.position}
                        onChange={(e) => handleChange(e, index, 'experience')}
                        placeholder="Position/Title"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                      <input
                        type="text"
                        name="startDate"
                        value={exp.startDate}
                        onChange={(e) => handleChange(e, index, 'experience')}
                        placeholder="Start Date"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                      <input
                        type="text"
                        name="endDate"
                        value={exp.endDate}
                        onChange={(e) => handleChange(e, index, 'experience')}
                        placeholder="End Date"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                      <div className="col-span-2">
                        <textarea
                          name="description"
                          value={exp.description}
                          onChange={(e) => handleChange(e, index, 'experience')}
                          placeholder="Describe your responsibilities and achievements..."
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 h-32"
                        />
                      </div>
                      {index > 0 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveField('experience', index)}
                          className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition duration-200"
                        >
                          <FaTrash className="mr-2" /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Skills Section */}
              <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Skills</h2>
                  <button 
                    type="button" 
                    onClick={() => handleAddField('skills')}
                    className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition duration-200"
                  >
                    <FaPlus className="mr-2" /> Add Skill
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => handleChange(e, index, 'skills')}
                        placeholder="Enter a skill"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                      />
                      {index > 0 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveField('skills', index)}
                          className="p-2 text-red-600 hover:text-red-800 transition duration-200"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex flex-col items-center space-y-4">
                <button
                  type="submit"
                  className="w-full max-w-md px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition duration-200 hover:scale-105"
                >
                  Generate Resume
                </button>

                {pdfUrl && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center px-8 py-3 text-lg font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform transition duration-200 hover:scale-105"
                  >
                    <FaDownload className="mr-2" /> Download Resume
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
