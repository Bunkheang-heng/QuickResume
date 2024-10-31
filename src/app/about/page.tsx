"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/nav';
import Footer from '@/components/footer';
import { motion } from 'framer-motion';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import Paro from "../../../public/paro.jpg" 
import Seng from "../../../public/kimseng.jpg" 

export default function About() {
  const teamMembers = [
    { 
      name: "HENG Bunkheang", 
      role: "Lead Developer", 
      image: "https://scontent-sin6-2.xx.fbcdn.net/v/t39.30808-1/308987124_1513739965739642_3650112743732886226_n.jpg?stp=dst-jpg_s320x320&_nc_cat=102&ccb=1-7&_nc_sid=50d2ac&_nc_ohc=x9CuU_vv3AUQ7kNvgHUzKMX&_nc_ht=scontent-sin6-2.xx&oh=00_AYBWQtV56VIt6ANIS4grPjst4WbVDlb_rDrexXZIIcym8g&oe=66DFE4AB",
      linkedin: "https://linkedin.com/in/hengbunkheang",
      github: "https://github.com/hengbunkheang",
      twitter: "https://twitter.com/hengbunkheang",
      bio: "Experienced lead developer with a passion for creating innovative solutions."
    },
    { 
      name: "CHHUN Paulen", 
      role: "UI/UX Designer", 
      image: "https://scontent-sin6-1.xx.fbcdn.net/v/t39.30808-6/313219743_3395578057338938_2502265063807015768_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=M3ZWDDX2OrsQ7kNvgH7eHxr&_nc_ht=scontent-sin6-1.xx&oh=00_AYCjoR-4Vi6sul481Sq8Tle0Qg4Egan-y3ltfphdP3W_MQ&oe=66DFDCFF",
      linkedin: "https://linkedin.com/in/chhunpaulen",
      github: "https://github.com/chhunpaulen",
      twitter: "https://twitter.com/chhunpaulen",
      bio: "Creative UI/UX designer with a keen eye for user-centric design principles."
    },
    { 
      name: "YUTH Paro", 
      role: "AI Specialist", 
      image: Paro,
      linkedin: "https://linkedin.com/in/yuthparo",
      github: "https://github.com/yuthparo",
      twitter: "https://twitter.com/yuthparo",
      bio: "AI enthusiast specializing in machine learning and natural language processing."
    },
    { 
      name: "Srun Kim Seng", 
      role: "Content Strategist", 
      image: Seng,
      linkedin: "https://linkedin.com/in/soksopheak",
      github: "https://github.com/soksopheak",
      twitter: "https://twitter.com/soksopheak",
      bio: "Experienced content strategist with a knack for creating engaging and impactful content."
    },
  ];

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          {/* ... (previous code remains unchanged) ... */}

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-20"
          >
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">Our Mission</h3>
              <p className="mt-4 text-lg text-gray-500">
                At QuickResume, we're dedicated to revolutionizing the resume creation process. Our mission is to empower job seekers with cutting-edge AI technology, making it effortless and effective for them to create standout resumes that showcase their unique talents and experiences.
              </p>
            </div>

            <div className="mt-20">
              <h3 className="text-2xl font-extrabold text-center text-gray-900 sm:text-3xl mb-8">Our Team</h3>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {teamMembers.map((member, index) => (
                  <motion.div 
                    key={member.name}
                    className="flip-card"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="flip-card-inner">
                      <div className="flip-card-front">
                        <Image
                          src={member.image}
                          alt={member.name}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2">
                          <h4 className="text-lg font-medium">{member.name}</h4>
                          <p className="text-sm">{member.role}</p>
                        </div>
                      </div>
                      <div className="flip-card-back bg-white p-4 flex flex-col justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{member.name}</h4>
                          <p className="text-base text-gray-600">{member.role}</p>
                          <p className="mt-2 text-sm text-gray-500">{member.bio}</p>
                        </div>
                        <div className="flex justify-center space-x-4 mt-4">
                          <a href={member.linkedin} target="_blank" rel="noopener noreferrer">
                            <FaLinkedin className="text-2xl text-blue-600 hover:text-blue-700" />
                          </a>
                          <a href={member.github} target="_blank" rel="noopener noreferrer">
                            <FaGithub className="text-2xl text-gray-800 hover:text-gray-900" />
                          </a>
                          <a href={member.twitter} target="_blank" rel="noopener noreferrer">
                            <FaTwitter className="text-2xl text-blue-400 hover:text-blue-500" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ... (remaining code stays the same) ... */}
        </div>
      </div>
      <Footer />
      <style jsx global>{`
        .flip-card {
          perspective: 1000px;
          height: 300px;
        }
        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .flip-card:hover .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </>
  );
}
