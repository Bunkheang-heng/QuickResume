"use client";

import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import Navbar from "@/components/nav"; // Assuming you have a Navbar component
import Footer from "@/components/footer"; // Assuming you have a Footer component
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase"; // Assuming you have firebase config in this file

export default function ResumePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    profession: "",
    summary: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    twitter: "",
    experience: [{ title: "", company: "", dates: "", description: "" }],
    skills: [""],
    certificates: [{ title: "", issuedBy: "", date: "" }],
    education: [{ degree: "", school: "", dates: "" }],
    languages: [{ language: "", proficiency: "" }],
    image: null as File | null,
    resumeTitle: "", // New field for resume title
  });

  const [pdfUrl, setPdfUrl] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const checkFormValidity = () => {
      const requiredFields = [
        'fullName', 'profession', 'summary', 'email', 'phone', 'location'
      ];
      const isValid = requiredFields.every(field => (formData as any)[field].trim() !== '') &&
        formData.experience.every(exp => exp.title && exp.company && exp.dates && exp.description) &&
        formData.skills.length > 0 &&
        formData.education.every(edu => edu.degree && edu.school && edu.dates);
      setIsFormValid(isValid);
    };

    checkFormValidity();
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number, field?: keyof typeof formData, subField?: string) => {
    const { name, value } = e.target;
    if (field && subField) {
      setFormData((prevState) => ({
        ...prevState,
        [field]: Array.isArray(prevState[field])
          ? prevState[field].map((item, i) =>
              i === index ? { ...item, [subField]: value } : item
            )
          : prevState[field],
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleAddField = (field: keyof typeof formData) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: [
        ...(prevState[field] as any[]),
        field === "experience"
          ? { title: "", company: "", dates: "", description: "" }
          : field === "skills"
          ? ""
          : field === "certificates"
          ? { title: "", issuedBy: "", date: "" }
          : field === "education"
          ? { degree: "", school: "", dates: "" }
          : { language: "", proficiency: "" },
      ],
    }));
  };

  const handleRemoveField = (field: keyof typeof formData, index: number) => {
    setFormData((prevState) => ({
      ...prevState,
      [field]: Array.isArray(prevState[field])
        ? prevState[field].filter((_, i) => i !== index)
        : prevState[field],
    }));
  };

  const generateResume = async () => {
    const pdf = new jsPDF();
    let yPosition = 20;

    // Add image if provided
    if (formData.image) {
      const reader = new FileReader();
      reader.onload = function(event) {
        if (event.target && typeof event.target.result === 'string') {
          pdf.addImage(event.target.result, 'JPEG', 160, 10, 40, 40);
          
          // Continue with the rest of the PDF generation
          addContentToPDF();
        }
      };
      reader.readAsDataURL(formData.image);
    } else {
      // If no image, proceed with PDF generation
      addContentToPDF();
    }

    function addContentToPDF() {
      // Add full name and profession
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(formData.fullName, 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "normal");
      pdf.text(formData.profession, 20, yPosition);
      yPosition += 10;

      // Add summary
      pdf.setFontSize(12);
      pdf.text(formData.summary, 20, yPosition);
      yPosition += 10;

      // Add contact info
      pdf.text(`Email: ${formData.email} | Phone: ${formData.phone}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Location: ${formData.location}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`LinkedIn: ${formData.linkedin} | Twitter: ${formData.twitter}`, 20, yPosition);
      yPosition += 10;

      // Add Work Experience
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Work Experience", 20, yPosition);
      yPosition += 8;
      pdf.setFontSize(12);
      formData.experience.forEach((exp) => {
        pdf.text(`${exp.title} at ${exp.company}`, 20, yPosition);
        yPosition += 6;
        pdf.text(exp.dates, 20, yPosition);
        yPosition += 6;
        pdf.text(exp.description, 20, yPosition);
        yPosition += 8;
      });

      // Add Skills
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Skills & Competencies", 20, yPosition);
      yPosition += 8;
      pdf.setFontSize(12);
      pdf.text(formData.skills.join(", "), 20, yPosition);
      yPosition += 10;

      // Add Certificates
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Certificates", 20, yPosition);
      yPosition += 8;
      formData.certificates.forEach((cert) => {
        pdf.text(`${cert.title} - ${cert.issuedBy}`, 20, yPosition);
        yPosition += 6;
        pdf.text(`Issued: ${cert.date}`, 20, yPosition);
        yPosition += 8;
      });

      // Add Education
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Education", 20, yPosition);
      yPosition += 8;
      formData.education.forEach((edu) => {
        pdf.text(`${edu.degree}, ${edu.school}`, 20, yPosition);
        yPosition += 6;
        pdf.text(`Dates: ${edu.dates}`, 20, yPosition);
        yPosition += 8;
      });

      // Add Languages
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Languages", 20, yPosition);
      yPosition += 8;
      formData.languages.forEach((lang) => {
        pdf.text(`${lang.language} - ${lang.proficiency}`, 20, yPosition);
        yPosition += 6;
      });

      const pdfBlob = pdf.output("blob");
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    }

    // Store resume data in Firestore
    try {
      const docRef = await addDoc(collection(db, "resumes"), {
        userEmail: formData.email,
        resumeTitle: formData.resumeTitle,
        createdAt: new Date(),
      });
      console.log("Resume stored with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding resume to Firestore: ", error);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `${formData.fullName.replace(/\s+/g, "_")}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <>
      <Navbar />
      <div className=" bg-gradient-to-r from-purple-700 to-indigo-800 mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-extrabold mb-6 text-center text-indigo-600">Create Your Resume</h1>
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6 text-black">
            {/* Resume Title */}
            <div>
              <label htmlFor="resumeTitle" className="block text-sm font-medium text-gray-700">Resume Title</label>
              <input
                type="text"
                id="resumeTitle"
                name="resumeTitle"
                value={formData.resumeTitle}
                onChange={(e) => handleChange(e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>

            {/* Personal Information */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={(e) => handleChange(e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-gray-700">Profession</label>
              <input
                type="text"
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={(e) => handleChange(e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700">Professional Summary</label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={(e) => handleChange(e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Profile Image</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1 block w-full"
              />
            </div>

            {/* Contact Information */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleChange(e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => handleChange(e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={(e) => handleChange(e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required
              />
            </div>

            {/* Work Experience */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Work Experience</h2>
              {formData.experience.map((exp, index) => (
                <div key={index} className="space-y-2 mb-4">
                  <input
                    type="text"
                    name="title"
                    value={exp.title}
                    onChange={(e) => handleChange(e, index, "experience", "title")}
                    placeholder="Job Title"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <input
                    type="text"
                    name="company"
                    value={exp.company}
                    onChange={(e) => handleChange(e, index, "experience", "company")}
                    placeholder="Company"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <input
                    type="text"
                    name="dates"
                    value={exp.dates}
                    onChange={(e) => handleChange(e, index, "experience", "dates")}
                    placeholder="Dates of Employment"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <textarea
                    name="description"
                    value={exp.description}
                    onChange={(e) => handleChange(e, index, "experience", "description")}
                    placeholder="Description of Responsibilities"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveField("experience", index)}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddField("experience")}
                className="text-indigo-600"
              >
                Add Experience
              </button>
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Skills</h2>
              {formData.skills.map((skill, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleChange(e, index, "skills")}
                    placeholder="Skill"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveField("skills", index)}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddField("skills")}
                className="text-indigo-600"
              >
                Add Skill
              </button>
            </div>

            {/* Certificates */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Certificates</h2>
              {formData.certificates.map((cert, index) => (
                <div key={index} className="space-y-2 mb-4">
                  <input
                    type="text"
                    name="title"
                    value={cert.title}
                    onChange={(e) => handleChange(e, index, "certificates", "title")}
                    placeholder="Certificate Title"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <input
                    type="text"
                    name="issuedBy"
                    value={cert.issuedBy}
                    onChange={(e) => handleChange(e, index, "certificates", "issuedBy")}
                    placeholder="Issued By"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <input
                    type="text"
                    name="date"
                    value={cert.date}
                    onChange={(e) => handleChange(e, index, "certificates", "date")}
                    placeholder="Date Issued"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveField("certificates", index)}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddField("certificates")}
                className="text-indigo-600"
              >
                Add Certificate
              </button>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Education</h2>
              {formData.education.map((edu, index) => (
                <div key={index} className="space-y-2 mb-4">
                  <input
                    type="text"
                    name="degree"
                    value={edu.degree}
                    onChange={(e) => handleChange(e, index, "education", "degree")}
                    placeholder="Degree"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <input
                    type="text"
                    name="school"
                    value={edu.school}
                    onChange={(e) => handleChange(e, index, "education", "school")}
                    placeholder="School"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <input
                    type="text"
                    name="dates"
                    value={edu.dates}
                    onChange={(e) => handleChange(e, index, "education", "dates")}
                    placeholder="Dates Attended"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveField("education", index)}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddField("education")}
                className="text-indigo-600"
              >
                Add Education
              </button>
            </div>

            {/* Languages */}
            <div>
              <h2 className="text-xl font-semibold mb-2">Languages</h2>
              {formData.languages.map((lang, index) => (
                <div key={index} className="space-y-2 mb-4">
                  <input
                    type="text"
                    name="language"
                    value={lang.language}
                    onChange={(e) => handleChange(e, index, "languages", "language")}
                    placeholder="Language"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  <input
                    type="text"
                    name="proficiency"
                    value={lang.proficiency}
                    onChange={(e) => handleChange(e, index, "languages", "proficiency")}
                    placeholder="Proficiency"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveField("languages", index)}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleAddField("languages")}
                className="text-indigo-600"
              >
                Add Language
              </button>
            </div>

            {/* Buttons */}
            <div className="mt-6 text-center">
              <button
                onClick={generateResume}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Generate Resume
              </button>
              {pdfUrl && (
                <button
                  onClick={handleDownload}
                  className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Download Resume
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
