"use client";

import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBriefcase, FaPlus, FaTrash, FaDownload } from 'react-icons/fa';
import Navbar from '@/components/nav';
import Footer from '@/components/footer';
import { jsPDF } from 'jspdf';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase'; // Make sure this import path is correct

export default function FormNoAIPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
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
        router.push('/login'); // Redirect to login page if not logged in
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
    return null; // Or you can return a loading indicator
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen width-full bg-gradient-to-r from-purple-700 to-indigo-800 mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-extrabold mb-6 text-center text-indigo-600">Create Your Resume</h1>
          <p className="text-lg text-gray-600 mb-8 text-center">Fill in the form to generate a beautiful resume in PDF format.</p>
          <form onSubmit={(e) => { e.preventDefault(); generateResume(); }} className="space-y-6 text-black">
            <div>
              <label htmlFor="fullName" className="block text-lg font-medium text-gray-700 mb-2">
                <FaUser className="inline mr-2" />Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange(e, undefined, '')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 mb-2">
                <FaEnvelope className="inline mr-2" />Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange(e, undefined, '')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-lg font-medium text-gray-700 mb-2">
                <FaPhone className="inline mr-2" />Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => handleChange(e, undefined, '')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg"
                required
              />
            </div>

            {/* Address Section */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Address</h2>
              <div className="space-y-2">
                <input
                  type="text"
                  name="street"
                  value={formData.address.street}
                  onChange={(e) => handleChange(e, undefined, 'address')}
                  placeholder="Street"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg"
                />
                <input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={(e) => handleChange(e, undefined, 'address')}
                  placeholder="City"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg"
                />
                <div className="flex space-x-2">
                  <input
                    type="text"
                    name="state"
                    value={formData.address.state}
                    onChange={(e) => handleChange(e, undefined, 'address')}
                    placeholder="State"
                    className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg"
                  />
                  <input
                    type="text"
                    name="zip"
                    value={formData.address.zip}
                    onChange={(e) => handleChange(e, undefined, 'address')}
                    placeholder="Zip Code"
                    className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div>
              <h2 className="text-xl font-semibold mb-2">
                <FaGraduationCap className="inline mr-2" />Education
              </h2>
              {formData.education.map((edu, index) => (
                <div key={index} className="space-y-2 mb-4">
                  <input
                    type="text"
                    name="school"
                    value={edu.school}
                    onChange={(e) => handleChange(e, index, 'education')}
                    placeholder="School"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg"
                  />
                  <input
                    type="text"
                    name="major"
                    value={edu.major}
                    onChange={(e) => handleChange(e, index, 'education')}
                    placeholder="Major"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg"
                  />
                  <input
                    type="text"
                    name="graduationDate"
                    value={edu.graduationDate}
                    onChange={(e) => handleChange(e, index, 'education')}
                    placeholder="Graduation Date"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg"
                  />
                  {index > 0 && (
                    <button type="button" onClick={() => handleRemoveField('education', index)} className="text-red-600">
                      <FaTrash className="inline mr-1" /> Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => handleAddField('education')} className="text-indigo-600">
                <FaPlus className="inline mr-1" /> Add Education
              </button>
            </div>

            {/* Experience Section */}
            <div>
              <h2 className="text-xl font-semibold mb-2">
                <FaBriefcase className="inline mr-2" />Experience
              </h2>
              {formData.experience.map((exp, index) => (
                <div key={index} className="space-y-2 mb-4">
                  <input
                    type="text"
                    name="company"
                    value={exp.company}
                    onChange={(e) => handleChange(e, index, 'experience')}
                    placeholder="Company"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg"
                  />
                  <input
                    type="text"
                    name="position"
                    value={exp.position}
                    onChange={(e) => handleChange(e, index, 'experience')}
                    placeholder="Position"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg"
                  />
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="startDate"
                      value={exp.startDate}
                      onChange={(e) => handleChange(e, index, 'experience')}
                      placeholder="Start Date"
                      className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg"
                    />
                    <input
                      type="text"
                      name="endDate"
                      value={exp.endDate}
                      onChange={(e) => handleChange(e, index, 'experience')}
                      placeholder="End Date"
                      className="block w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg"
                    />
                  </div>
                  <textarea
                    name="description"
                    value={exp.description}
                    onChange={(e) => handleChange(e, index, 'experience')}
                    placeholder="Job Description"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-lg"
                  />
                  {index > 0 && (
                    <button type="button" onClick={() => handleRemoveField('experience', index)} className="text-red-600">
                      <FaTrash className="inline mr-1" /> Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => handleAddField('experience')} className="text-indigo-600">
                <FaPlus className="inline mr-1" /> Add Experience
              </button>
            </div>

            {/* Skills Section */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Skills</h2>
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleChange(e, index, 'skills')}
                    placeholder="Skill"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  {index > 0 && (
                    <button type="button" onClick={() => handleRemoveField('skills', index)} className="text-red-600">
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => handleAddField('skills')} className="text-indigo-600">
                <FaPlus className="inline mr-1" /> Add Skill
              </button>
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Generate Resume
              </button>
            </div>
          </form>
          {pdfUrl && (
            <div className="mt-6 text-center">
              <button
                onClick={handleDownload}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <FaDownload className="mr-2" /> Download Resume
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
