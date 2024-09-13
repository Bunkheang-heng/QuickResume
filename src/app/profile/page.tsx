"use client";

import React, { useState, useEffect } from 'react';
import {FaEnvelope, FaPencilAlt, FaSave, FaSignOutAlt, FaUserCog } from 'react-icons/fa';
import { auth, db } from '../../firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/nav';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setEmail(currentUser.email || '');
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setName(userDoc.data().name || '');
          setRole(userDoc.data().role || '');
        }
      } else {
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), { name, role });
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
    }
  };

  const handleAdminRedirect = () => {
    router.push('/admin');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-indigo-600 text-white">
            <h3 className="text-2xl leading-6 font-medium">User Profile</h3>
            <p className="mt-1 max-w-2xl text-sm">Personal details and information</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="flex flex-col items-center pb-10">
              <Image
                src="https://media.tenor.com/b9_3aZ4FLOkAAAAM/black-man-staring.gif"
                alt="Profile"
                width={200}
                height={200}
                className="rounded-full mb-3"
              />
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-4 text-xl font-medium text-gray-900 border-b-2 border-indigo-600 focus:outline-none"
                />
              ) : (
                <h5 className="mb-1 text-xl font-medium text-gray-900">{name}</h5>
    
              )}
              <span className="text-sm text-gray-500 flex items-center">
                <FaEnvelope className="mr-2" /> {email}
              </span>
              <span className="text-sm text-gray-500 flex items-center">
                 {role}
              </span>
              <div className="flex mt-4 space-x-3 md:mt-6">
                {isEditing ? (
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300"
                  >
                    <FaSave className="mr-2" /> Save
                  </button>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300"
                  >
                    <FaPencilAlt className="mr-2" /> Edit Profile
                  </button>
                )}
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200"
                >
                  <FaSignOutAlt className="mr-2" /> Sign Out
                </button>
                {role === 'admin' && (
                  <button
                    onClick={handleAdminRedirect}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300"
                  >
                    <FaUserCog className="mr-2" /> Admin Page
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ProfilePage;
