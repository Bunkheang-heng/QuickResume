'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaRegLightbulb, FaRegClone, FaRobot } from 'react-icons/fa';
import Navbar from '../components/nav';
import Footer from '../components/footer';

const HomePage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 leading-relaxed bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <main className="flex-1">
        <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-32 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div {...fadeIn} className="text-center">
              <h1 className="text-6xl font-extrabold mb-6 leading-tight">
                Craft Your Career Story with Precision
              </h1>
              <p className="text-2xl mb-10 max-w-3xl mx-auto">
                QuickResume: Where AI meets design to create resumes that open doors.
              </p>
              <Link href="/form" className="inline-block bg-white text-blue-600 py-4 px-10 rounded-full font-bold text-lg transition duration-300 ease-in-out hover:bg-blue-50 hover:shadow-lg transform hover:-translate-y-1">
                Build Your Resume Now
              </Link>
            </motion.div>
          </div>
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2 {...fadeIn} className="text-4xl font-bold text-center text-gray-800 mb-16">
              Revolutionize Your Resume Creation
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: <FaRegLightbulb className="text-5xl text-blue-500 mb-6" />, title: "Intuitive Design", description: "Our user-friendly interface makes resume creation a breeze, even for beginners." },
                { icon: <FaRegClone className="text-5xl text-blue-500 mb-6" />, title: "Professional Templates", description: "Choose from a curated selection of ATS-friendly templates tailored for your industry." },
                { icon: <FaRobot className="text-5xl text-blue-500 mb-6" />, title: "AI-Powered Assistance", description: "Leverage cutting-edge AI to optimize your content and stand out from the crowd." }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg transition duration-300 ease-in-out hover:shadow-2xl"
                  whileHover={{ scale: 1.05 }}
                >
                  {feature.icon}
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-gray-100">
          <div className="max-w-6xl mx-auto">
            <motion.h2 {...fadeIn} className="text-4xl font-bold text-center text-gray-800 mb-16">
              Success Stories
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { name: "Emily Chen", role: "Software Engineer", image: "https://lh5.googleusercontent.com/proxy/VJT2Prq80uIxF50pmyw5hev7yt7mmvhqIKm22QCJD8Am5T9tHFD8a8We-x87QS9V7SaD2M6JtKgo1CzbvVFr_L7qPR9NbcgQi5VEX1U42TWuGIU", quote: "QuickResume's AI suggestions helped me highlight my achievements in a way I never could have on my own." },
                { name: "Michael Johnson", role: "Marketing Director", image: "https://pbs.twimg.com/profile_images/1544734815710093312/C7N31v3y_400x400.jpg", quote: "The professional templates and easy editing features allowed me to create a standout resume in no time." },
                { name: "Sarah Thompson", role: "Healthcare Professional", image: "https://images.mubicdn.net/images/cast_member/238853/cache-288553-1512812927/image-w856.jpg", quote: "I was able to tailor my resume for different job applications effortlessly. It's a game-changer!" }
              ].map((testimonial, index) => (
                <motion.div 
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Image src={testimonial.image} alt={testimonial.name} width={80} height={80} className="rounded-full mx-auto mb-6" />
                  <p className="italic text-gray-600 mb-6">"{testimonial.quote}"</p>
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-blue-500">{testimonial.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4 bg-blue-600 text-white text-center">
          <div className="max-w-4xl mx-auto">
            <motion.h2 {...fadeIn} className="text-4xl font-bold mb-6">
              Ready to Transform Your Career?
            </motion.h2>
            <p className="text-xl mb-10">
              Join thousands of professionals who've accelerated their careers with QuickResume.
            </p>
            <Link href="/form2" className="inline-block bg-white text-blue-600 py-4 px-10 rounded-full font-bold text-lg transition duration-300 ease-in-out hover:bg-blue-50 hover:shadow-lg transform hover:-translate-y-1">
              Get Started for Free
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
