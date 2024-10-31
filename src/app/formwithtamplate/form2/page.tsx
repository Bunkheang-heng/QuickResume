"use client";

import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import Navbar from "@/components/nav";
import Footer from "@/components/footer";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function ResumePage() {
  // Form data state
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
    resumeTitle: "",
  });

  // PDF and form validation states
  const [pdfUrl, setPdfUrl] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // Check form validity
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

  // Form field handlers
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, 
    index?: number, 
    field?: keyof typeof formData, 
    subField?: string
  ) => {
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
    const newFieldTemplates = {
      experience: { title: "", company: "", dates: "", description: "" },
      skills: "",
      certificates: { title: "", issuedBy: "", date: "" },
      education: { degree: "", school: "", dates: "" },
      languages: { language: "", proficiency: "" }
    };

    setFormData((prevState) => ({
      ...prevState,
      [field]: [...(prevState[field] as any[]), newFieldTemplates[field as keyof typeof newFieldTemplates]]
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

  // PDF generation
  const generateResume = async () => {
    const pdf = new jsPDF();
    let yPosition = 20;

    if (formData.image) {
      const reader = new FileReader();
      reader.onload = function(event) {
        if (event.target && typeof event.target.result === 'string') {
          pdf.addImage(event.target.result, 'JPEG', 160, 10, 40, 40);
          addContentToPDF();
        }
      };
      reader.readAsDataURL(formData.image);
    } else {
      addContentToPDF();
    }

    function addContentToPDF() {
      // Header section
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text(formData.fullName, 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "normal");
      pdf.text(formData.profession, 20, yPosition);
      yPosition += 10;

      // Summary and contact info
      pdf.setFontSize(12);
      pdf.text(formData.summary, 20, yPosition);
      yPosition += 10;

      pdf.text(`Email: ${formData.email} | Phone: ${formData.phone}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Location: ${formData.location}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`LinkedIn: ${formData.linkedin} | Twitter: ${formData.twitter}`, 20, yPosition);
      yPosition += 10;

      // Work Experience section
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

      // Skills section
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Skills & Competencies", 20, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(12);
      pdf.text(formData.skills.join(", "), 20, yPosition);
      yPosition += 10;

      // Certificates section
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

      // Education section
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

      // Languages section
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

    // Store in Firestore
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mt-20 mx-auto"> {/* Changed from max-w-4xl to max-w-7xl */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-8 sm:p-10">
              <h1 className="text-4xl font-bold text-center text-gray-900 mb-10">
                Create Your Professional Resume
              </h1>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
                {/* Personal Details Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personal Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resume Title
                      </label>
                      <input
                        type="text"
                        name="resumeTitle"
                        value={formData.resumeTitle}
                        onChange={handleChange}
                        className="w-full text-black px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full text-black px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profession
                      </label>
                      <input
                        type="text"
                        name="profession"
                        value={formData.profession}
                        onChange={handleChange}
                        className="w-full text-black px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full text-black px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full text-black px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full text-black px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Professional Summary
                    </label>
                    <textarea
                      name="summary"
                      value={formData.summary}
                      onChange={handleChange}
                      rows={4}
                      className="w-full text-black px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full text-black px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Work Experience Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Work Experience</h2>
                    <button
                      type="button"
                      onClick={() => handleAddField("experience")}
                      className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      + Add Experience
                    </button>
                  </div>

                  {formData.experience.map((exp, index) => (
                    <div key={index} className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="title"
                          value={exp.title}
                          onChange={(e) => handleChange(e, index, "experience", "title")}
                          placeholder="Job Title"
                          className="w-full text-black px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          name="company"
                          value={exp.company}
                          onChange={(e) => handleChange(e, index, "experience", "company")}
                          placeholder="Company"
                          className="w-full text-black px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <input
                        type="text"
                        name="dates"
                        value={exp.dates}
                        onChange={(e) => handleChange(e, index, "experience", "dates")}
                        placeholder="Dates of Employment"
                        className="w-full text-black mt-4 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      <textarea
                        name="description"
                        value={exp.description}
                        onChange={(e) => handleChange(e, index, "experience", "description")}
                        placeholder="Description of Responsibilities"
                        className="w-full text-black mt-4 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        rows={3}
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveField("experience", index)}
                          className="mt-4 text-red-600 hover:text-red-800"
                        >
                          Remove Experience
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Skills Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Skills</h2>
                    <button
                      type="button"
                      onClick={() => handleAddField("skills")}
                      className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      + Add Skill
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.skills.map((skill, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) => handleChange(e, index, "skills")}
                          placeholder="Skill"
                          className="w-full text-black px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveField("skills", index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Education</h2>
                    <button
                      type="button"
                      onClick={() => handleAddField("education")}
                      className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      + Add Education
                    </button>
                  </div>

                  {formData.education.map((edu, index) => (
                    <div key={index} className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="degree"
                          value={edu.degree}
                          onChange={(e) => handleChange(e, index, "education", "degree")}
                          placeholder="Degree"
                          className="w-full text-black px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          name="school"
                          value={edu.school}
                          onChange={(e) => handleChange(e, index, "education", "school")}
                          placeholder="School"
                          className="w-full text-black px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      <input
                        type="text"
                        name="dates"
                        value={edu.dates}
                        onChange={(e) => handleChange(e, index, "education", "dates")}
                        placeholder="Dates Attended"
                        className="w-full text-black mt-4 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveField("education", index)}
                          className="mt-4 text-red-600 hover:text-red-800"
                        >
                          Remove Education
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Languages Section */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Languages</h2>
                    <button
                      type="button"
                      onClick={() => handleAddField("languages")}
                      className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      + Add Language
                    </button>
                  </div>

                  {formData.languages.map((lang, index) => (
                    <div key={index} className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="language"
                          value={lang.language}
                          onChange={(e) => handleChange(e, index, "languages", "language")}
                          placeholder="Language"
                          className="w-full text-black px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          name="proficiency"
                          value={lang.proficiency}
                          onChange={(e) => handleChange(e, index, "languages", "proficiency")}
                          placeholder="Proficiency"
                          className="w-full text-black px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveField("languages", index)}
                          className="mt-4 text-red-600 hover:text-red-800"
                        >
                          Remove Language
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={generateResume}
                    className="px-8 py-3 bg-indigo-600 text-white text-lg font-medium rounded-xl hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    Generate Resume
                  </button>
                  {pdfUrl && (
                    <button
                      onClick={handleDownload}
                      className="px-8 py-3 bg-green-600 text-white text-lg font-medium rounded-xl hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
                    >
                      Download Resume
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
